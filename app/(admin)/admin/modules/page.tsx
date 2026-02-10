"use client";

import { ModuleList } from "@/components/admin/documents/ModuleList";
import { projectId, dataset } from "@/sanity/env";

export default function ModulesPage() {
  return <ModuleList projectId={projectId} dataset={dataset} />;
}
