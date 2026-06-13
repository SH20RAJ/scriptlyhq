import fs from "fs/promises";
import path from "path";

/**
 * Saves a product file securely to a non-public directory
 * @returns absolute file path
 */
export async function saveProductFile(file: File): Promise<string> {
  const uploadDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  
  const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(uploadDir, cleanName);
  
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  
  return filePath;
}

/**
 * Saves a product thumbnail to the public directory
 * @returns public URL path
 */
export async function saveThumbnailFile(file: File): Promise<string> {
  const thumbnailDir = path.join(process.cwd(), "public", "thumbnails");
  await fs.mkdir(thumbnailDir, { recursive: true });
  
  const cleanName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(thumbnailDir, cleanName);
  
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  
  return `/thumbnails/${cleanName}`;
}

/**
 * Deletes a file from the secure uploads folder
 */
export async function deleteProductFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.warn(`Could not delete file at ${filePath}:`, error);
  }
}

/**
 * Deletes a thumbnail from the public folder
 */
export async function deleteThumbnailFile(urlPath: string): Promise<void> {
  try {
    if (urlPath.startsWith("/thumbnails/")) {
      const fullPath = path.join(process.cwd(), "public", urlPath);
      await fs.unlink(fullPath);
    }
  } catch (error) {
    console.warn(`Could not delete thumbnail at ${urlPath}:`, error);
  }
}
