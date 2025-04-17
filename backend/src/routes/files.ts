import express, { Router, Request, Response } from "express";
import { prisma } from "../prisma";
import multer from "multer";
import {
  uploadFile,
  generateUniqueFilename,
  getPresignedUploadUrl,
  getPresignedDownloadUrl,
  deleteFile,
} from "../s3";

// Create a router instance
const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Helper function to ensure a user exists
// async function ensureUserExists(clerkId: string, email: string, name?: string) {
//   try {
//     // Check if user exists
//     let user = await prisma.user.findUnique({
//       where: { clerkId },
//     });

//     // If user doesn't exist, create them
//     if (!user) {
//       user = await prisma.user.create({
//         data: {
//           clerkId,
//           email,
//           name,
//         },
//       });
//       console.log(`Created new user with clerkId: ${clerkId}`);
//     }

//     return user;
//   } catch (error) {
//     console.error("Error ensuring user exists:", error);
//     throw error;
//   }
// }

// POST /files/upload - Upload a file directly
router.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      const { userId, userEmail, userName, taskId, title, description } = req.body;

      if (!file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      if (!userId || !userEmail) {
        res.status(400).json({
          error: "userId and userEmail are required",
        });
        return;
      }

      // Ensure the user exists in our database
      // await ensureUserExists(userId, userEmail, userName);

      // Generate a unique filename
      const uniqueFilename = generateUniqueFilename(file.originalname);

      // Upload file to S3
      const fileUrl = await uploadFile(
        file.buffer,
        uniqueFilename,
        file.mimetype,
        "uploads"
      );

      // Store file metadata in database
      const fileAttachment = await prisma.fileAttachment.create({
        data: {
          fileName: title || file.originalname, // Use the title if provided
          originalFileName: file.originalname, // Always store the original filename
          description: description || null, // Optional description
          fileKey: `uploads/${uniqueFilename}`,
          fileUrl,
          fileType: file.mimetype,
          fileSize: file.size,
          userId,
          taskId,
        },
      });

      res.status(201).json(fileAttachment);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  }
);

// POST /files/get-upload-url - Get a presigned URL for direct upload
router.post(
  "/get-upload-url",
  async (req: Request, res: Response): Promise<void> => {
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
      } = req.body;

      if (!fileName || !contentType || !userId || !userEmail) {
        res.status(400).json({
          error: "fileName, contentType, userId, and userEmail are required",
        });
        return;
      }

      // Ensure the user exists in our database
      // await ensureUserExists(userId, userEmail, userName);

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

      res.status(200).json({
        uploadUrl: url,
        fileId: fileAttachment.id,
        fileKey: key,
      });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  }
);

// PUT /files/:id/complete - Complete a client-side upload
router.put(
  "/:id/complete",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { fileSize, fileUrl } = req.body;

      if (!fileSize || !fileUrl) {
        res.status(400).json({
          error: "fileSize and fileUrl are required",
        });
        return;
      }

      // Update the file record with actual size and URL
      const fileAttachment = await prisma.fileAttachment.update({
        where: { id },
        data: {
          fileSize: Number(fileSize),
          fileUrl,
        },
      });

      res.status(200).json(fileAttachment);
    } catch (error) {
      console.error("Error completing file upload:", error);
      res.status(500).json({ error: "Failed to complete file upload" });
    }
  }
);

// GET /files - Get all files for a user or task
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, taskId } = req.query;

    if (!userId && !taskId) {
      res.status(400).json({
        error: "Either userId or taskId is required",
      });
      return;
    }

    const files = await prisma.fileAttachment.findMany({
      where: {
        ...(userId ? { userId: userId as string } : {}),
        ...(taskId ? { taskId: taskId as string } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// GET /files/:id - Get a single file by ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const file = await prisma.fileAttachment.findUnique({
      where: { id },
    });

    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    res.status(200).json(file);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Failed to fetch file" });
  }
});

// GET /files/:id/download - Get a presigned download URL
router.get(
  "/:id/download",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const file = await prisma.fileAttachment.findUnique({
        where: { id },
      });

      if (!file) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      // Generate presigned download URL
      const downloadUrl = await getPresignedDownloadUrl(file.fileKey);

      res.status(200).json({ downloadUrl });
    } catch (error) {
      console.error("Error generating download URL:", error);
      res.status(500).json({ error: "Failed to generate download URL" });
    }
  }
);

// DELETE /files/:id - Delete a file
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find the file record
    const file = await prisma.fileAttachment.findUnique({
      where: { id },
    });

    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    // Delete from S3
    await deleteFile(file.fileKey);

    // Delete from database
    await prisma.fileAttachment.delete({
      where: { id },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

export default router;
