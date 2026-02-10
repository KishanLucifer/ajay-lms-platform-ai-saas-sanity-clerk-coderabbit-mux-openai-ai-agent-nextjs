"use client";

import { Suspense } from "react";
import type { DocumentHandle } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";
import { LessonItem } from "./LessonItem";

interface OrphanLessonsProps {
  documents: DocumentHandle[];
}

export function OrphanLessons({ documents }: OrphanLessonsProps) {
  return (
    <div className="border border-amber-500/30 rounded-xl overflow-hidden bg-amber-500/5">
      <div className="px-4 py-3 border-b border-amber-500/30 bg-amber-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <Play className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="font-medium text-amber-200">All Lessons</h3>
            <p className="text-xs text-amber-400/70">
              {documents.length} lesson{documents.length === 1 ? "" : "s"} total
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-1.5">
        {documents.map((doc) => (
          <Suspense
            key={doc.documentId}
            fallback={<Skeleton className="h-12 w-full bg-zinc-800/50" />}
          >
            <LessonItem {...doc} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}

