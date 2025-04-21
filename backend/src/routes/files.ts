// For now, we're keeping file upload functionality with basic support
// but we'll need to replace multer with @fastify/multipart later
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { prisma } from '../prisma';
import type { FastifyRequest } from 'fastify';
import {
  generateUniqueFilename,
  getPresignedUploadUrl,
  getPresignedDownloadUrl,
  deleteFile,
} from "../s3";

// Type definitions
interface GetUploadUrlBody {
  fileName: string;
  contentType: string;
  userId: string;
  userEmail: string;
  userName?: string;
  taskId?: string;
  title?: string;
  description?: string;
}

interface FileIdParam {
  id: string;
}

interface FileCompleteBody {
  fileSize: number;
  fileUrl: string;
}

interface FileQueryParams {
  userId?: string;
  taskId?: string;
}

// Define the files plugin
const fileRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Since we're temporarily skipping direct file upload functionality,
  // we'll focus on implementing the presigned URL approach

  // Schema for POST /files/get-upload-url - Get a presigned URL for direct upload
  const getUploadUrlSchema = {
    body: {
      type: 'object',
      required: ['fileName', 'contentType', 'userId', 'userEmail'],
      properties: {
        fileName: { type: 'string' },
        contentType: { type: 'string' },
        userId: { type: 'string' },
        userEmail: { type: 'string', format: 'email' },
        userName: { type: 'string' },
        taskId: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          uploadUrl: { type: 'string' },
          fileId: { type: 'string' },
          fileKey: { type: 'string' }
        }
      }
    }
  };

  // POST /files/get-upload-url - Get a presigned URL for direct upload
  fastify.post<{
    Body: GetUploadUrlBody
  }>('/get-upload-url', { schema: getUploadUrlSchema }, async (request, reply) => {
    try {
      const { 
        fileName, 
        contentType, 
        userId, 
        userEmail, 
        userName, 
        taskId,
        title,
        description 
      } = request.body;

      if (!fileName || !contentType || !userId || !userEmail) {
        throw fastify.httpErrors.badRequest("fileName, contentType, userId, and userEmail are required");
      }

      // Generate a unique filename
      const uniqueFilename = generateUniqueFilename(fileName);

      // Get presigned URL
      const { url, key } = await getPresignedUploadUrl(
        uniqueFilename,
        contentType,
        "uploads"
      );

      // Create a database record with empty fileUrl (will be updated after upload)
      const fileAttachment = await prisma.fileAttachment.create({
        data: {
          fileName: title || fileName, // Use title if provided, otherwise use the original filename
          originalFileName: fileName, // Store the original filename
          description: description || null, // Optional description
          fileKey: key,
          fileUrl: "", // Will be updated after client upload
          fileType: contentType,
          fileSize: 0, // Will be updated after client upload
          userId,
          taskId,
        },
      });

      return {
        uploadUrl: url,
        fileId: fileAttachment.id,
        fileKey: key,
      };
    } catch (error) {
      request.log.error("Error generating upload URL:", error);
      throw fastify.httpErrors.internalServerError("Failed to generate upload URL");
    }
  });

  // Schema for PUT /files/:id/complete - Complete a client-side upload
  const completeUploadSchema = {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' }
      }
    },
    body: {
      type: 'object',
      required: ['fileSize', 'fileUrl'],
      properties: {
        fileSize: { type: 'number' },
        fileUrl: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          fileName: { type: 'string' },
          originalFileName: { type: 'string' },
          description: { type: ['string', 'null'] },
          fileKey: { type: 'string' },
          fileUrl: { type: 'string' },
          fileType: { type: 'string' },
          fileSize: { type: 'number' },
          userId: { type: 'string' },
          taskId: { type: ['string', 'null'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  };

  // PUT /files/:id/complete - Complete a client-side upload
  fastify.put<{
    Params: FileIdParam,
    Body: FileCompleteBody
  }>('/:id/complete', { schema: completeUploadSchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { fileSize, fileUrl } = request.body;

      if (!fileSize || !fileUrl) {
        throw fastify.httpErrors.badRequest("fileSize and fileUrl are required");
      }

      // Update the file record with actual size and URL
      const fileAttachment = await prisma.fileAttachment.update({
        where: { id },
        data: {
          fileSize: Number(fileSize),
          fileUrl,
        },
      });

      return fileAttachment;
    } catch (error) {
      request.log.error("Error completing file upload:", error);
      throw fastify.httpErrors.internalServerError("Failed to complete file upload");
    }
  });

  // Schema for GET /files - Get all files for a user or task
  const getFilesSchema = {
    querystring: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        taskId: { type: 'string' }
      },
      oneOf: [
        { required: ['userId'] },
        { required: ['taskId'] }
      ]
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            fileName: { type: 'string' },
            originalFileName: { type: 'string' },
            description: { type: ['string', 'null'] },
            fileKey: { type: 'string' },
            fileUrl: { type: 'string' },
            fileType: { type: 'string' },
            fileSize: { type: 'number' },
            userId: { type: 'string' },
            taskId: { type: ['string', 'null'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  };

  // GET /files - Get all files for a user or task
  fastify.get<{
    Querystring: FileQueryParams
  }>('/', { schema: getFilesSchema }, async (request, reply) => {
    try {
      const { userId, taskId } = request.query;

      if (!userId && !taskId) {
        throw fastify.httpErrors.badRequest("Either userId or taskId is required");
      }

      const files = await prisma.fileAttachment.findMany({
        where: {
          ...(userId ? { userId: userId } : {}),
          ...(taskId ? { taskId: taskId } : {}),
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return files;
    } catch (error) {
      request.log.error("Error fetching files:", error);
      throw fastify.httpErrors.internalServerError("Failed to fetch files");
    }
  });

  // Schema for GET /files/:id - Get a single file by ID
  const getFileByIdSchema = {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          fileName: { type: 'string' },
          originalFileName: { type: 'string' },
          description: { type: ['string', 'null'] },
          fileKey: { type: 'string' },
          fileUrl: { type: 'string' },
          fileType: { type: 'string' },
          fileSize: { type: 'number' },
          userId: { type: 'string' },
          taskId: { type: ['string', 'null'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  };

  // GET /files/:id - Get a single file by ID
  fastify.get<{
    Params: FileIdParam
  }>('/:id', { schema: getFileByIdSchema }, async (request, reply) => {
    try {
      const { id } = request.params;

      const file = await prisma.fileAttachment.findUnique({
        where: { id },
      });

      if (!file) {
        throw fastify.httpErrors.notFound("File not found");
      }

      return file;
    } catch (error) {
      request.log.error("Error fetching file:", error);
      if ((error as any).statusCode) throw error;
      throw fastify.httpErrors.internalServerError("Failed to fetch file");
    }
  });

  // Schema for GET /files/:id/download - Get a presigned download URL
  const getDownloadUrlSchema = {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          downloadUrl: { type: 'string' }
        }
      }
    }
  };

  // GET /files/:id/download - Get a presigned download URL
  fastify.get<{
    Params: FileIdParam
  }>('/:id/download', { schema: getDownloadUrlSchema }, async (request, reply) => {
    try {
      const { id } = request.params;

      const file = await prisma.fileAttachment.findUnique({
        where: { id },
      });

      if (!file) {
        throw fastify.httpErrors.notFound("File not found");
      }

      // Generate presigned download URL
      const downloadUrl = await getPresignedDownloadUrl(file.fileKey);

      return { downloadUrl };
    } catch (error) {
      request.log.error("Error generating download URL:", error);
      if ((error as any).statusCode) throw error;
      throw fastify.httpErrors.internalServerError("Failed to generate download URL");
    }
  });

  // Schema for DELETE /files/:id - Delete a file
  const deleteFileSchema = {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' }
        }
      }
    }
  };

  // DELETE /files/:id - Delete a file
  fastify.delete<{
    Params: FileIdParam
  }>('/:id', { schema: deleteFileSchema }, async (request, reply) => {
    try {
      const { id } = request.params;

      // Find the file record
      const file = await prisma.fileAttachment.findUnique({
        where: { id },
      });

      if (!file) {
        throw fastify.httpErrors.notFound("File not found");
      }

      // Delete from S3
      await deleteFile(file.fileKey);

      // Delete from database
      await prisma.fileAttachment.delete({
        where: { id },
      });

      return { success: true };
    } catch (error) {
      request.log.error("Error deleting file:", error);
      if ((error as any).statusCode) throw error;
      throw fastify.httpErrors.internalServerError("Failed to delete file");
    }
  });

  // Note: We're skipping the direct file upload implementation for now
  // We'll need to implement it later with @fastify/multipart

};

export default fileRoutes;