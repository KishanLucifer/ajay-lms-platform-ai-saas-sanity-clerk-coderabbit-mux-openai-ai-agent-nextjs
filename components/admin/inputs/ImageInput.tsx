"use client";

import { Suspense, useRef, useState } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/actions/images";
import { urlFor } from "@/sanity/lib/image";
import type { Course } from "@/sanity.types";
import Image from "next/image";

interface ImageInputProps extends DocumentHandle {
  path: string;
  label: string;
}

type ImageFieldValue = Course["thumbnail"];

function ImageInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>
      <Skeleton className="h-32 w-full bg-zinc-800" />
    </div>
  );
}

function ImageInputField({ path, label, ...handle }: ImageInputProps) {
  const { data: imageData } = useDocument<ImageFieldValue>({
    ...handle,
    path,
  });
  const editImage = useEditDocument<ImageFieldValue | null>({
    ...handle,
    path,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const image = imageData as ImageFieldValue | null;
  const hasImage = image?.asset?._ref;

  async function handleUpload(file: File) {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImage(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.assetId) {
        editImage({
          _type: "image",
          asset: {
            _type: "reference",
            _ref: result.assetId,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    e.target.value = "";
  }

  function handleRemove() {
    editImage(null);
    setError(null);
  }

  function handleClick() {
    fileInputRef.current?.click();
  }

  const imageUrl = hasImage ? urlFor(image).width(400).height(225).url() : null;

  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      <div
        className={`relative rounded-lg border border-zinc-700 bg-zinc-800/30 ${
          isUploading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {hasImage && imageUrl ? (
          <div className="relative group">
            <Image
              width={400}
              height={225}
              src={imageUrl}
              alt="Thumbnail preview"
              className="w-full h-auto rounded-lg object-cover aspect-video"
            />

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                disabled={isUploading}
                className="bg-zinc-800 hover:bg-zinc-700"
              >
                <Upload className="h-4 w-4 mr-1" />
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>

            {isUploading && (
              <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className="w-full py-8 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-400 transition-colors cursor-pointer"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 mb-2 animate-spin text-violet-500" />
                <p className="text-sm">Uploading...</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-10 w-10 mb-2" />
                <p className="text-sm font-medium">Click to upload</p>
                <p className="text-xs mt-1 text-zinc-600">
                  JPEG, PNG, GIF, or WebP (max 10MB)
                </p>
              </>
            )}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export function ImageInput(props: ImageInputProps) {
  return (
    <Suspense fallback={<ImageInputFallback label={props.label} />}>
      <ImageInputField {...props} />
    </Suspense>
  );
}
