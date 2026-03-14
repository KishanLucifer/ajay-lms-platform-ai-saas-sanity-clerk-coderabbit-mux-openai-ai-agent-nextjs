"use client";

import { Loader2, Plus , Cpu, Zap, Orbit, Radar, Hexagon, Activity, ArrowRightCircle, ChevronRight, Database, Network} from "lucide-react";

interface EmptyStateProps {
  emoji: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
}

export function EmptyState({
  emoji,
  message,
  actionLabel,
  onAction,
  isLoading = false,
}: EmptyStateProps) {
  return (
    <div className="p-12 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <p className="text-zinc-400 mb-4">{message}</p>
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
