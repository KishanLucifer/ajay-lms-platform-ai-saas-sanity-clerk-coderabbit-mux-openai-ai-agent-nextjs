"use client";

import Link from "next/link";
import { useDocumentProjection } from "@sanity/sdk-react";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, BookOpen, Layers } from "lucide-react";
import type { ModuleItemProps, ModuleData } from "./types";

export function ModuleItem({
  documentId,
  documentType,
  projectId,
  dataset,
  index,
}: ModuleItemProps) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: `{
      title,
      description,
      "lessonCount": count(lessons)
    }`,
  });

  const module = data as ModuleData | undefined;
  const lessonCount = module?.lessonCount ?? 0;

  return (
    <Link href={`/admin/modules/${documentId}`}>
      <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all cursor-pointer group">
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
              <Layers className="h-4 w-4 text-violet-400 shrink-0" />
              <h3 className="font-medium text-white truncate">
                {module?.title || "Untitled Module"}
              </h3>
            </div>
            {module?.description && (
              <p className="text-sm text-zinc-500 line-clamp-1 mt-1 ml-6">
                {module.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Badge
              variant="secondary"
              className="bg-zinc-800 text-zinc-400 border-zinc-700"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              {lessonCount} lesson{lessonCount === 1 ? "" : "s"}
            </Badge>
            <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
