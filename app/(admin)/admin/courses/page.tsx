"use client";

import { CourseList } from "@/components/admin/documents/CourseList";
import { projectId, dataset } from "@/sanity/env";

export default function CoursesPage() {
  return <CourseList projectId={projectId} dataset={dataset} />;
}
