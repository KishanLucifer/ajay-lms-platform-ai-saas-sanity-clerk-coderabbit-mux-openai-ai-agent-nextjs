"use client";

import { Suspense } from "react";
import { useDocumentProjection, type DocumentHandle } from "@sanity/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ModuleItem } from "./ModuleItem";
import type { CourseModulesData } from "./types";

export function CourseWithModules({
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
      modules[]{ _ref }
    }`,
  });

  const course = data as CourseModulesData | undefined;
  const moduleRefs = course?.modules ?? [];

  if (moduleRefs.length === 0) return null;

  return (
    <AccordionItem
      value={documentId}
      className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/50"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-zinc-800/50 hover:no-underline transition-colors data-[state=open]:bg-zinc-800/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-linear-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30">
            <BookOpen className="h-4 w-4 text-violet-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-white">
              {course?.title || "Untitled Course"}
            </h3>
            <p className="text-xs text-zinc-500">
              {moduleRefs.length} module{moduleRefs.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-3 pt-3">
          {moduleRefs.map((ref, index) =>
            ref._ref ? (
              <Suspense
                key={ref._ref}
                fallback={<Skeleton className="h-16 w-full bg-zinc-800/50" />}
              >
                <div className="pt-0.5">
                  <ModuleItem
                    documentId={ref._ref}
                    documentType="module"
                    projectId={projectId}
                    dataset={dataset}
                    index={index}
                  />
                </div>
              </Suspense>
            ) : null,
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
