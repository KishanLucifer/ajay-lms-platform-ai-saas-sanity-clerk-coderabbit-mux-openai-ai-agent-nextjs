"use client";

import { Suspense } from "react";
import { useDocuments } from "@sanity/sdk-react";
import { EmptyState } from "@/components/admin/shared";
import { DocumentCardSkeleton } from "@/components/admin/shared/DocumentSkeleton";
import { AdminCourseItem } from "./AdminCourseItem";

interface CourseGridProps {
  projectId: string;
  dataset: string;
  onCreateCourse: () => void;
  isCreating: boolean;
  searchQuery: string;
}

export function CourseGrid({
  projectId,
  dataset,
  onCreateCourse,
  isCreating,
  searchQuery,
}: CourseGridProps) {
  const { data: courses } = useDocuments({
    documentType: "course",
    projectId,
    dataset,
    search: searchQuery || undefined,
  });

  if (!courses || courses.length === 0) {
    return (
      <EmptyState
        emoji="📚"
        message="No courses found"
        actionLabel="Create your first course"
        onAction={onCreateCourse}
        isLoading={isCreating}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <Suspense key={course.documentId} fallback={<DocumentCardSkeleton />}>
          <AdminCourseItem {...course} />
        </Suspense>
      ))}
    </div>
  );
}

