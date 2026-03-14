"use client";

import { Loader2, Plus , Cpu, Zap, Orbit, Radar, Hexagon, Activity, ArrowRightCircle, ChevronRight, Database, Network} from "lucide-react";

interface ListPageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
}

export function ListPageHeader({
  title,
  description,
  actionLabel,
  onAction,
  isLoading = false,
}: ListPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        {description && <p className="text-zinc-400 mt-1">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-300 hover:to-green-400 disabled:opacity-50 rounded-lg shadow-lg shadow-lime-400/20 transition-all">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isLoading ? "Creating..." : actionLabel}
        </button>
      )}
    </div>
  );
}
