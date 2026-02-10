"use client";

import Link from "next/link";
import { useDocumentProjection } from "@sanity/sdk-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { X, GripVertical, ExternalLink, PlayCircle } from "lucide-react";

interface SortableLessonItemProps {
  id: string;
  documentId: string;
  projectId: string;
  dataset: string;
  onRemove: () => void;
}

export function SortableLessonItem({
  id,
  documentId,
  projectId,
  dataset,
  onRemove,
}: SortableLessonItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { data } = useDocumentProjection({
    documentId,
    documentType: "lesson",
    projectId,
    dataset,
    projection: "{ title }",
  });

  const title = (data as { title?: string })?.title || "Untitled Lesson";
  const editUrl = `/admin/lessons/${documentId}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2.5 bg-zinc-800/50 border border-zinc-700 rounded-md ${
        isDragging ? "opacity-50 shadow-lg z-50" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing touch-none text-zinc-500 hover:text-zinc-300"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <PlayCircle className="h-3.5 w-3.5 text-emerald-400" />
      <Link
        href={editUrl}
        className="text-sm text-zinc-300 flex-1 hover:text-violet-400 hover:underline transition-colors flex items-center gap-1.5"
      >
        {title}
        <ExternalLink className="h-3 w-3 opacity-50" />
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

