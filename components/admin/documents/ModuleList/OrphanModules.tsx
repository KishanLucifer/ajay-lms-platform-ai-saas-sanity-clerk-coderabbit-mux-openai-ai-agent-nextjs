"use client";

import { Suspense } from "react";
import type { DocumentHandle } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers } from "lucide-react";
import { ModuleItem } from "./ModuleItem";

interface OrphanModulesProps {
  documents: DocumentHandle[];
  coursesWithModules: Set<string>;
}

export function OrphanModules({
  documents,
  coursesWithModules,
}: OrphanModulesProps) {
  const orphanModules = documents.filter(
    (doc) => !coursesWithModules.has(doc.documentId),
  );

  if (orphanModules.length === 0) return null;

  return (
    <div className="border border-amber-500/30 rounded-xl overflow-hidden bg-amber-500/5">
      <div className="px-4 py-3 border-b border-amber-500/30 bg-amber-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <Layers className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="font-medium text-amber-200">Unassigned Modules</h3>
            <p className="text-xs text-amber-400/70">
              {orphanModules.length} module
              {orphanModules.length === 1 ? "" : "s"} not in any course
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {orphanModules.map((doc) => (
          <Suspense
            key={doc.documentId}
            fallback={<Skeleton className="h-16 w-full bg-zinc-800/50" />}
          >
            <ModuleItem {...doc} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}

