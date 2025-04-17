import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as crypto from "crypto";
import * as path from "path";

// Load AWS credentials from environment variables
const region = process.env.AWS_REGION || "us-east-1";
const bucket = process.env.S3_BUCKET_NAME;

if (!bucket) {
  throw new Error("S3_BUCKET_NAME is not defined in environment variables");
}

// Initialize S3 client
export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Generate a unique filename for S3 uploads
 * @param originalFilename - The original filename
 * @returns A unique filename with timestamp and random string
 */
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  const extension = path.extname(originalFilename);
  const filename = path.basename(originalFilename, extension);
  
  return `${filename}-${timestamp}-${randomString}${extension}`;
}

/**
 * Upload a file to S3
 * @param fileBuffer - The file buffer to upload
 * @param filename - The filename
 * @param contentType - The content type of the file
 * @param folder - Optional folder path in the bucket
 * @returns The S3 URL of the uploaded file
 */
export async function uploadFile(
  fileBuffer: Buffer,
  filename: string,
  contentType: string,
  folder = "uploads"
): Promise<string> {
  const key = folder ? `${folder}/${filename}` : filename;

  const params = {
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
}

/**
 * Get a presigned URL for uploading a file directly from the client
 * @param filename - The filename
 * @param contentType - The content type of the file
 * @param folder - Optional folder path in the bucket
 * @param expiresIn - Expiration time in seconds (default: 60 minutes)
 * @returns The presigned URL and the file key
 */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  folder = "uploads",
  expiresIn = 3600
): Promise<{ url: string; key: string }> {
  const key = folder ? `${folder}/${filename}` : filename;

  const params = {
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return { url, key };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate presigned URL");
  }
}

/**
 * Get a presigned URL for downloading a file
 * @param key - The S3 object key
 * @param expiresIn - Expiration time in seconds (default: 60 minutes)
 * @returns The presigned URL for downloading
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const command = new GetObjectCommand(params);
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Error generating download URL:", error);
    throw new Error("Failed to generate download URL");
  }
}

/**
 * Delete a file from S3
 * @param key - The S3 object key
 * @returns Success status
 */
export async function deleteFile(key: string): Promise<boolean> {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("Failed to delete file from S3");
  }
}