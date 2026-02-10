"use client";

import { LessonList } from "@/components/admin/documents/LessonList";
import { projectId, dataset } from "@/sanity/env";

export default function LessonsPage() {
  return <LessonList projectId={projectId} dataset={dataset} />;
}
