import type { DocumentHandle } from "@sanity/sdk-react";

export interface ModuleListProps {
  projectId: string;
  dataset: string;
}

export interface ModuleData {
  title?: string;
  description?: string;
  lessonCount?: number;
  courseTitle?: string;
  courseId?: string;
}

export interface CourseModulesData {
  title?: string;
  modules?: Array<{
    _ref?: string;
  }>;
}

export type ModuleItemProps = DocumentHandle & { index?: number };

