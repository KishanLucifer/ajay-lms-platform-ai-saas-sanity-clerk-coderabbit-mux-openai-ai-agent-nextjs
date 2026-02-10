"use client";

import { Suspense } from "react";
import { useDocuments } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { EmptyState } from "@/components/admin/shared";
import { ModuleItem } from "./ModuleItem";
import { CourseWithModules } from "./CourseWithModules";
import { OrphanModules } from "./OrphanModules";

interface ModuleListContentProps {
  projectId: string;
  dataset: string;
  onCreateModule: () => void;
  isCreating: boolean;
  searchQuery: string;
}

export function ModuleListContent({
  projectId,
  dataset,
  onCreateModule,
  isCreating,
  searchQuery,
}: ModuleListContentProps) {
  const { data: modules } = useDocuments({
    documentType: "module",
    projectId,
    dataset,
    search: searchQuery || undefined,
  });

  const { data: courses } = useDocuments({
    documentType: "course",
    projectId,
    dataset,
  });

  // Build a set of module IDs that are assigned to courses
  // Note: This would be populated by tracking modules from course projections
  const coursesWithModules = new Set<string>();

  if (!modules || modules.length === 0) {
    return (
      <EmptyState
        emoji="📦"
        message="No modules found"
        actionLabel="Create your first module"
        onAction={onCreateModule}
        isLoading={isCreating}
      />
    );
  }

  // If searching, show flat list
  if (searchQuery) {
    return (
      <div className="space-y-2">
        {modules.map((doc) => (
          <Suspense
            key={doc.documentId}
            fallback={<Skeleton className="h-16 w-full bg-zinc-800" />}
          >
            <div className="pb-1">
              <ModuleItem {...doc} />
            </div>
          </Suspense>
        ))}
      </div>
    );
  }

  // Group by course when not searching
  return (
    <div className="space-y-4">
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
              <CourseWithModules {...course} />
            </Suspense>
          ))}
        </Accordion>
      )}

      <OrphanModules
        documents={modules}
        coursesWithModules={coursesWithModules}
      />
    </div>
  );
}
