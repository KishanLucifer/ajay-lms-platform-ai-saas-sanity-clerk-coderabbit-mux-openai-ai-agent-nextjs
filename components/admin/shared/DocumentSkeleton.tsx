"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DocumentListSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full bg-zinc-800" />
      ))}
    </div>
  );
}

export function DocumentCardSkeleton() {
  return (
    <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
      <Skeleton className="h-36 w-full bg-zinc-800" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4 bg-zinc-800" />
        <Skeleton className="h-4 w-full bg-zinc-800" />
        <Skeleton className="h-4 w-1/2 bg-zinc-800" />
      </div>
    </div>
  );
}

export function DocumentGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <DocumentCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HierarchicalListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-12 w-full bg-zinc-800" />
          <div className="pl-4 space-y-2">
            <Skeleton className="h-14 w-full bg-zinc-800/50" />
            <Skeleton className="h-14 w-full bg-zinc-800/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ModuleListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-12 w-full bg-zinc-800" />
          <div className="pl-4 space-y-2">
            <Skeleton className="h-16 w-full bg-zinc-800/50" />
            <Skeleton className="h-16 w-full bg-zinc-800/50" />
          </div>
        </div>
      ))}
    </div>
  );
}

