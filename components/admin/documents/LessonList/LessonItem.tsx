"use client";

import Link from "next/link";
import { useDocumentProjection } from "@sanity/sdk-react";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Play,
  Video,
  FileText,
  Link2,
  GripVertical,
} from "lucide-react";
import type { LessonItemProps, LessonData } from "./types";

export function LessonItem({
  documentId,
  documentType,
  projectId,
  dataset,
  index,
}: LessonItemProps) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: `{
      title,
      description,
      slug,
      "hasVideo": defined(video.asset),
      "hasContent": length(content) > 0
    }`,
  });

  const lesson = data as LessonData | undefined;
  const hasSlug = !!lesson?.slug?.current;
  const hasVideo = lesson?.hasVideo ?? false;
  const hasContent = lesson?.hasContent ?? false;

  return (
    <Link href={`/admin/lessons/${documentId}`}>
      <div className="p-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-zinc-600">
            {index !== undefined && (
              <span className="text-xs font-medium text-zinc-500 w-5">
                {index + 1}.
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Play className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <h4 className="font-medium text-white text-sm truncate">
                {lesson?.title || "Untitled Lesson"}
              </h4>
            </div>
            {lesson?.description && (
              <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5 ml-5">
                {lesson.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {hasVideo && (
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs px-1.5 py-0"
              >
                <Video className="h-3 w-3" />
              </Badge>
            )}
            {hasContent && (
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs px-1.5 py-0"
              >
                <FileText className="h-3 w-3" />
              </Badge>
            )}
            {hasSlug && (
              <Badge
                variant="secondary"
                className="bg-violet-500/10 text-violet-400 border-violet-500/30 text-xs px-1.5 py-0"
              >
                <Link2 className="h-3 w-3" />
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
