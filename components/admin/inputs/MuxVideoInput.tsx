"use client";

import { Suspense, useEffect, useState } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import MuxUploader from "@mux/mux-uploader-react";
import MuxPlayer from "@mux/mux-player-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { XCircle, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import {
  createMuxUploadUrl,
  getMuxUploadStatus,
  getMuxSignedTokens,
} from "@/lib/actions/mux";

interface MuxVideoInputProps extends DocumentHandle {
  path: string;
  label: string;
}

interface MuxVideoAsset {
  _type: "reference";
  _ref: string;
}

interface MuxVideo {
  _type: "mux.video";
  asset?: MuxVideoAsset;
}

interface MuxAssetData {
  playbackId?: string;
  status?: string;
  data?: {
    duration?: number;
    aspect_ratio?: string;
  };
}

interface MuxTokens {
  playback: string;
  thumbnail: string;
  storyboard: string;
}

type UploadState = "idle" | "uploading" | "processing" | "ready" | "error";

function MuxVideoInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>
      <Skeleton className="h-48 w-full bg-zinc-800" />
    </div>
  );
}

function MuxVideoInputField({ path, label, ...handle }: MuxVideoInputProps) {
  const { data: videoData } = useDocument<MuxVideo>({
    ...handle,
    path,
  });
  const editVideo = useEditDocument<MuxVideo | null>({
    ...handle,
    path,
  });

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<MuxTokens | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [assetData, setAssetData] = useState<MuxAssetData | null>(null);

  const video = videoData as MuxVideo | null;
  const assetRef = video?.asset?._ref;
  const hasVideo = Boolean(assetRef);
  const playbackId = assetData?.playbackId;
  const duration = assetData?.data?.duration;

  // Fetch asset data when we have a reference
  useEffect(() => {
    if (assetRef && !assetData) {
      // Fetch the asset document using server action
      import("@/sanity/lib/client").then(({ client }) => {
        client
          .fetch<MuxAssetData>(`*[_id == $id][0]{ playbackId, status, data }`, {
            id: assetRef,
          })
          .then(setAssetData)
          .catch(console.error);
      });
    }
  }, [assetRef, assetData]);

  async function initializeUpload() {
    setError(null);
    const result = await createMuxUploadUrl();
    if (result.error) {
      setError(result.error);
      return;
    }
    setUploadUrl(result.uploadUrl);
    setUploadId(result.uploadId);
  }

  // Initialize upload URL when component mounts and no video exists
  useEffect(() => {
    async function init() {
      setError(null);
      const result = await createMuxUploadUrl();
      if (result.error) {
        setError(result.error);
        return;
      }
      setUploadUrl(result.uploadUrl);
      setUploadId(result.uploadId);
    }

    if ((!hasVideo || isReplacing) && !uploadUrl) {
      init();
    }
  }, [hasVideo, uploadUrl, isReplacing]);

  // Fetch tokens when we have a playbackId
  useEffect(() => {
    if (playbackId && !tokens) {
      getMuxSignedTokens(playbackId).then((result) => {
        if (
          result.playbackToken &&
          result.thumbnailToken &&
          result.storyboardToken
        ) {
          setTokens({
            playback: result.playbackToken,
            thumbnail: result.thumbnailToken,
            storyboard: result.storyboardToken,
          });
        }
      });
    }
  }, [playbackId, tokens]);

  function handleUploadStart() {
    setUploadState("uploading");
    setError(null);
  }

  async function handleUploadSuccess() {
    if (!uploadId) return;

    setUploadState("processing");

    // Poll for asset status
    const pollInterval = setInterval(async () => {
      const status = await getMuxUploadStatus(uploadId);

      if (status.error) {
        setError(status.error);
        setUploadState("error");
        clearInterval(pollInterval);
        return;
      }

      if (status.status === "ready" && status.sanityAssetId) {
        // Reference the Sanity mux.videoAsset document that was created
        editVideo({
          _type: "mux.video",
          asset: {
            _type: "reference",
            _ref: status.sanityAssetId,
          },
        });

        setUploadState("ready");
        clearInterval(pollInterval);
      } else if (status.status === "errored") {
        setError("Video processing failed");
        setUploadState("error");
        clearInterval(pollInterval);
      }
    }, 2000);

    // Clean up after 5 minutes max
    setTimeout(() => clearInterval(pollInterval), 300000);
  }

  function handleUploadError() {
    setError("Upload failed");
    setUploadState("error");
  }

  function handleRemove() {
    editVideo(null);
    setUploadState("idle");
    setUploadUrl(null);
    setUploadId(null);
    setError(null);
    setTokens(null);
    setAssetData(null);
    setIsReplacing(false);
  }

  function handleRetry() {
    setUploadState("idle");
    setUploadUrl(null);
    setUploadId(null);
    setError(null);
    initializeUpload();
  }

  function handleReplace() {
    setIsReplacing(true);
    setUploadUrl(null);
    setUploadId(null);
    initializeUpload();
  }

  function handleCancelReplace() {
    setIsReplacing(false);
    setUploadUrl(null);
    setUploadId(null);
    setUploadState("idle");
  }

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // Video already uploaded - show preview
  if (hasVideo && !isReplacing) {
    return (
      <div className="space-y-3">
        <Label className="text-zinc-300">{label}</Label>
        <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 overflow-hidden">
          {/* Video Player */}
          <div className="relative">
            {playbackId && tokens ? (
              <MuxPlayer
                playbackId={playbackId}
                tokens={tokens}
                streamType="on-demand"
                autoPlay={false}
                className="w-full aspect-video"
                accentColor="#8b5cf6"
              />
            ) : (
              <div className="aspect-video bg-zinc-900 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
              </div>
            )}
          </div>

          {/* Video info and actions */}
          <div className="px-3 py-2.5 border-t border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                  Ready
                </span>
                {duration && (
                  <span className="text-zinc-500 text-xs">
                    {formatDuration(duration)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReplace}
                  className="h-7 px-2 text-xs text-zinc-400 hover:text-white"
                >
                  <Upload className="h-3.5 w-3.5 mr-1" />
                  Replace
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="h-7 px-2 text-xs text-zinc-400 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Replacing video - show uploader
  if (isReplacing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-300">{label}</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelReplace}
            className="text-zinc-400 hover:text-white h-7 px-2"
          >
            Cancel
          </Button>
        </div>
        <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 overflow-hidden">
          {uploadUrl ? (
            <MuxUploader
              endpoint={uploadUrl}
              onUploadStart={handleUploadStart}
              onSuccess={handleUploadSuccess}
              onError={handleUploadError}
              style={
                {
                  "--uploader-font-family": "inherit",
                  "--uploader-background-color": "transparent",
                  "--uploader-border-color": "transparent",
                  "--button-background-color": "#7c3aed",
                  "--button-hover-background-color": "#6d28d9",
                  "--button-active-background-color": "#5b21b6",
                  "--progress-bar-fill-color": "#7c3aed",
                  "--overlay-background-color": "rgba(0, 0, 0, 0.7)",
                } as React.CSSProperties
              }
              className="mux-uploader-dark"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-sm">Initializing upload...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Processing state
  if (uploadState === "processing") {
    return (
      <div className="space-y-2">
        <Label className="text-zinc-300">{label}</Label>
        <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 className="h-10 w-10 animate-spin text-violet-500 mb-3" />
            <p className="font-medium text-white">Processing video...</p>
            <p className="text-sm text-zinc-500 mt-1">
              This may take a few minutes
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (uploadState === "error" || error) {
    return (
      <div className="space-y-2">
        <Label className="text-zinc-300">{label}</Label>
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <XCircle className="h-10 w-10 text-red-400 mb-3" />
            <p className="font-medium text-white">Upload failed</p>
            <p className="text-sm text-red-400 mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="mt-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Upload UI
  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>
      <div className="rounded-lg border border-zinc-700 bg-zinc-800/30 overflow-hidden">
        {uploadUrl ? (
          <MuxUploader
            endpoint={uploadUrl}
            onUploadStart={handleUploadStart}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
            style={
              {
                "--uploader-font-family": "inherit",
                "--uploader-background-color": "transparent",
                "--uploader-border-color": "transparent",
                "--button-background-color": "#7c3aed",
                "--button-hover-background-color": "#6d28d9",
                "--button-active-background-color": "#5b21b6",
                "--progress-bar-fill-color": "#7c3aed",
                "--overlay-background-color": "rgba(0, 0, 0, 0.7)",
              } as React.CSSProperties
            }
            className="mux-uploader-dark"
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm">Initializing upload...</p>
          </div>
        )}
      </div>
      {uploadState === "uploading" && (
        <p className="text-xs text-zinc-500">
          Uploading video... Please don&apos;t close this page.
        </p>
      )}
    </div>
  );
}

export function MuxVideoInput(props: MuxVideoInputProps) {
  return (
    <Suspense fallback={<MuxVideoInputFallback label={props.label} />}>
      <MuxVideoInputField {...props} />
    </Suspense>
  );
}
