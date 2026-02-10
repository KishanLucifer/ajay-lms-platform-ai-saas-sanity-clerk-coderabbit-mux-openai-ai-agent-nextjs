"use client";

import { Suspense, useState, useRef, useCallback, useEffect } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import {
  EditorProvider,
  PortableTextEditable,
  keyGenerator,
  type PortableTextBlock,
} from "@portabletext/editor";
import { EventListenerPlugin } from "@portabletext/editor/plugins";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2, ImageIcon, Upload } from "lucide-react";
import { uploadImage } from "@/lib/actions/images";
import { schemaDefinition } from "./schema";
import { Toolbar } from "./Toolbar";
import {
  renderStyle,
  renderDecorator,
  renderBlock,
  renderListItem,
  renderAnnotation,
} from "./renderFunctions";

interface PortableTextInputProps extends DocumentHandle {
  path: string;
  label: string;
}

function PortableTextInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>
      <Skeleton className="h-64 w-full bg-zinc-800 rounded-lg" />
    </div>
  );
}

function PortableTextInputField({
  path,
  label,
  ...handle
}: PortableTextInputProps) {
  const { data: contentData } = useDocument<PortableTextBlock[] | null>({
    ...handle,
    path,
  });
  const editContent = useEditDocument<PortableTextBlock[] | null>({
    ...handle,
    path,
  });

  // Editor key for forcing re-mount on external changes or image insert
  const [editorKey, setEditorKey] = useState(0);

  // Track if we're expecting changes from our own mutations
  // This prevents re-mounting when typing
  const pendingMutationCountRef = useRef(0);
  const lastContentLengthRef = useRef<number | null>(null);

  // Detect external changes (e.g., discard) by checking if content changed unexpectedly
  useEffect(() => {
    const currentLength = contentData?.length ?? 0;
    const lastLength = lastContentLengthRef.current;

    // If we have pending mutations, decrement and don't re-mount
    if (pendingMutationCountRef.current > 0) {
      pendingMutationCountRef.current--;
      lastContentLengthRef.current = currentLength;
      return;
    }

    // If content length changed significantly and we didn't cause it, it's likely external
    // (This handles discard which typically resets to a different state)
    if (lastLength !== null && lastLength !== currentLength) {
      setEditorKey((k) => k + 1);
    }

    lastContentLengthRef.current = currentLength;
  }, [contentData]);

  // Image upload modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep track of pending image to insert
  const [pendingImageAssetId, setPendingImageAssetId] = useState<string | null>(
    null,
  );

  // Track insertion position for images
  const [insertionIndex, setInsertionIndex] = useState<number | null>(null);

  // Handle image file selection
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadError(null);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadImage(formData);

        if (result.error) {
          setUploadError(result.error);
          return;
        }

        if (result.assetId) {
          setPendingImageAssetId(result.assetId);
        }
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : "Failed to upload image",
        );
      } finally {
        setIsUploading(false);
      }

      e.target.value = "";
    },
    [],
  );

  // Insert image block into content
  const handleInsertImage = useCallback(() => {
    if (!pendingImageAssetId) return;

    const currentContent = contentData || [];

    // Create new image block
    const imageBlock: PortableTextBlock = {
      _type: "image",
      _key: keyGenerator(),
      asset: {
        _type: "reference",
        _ref: pendingImageAssetId,
      },
      caption: imageCaption || undefined,
      alt: imageAlt || undefined,
    } as unknown as PortableTextBlock;

    // Insert at the stored position, or append to end
    const idx = insertionIndex ?? currentContent.length;
    const newContent = [
      ...currentContent.slice(0, idx),
      imageBlock,
      ...currentContent.slice(idx),
    ];

    // Mark that we're expecting this change
    pendingMutationCountRef.current++;
    editContent(newContent);

    // Force editor re-mount to show the new image
    // (because we're bypassing the editor's internal state management)
    setEditorKey((k) => k + 1);

    // Reset modal state
    setShowImageModal(false);
    setPendingImageAssetId(null);
    setImageCaption("");
    setImageAlt("");
    setUploadError(null);
    setInsertionIndex(null);
  }, [
    pendingImageAssetId,
    imageCaption,
    imageAlt,
    contentData,
    editContent,
    insertionIndex,
  ]);

  // Handle opening image modal
  const handleOpenImageModal = useCallback((index: number) => {
    setInsertionIndex(index);
    setShowImageModal(true);
    setPendingImageAssetId(null);
    setImageCaption("");
    setImageAlt("");
    setUploadError(null);
  }, []);

  // Handle closing image modal
  const handleCloseImageModal = useCallback(() => {
    setShowImageModal(false);
    setPendingImageAssetId(null);
    setImageCaption("");
    setImageAlt("");
    setUploadError(null);
    setInsertionIndex(null);
  }, []);

  // Handle mutations from PTE
  const handleMutation = useCallback(
    (event: { type: string; value?: PortableTextBlock[] }) => {
      if (event.type === "mutation" && event.value !== undefined) {
        // Mark that we're expecting this change (prevents external change detection)
        pendingMutationCountRef.current++;
        editContent(event.value);
      }
    },
    [editContent],
  );

  const initialValue = contentData || undefined;

  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>

      <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 overflow-hidden">
        <EditorProvider
          key={editorKey}
          initialConfig={{
            schemaDefinition,
            initialValue,
          }}
        >
          <EventListenerPlugin on={handleMutation} />
          <Toolbar onInsertImage={handleOpenImageModal} />
          <div className="p-4 min-h-[200px] max-h-[500px] overflow-y-auto focus-within:ring-1 focus-within:ring-violet-500/50">
            <PortableTextEditable
              className="outline-none prose prose-invert max-w-none"
              renderStyle={renderStyle}
              renderDecorator={renderDecorator}
              renderBlock={renderBlock}
              renderListItem={renderListItem}
              renderAnnotation={renderAnnotation}
              renderPlaceholder={() => (
                <span className="text-zinc-500 pointer-events-none">
                  Start writing your content...
                </span>
              )}
            />
          </div>
        </EditorProvider>
      </div>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Insert Image</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCloseImageModal}
                className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />

            {!pendingImageAssetId ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`w-full border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 transition-colors bg-transparent ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-10 w-10 mx-auto mb-2 animate-spin text-violet-500" />
                    <p className="text-sm text-zinc-400">Uploading...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto mb-2 text-zinc-500" />
                    <p className="text-sm font-medium text-zinc-300">
                      Click to upload image
                    </p>
                    <p className="text-xs mt-1 text-zinc-500">
                      JPEG, PNG, GIF, or WebP (max 10MB)
                    </p>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-zinc-800 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-zinc-300">
                    Image uploaded successfully
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-zinc-400 text-sm">
                      Caption (optional)
                    </Label>
                    <Input
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Add a caption..."
                      className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-300"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-400 text-sm">
                      Alt text (for accessibility)
                    </Label>
                    <Input
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Describe the image..."
                      className="mt-1 bg-zinc-800 border-zinc-700 text-zinc-300"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPendingImageAssetId(null);
                      fileInputRef.current?.click();
                    }}
                    className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  >
                    Choose Different
                  </Button>
                  <Button
                    type="button"
                    onClick={handleInsertImage}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    Insert Image
                  </Button>
                </div>
              </div>
            )}

            {uploadError && (
              <p className="text-sm text-red-400 mt-3">{uploadError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PortableTextInput(props: PortableTextInputProps) {
  return (
    <Suspense fallback={<PortableTextInputFallback label={props.label} />}>
      <PortableTextInputField {...props} />
    </Suspense>
  );
}
