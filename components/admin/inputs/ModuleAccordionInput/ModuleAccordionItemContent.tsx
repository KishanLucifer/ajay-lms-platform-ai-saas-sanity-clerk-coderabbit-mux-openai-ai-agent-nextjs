"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import {
  useDocument,
  useEditDocument,
  useDocuments,
  useDocumentProjection,
} from "@sanity/sdk-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X, Plus, GripVertical, ExternalLink, Layers } from "lucide-react";
import { SortableLessonItem } from "./SortableLessonItem";
import { LessonOptionLabel } from "./OptionLabels";
import type { SanityReference } from "./types";

interface ModuleAccordionItemContentProps {
  id: string;
  moduleId: string;
  projectId: string;
  dataset: string;
  onRemoveModule: () => void;
}

export function ModuleAccordionItemContent({
  id,
  moduleId,
  projectId,
  dataset,
  onRemoveModule,
}: ModuleAccordionItemContentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [selectedLessonToAdd, setSelectedLessonToAdd] = useState<string>("");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get module data
  const { data: moduleData } = useDocumentProjection({
    documentId: moduleId,
    documentType: "module",
    projectId,
    dataset,
    projection: "{ title, lessons }",
  });

  // Get lessons for editing
  const { data: currentLessons } = useDocument({
    documentId: moduleId,
    documentType: "module",
    projectId,
    dataset,
    path: "lessons",
  });
  const editLessons = useEditDocument({
    documentId: moduleId,
    documentType: "module",
    projectId,
    dataset,
    path: "lessons",
  });

  // Get all available lessons
  const { data: allLessons } = useDocuments({
    documentType: "lesson",
    projectId,
    dataset,
  });

  const title = (moduleData as { title?: string })?.title || "Untitled Module";
  const lessons = (currentLessons as SanityReference[]) ?? [];
  const currentLessonIds = new Set(lessons.map((l) => l._ref));

  // Filter out already-added lessons
  const availableLessons = allLessons?.filter(
    (doc) => !currentLessonIds.has(doc.documentId),
  );

  // Lesson drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = lessons.findIndex(
        (l) => l._key === active.id || l._ref === active.id,
      );
      const newIndex = lessons.findIndex(
        (l) => l._key === over.id || l._ref === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newLessons = arrayMove(lessons, oldIndex, newIndex);
        editLessons(newLessons as SanityReference[]);
      }
    }
  };

  const handleAddLesson = () => {
    if (!selectedLessonToAdd) return;

    const newLesson: SanityReference = {
      _type: "reference",
      _ref: selectedLessonToAdd,
      _key: crypto.randomUUID(),
    };

    editLessons([...lessons, newLesson] as SanityReference[]);
    setSelectedLessonToAdd("");
  };

  const handleRemoveLesson = (lessonRef: string) => {
    editLessons(lessons.filter((l) => l._ref !== lessonRef) as SanityReference[]);
  };

  const lessonSortableIds = lessons.map((l) => l._key ?? l._ref);
  const editUrl = `/admin/modules/${moduleId}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50 shadow-lg z-50" : ""}`}
    >
      <AccordionItem
        value={id}
        className="border border-zinc-700 rounded-lg px-1 mb-2 bg-zinc-800/30"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing touch-none text-zinc-500 hover:text-zinc-300 pl-2"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <AccordionTrigger className="flex-1 hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span className="text-zinc-200">{title}</span>
              <span className="text-xs text-zinc-500">
                ({lessons.length} lesson{lessons.length !== 1 ? "s" : ""})
              </span>
            </div>
          </AccordionTrigger>
          <div className="flex items-center gap-1 pr-2">
            <Link
              href={editUrl}
              className="p-1.5 hover:bg-zinc-700 rounded-md transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5 text-zinc-500 hover:text-zinc-300" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveModule();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <AccordionContent className="px-2 pb-3">
          {/* Lessons list */}
          {lessons.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleLessonDragEnd}
            >
              <SortableContext
                items={lessonSortableIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1.5 mb-3">
                  {lessons.map((lesson) => {
                    const lessonId = lesson._key ?? lesson._ref;
                    return (
                      <Suspense
                        key={lessonId}
                        fallback={
                          <div className="flex items-center gap-2 p-2.5 bg-zinc-800/50 border border-zinc-700 rounded-md">
                            <GripVertical className="h-3.5 w-3.5 text-zinc-500" />
                            <Skeleton className="h-4 w-32 flex-1 bg-zinc-700" />
                          </div>
                        }
                      >
                        <SortableLessonItem
                          id={lessonId}
                          documentId={lesson._ref}
                          projectId={projectId}
                          dataset={dataset}
                          onRemove={() => handleRemoveLesson(lesson._ref)}
                        />
                      </Suspense>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="text-xs text-zinc-500 py-2 pl-1">
              No lessons in this module
            </p>
          )}

          {/* Add lesson selector */}
          {availableLessons && availableLessons.length > 0 && (
            <div className="flex gap-2">
              <Select
                value={selectedLessonToAdd}
                onValueChange={setSelectedLessonToAdd}
              >
                <SelectTrigger className="flex-1 h-8 text-xs bg-zinc-800/50 border-zinc-700 text-zinc-300">
                  <SelectValue placeholder="Add lesson..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {availableLessons.map((doc) => (
                    <SelectItem
                      key={doc.documentId}
                      value={doc.documentId}
                      className="text-zinc-300 focus:bg-zinc-700 focus:text-white"
                    >
                      <Suspense fallback={doc.documentId}>
                        <LessonOptionLabel {...doc} />
                      </Suspense>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddLesson}
                disabled={!selectedLessonToAdd}
                size="sm"
                className="h-8 w-8 p-0 bg-violet-600 hover:bg-violet-500 text-white"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

