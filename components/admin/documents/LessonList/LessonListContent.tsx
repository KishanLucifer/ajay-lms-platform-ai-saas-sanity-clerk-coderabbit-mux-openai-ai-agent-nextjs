"use client";

import { Suspense } from "react";
import { useDocuments } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Video, FileText, Link2 } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { EmptyState } from "@/components/admin/shared";
import { LessonItem } from "./LessonItem";
import { CourseWithModulesAndLessons } from "./CourseWithModulesAndLessons";
import { OrphanLessons } from "./OrphanLessons";

interface LessonListContentProps {
  projectId: string;
  dataset: string;
  onCreateLesson: () => void;
  isCreating: boolean;
  searchQuery: string;
}

export function LessonListContent({
  projectId,
  dataset,
  onCreateLesson,
  isCreating,
  searchQuery,
}: LessonListContentProps) {
  const { data: lessons } = useDocuments({
    documentType: "lesson",
    projectId,
    dataset,
    search: searchQuery || undefined,
  });

  const { data: courses } = useDocuments({
    documentType: "course",
    projectId,
    dataset,
  });

  if (!lessons || lessons.length === 0) {
    return (
      <EmptyState
        emoji="🎬"
        message="No lessons found"
        actionLabel="Create your first lesson"
        onAction={onCreateLesson}
        isLoading={isCreating}
      />
    );
  }

  // If searching, show flat list
  if (searchQuery) {
    return (
      <div className="space-y-1.5">
        {lessons.map((doc) => (
          <Suspense
            key={doc.documentId}
            fallback={<Skeleton className="h-12 w-full bg-zinc-800" />}
          >
            <div className="pb-1">
              <LessonItem {...doc} />
            </div>
          </Suspense>
        ))}
      </div>
    );
  }

  // Group by course > module when not searching
  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-zinc-500 pb-2 border-b border-zinc-800">
        <span className="flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs px-1.5 py-0"
          >
            <Video className="h-3 w-3" />
          </Badge>
          Video
        </span>
        <span className="flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs px-1.5 py-0"
          >
            <FileText className="h-3 w-3" />
          </Badge>
          Content
        </span>
        <span className="flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="bg-violet-500/10 text-violet-400 border-violet-500/30 text-xs px-1.5 py-0"
          >
            <Link2 className="h-3 w-3" />
          </Badge>
          Slug
        </span>
      </div>

      {courses && courses.length > 0 && (
        <Accordion
          type="multiple"
          defaultValue={courses.map((c) => c.documentId)}
          className="space-y-3"
        >
          {courses.map((course) => (
            <Suspense
              key={course.documentId}
              fallback={<Skeleton className="h-24 w-full bg-zinc-800" />}
            >
              <CourseWithModulesAndLessons {...course} />
            </Suspense>
          ))}
        </Accordion>
      )}

      {/* Show orphan lessons as flat list if no courses */}
      {(!courses || courses.length === 0) && (
        <OrphanLessons documents={lessons} />
      )}
    </div>
  );
}

