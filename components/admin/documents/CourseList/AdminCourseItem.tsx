"use client";

import { useDocumentProjection, type DocumentHandle } from "@sanity/sdk-react";
import { CourseCard } from "@/components/courses";
import type { CourseData } from "./types";

export function AdminCourseItem({
  documentId,
  documentType,
  projectId,
  dataset,
}: DocumentHandle) {
  const { data } = useDocumentProjection({
    documentId,
    documentType,
    projectId,
    dataset,
    projection: `{
      title,
      description,
      tier,
      "thumbnail": thumbnail.asset->{ url },
      "moduleCount": count(modules),
      "lessonCount": count(modules[]->lessons[])
    }`,
  });

  const course = data as CourseData | undefined;

  return (
    <CourseCard
      href={`/admin/courses/${documentId}`}
      title={course?.title ?? null}
      description={course?.description ?? null}
      tier={course?.tier ?? null}
      thumbnail={
        course?.thumbnail?.url
          ? { asset: { _id: "", url: course.thumbnail.url } }
          : null
      }
      moduleCount={course?.moduleCount ?? null}
      lessonCount={course?.lessonCount ?? null}
    />
  );
}
