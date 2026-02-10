"use server";

import { writeClient } from "@/sanity/lib/client";

interface UploadImageResult {
  assetId: string | null;
  error?: string;
}

export async function uploadImage(formData: FormData): Promise<UploadImageResult> {
  const file = formData.get("file") as File | null;

  if (!file) {
    return { assetId: null, error: "No file provided" };
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return {
      assetId: null,
      error: "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.",
    };
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      assetId: null,
      error: "File too large. Maximum size is 10MB.",
    };
  }

  try {
    // Convert File to Buffer for Sanity upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Sanity
    const asset = await writeClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return { assetId: asset._id };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload image";

    console.error("Image upload error:", error);
    return { assetId: null, error: errorMessage };
  }
}

export async function deleteImage(assetId: string): Promise<{ success: boolean; error?: string }> {
  if (!assetId) {
    return { success: false, error: "No asset ID provided" };
  }

  try {
    await writeClient.delete(assetId);
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete image";

    console.error("Image delete error:", error);
    return { success: false, error: errorMessage };
  }
}

