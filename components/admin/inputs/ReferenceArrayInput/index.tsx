"use client";

import { Suspense, useState } from "react";
import {
  useDocument,
  useEditDocument,
  useDocuments,
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, GripVertical } from "lucide-react";
import { SortableReferenceItem } from "./SortableReferenceItem";
import { AvailableDocumentOption } from "./AvailableDocumentOption";
import type { ReferenceArrayInputProps, SanityReference } from "./types";

function ReferenceArrayInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-300">{label}</Label>
      <Skeleton className="h-24 w-full bg-zinc-800" />
    </div>
  );
}

function ReferenceArrayInputField({
  path,
  label,
  referenceType,
  projectId,
  dataset,
  ...handle
}: ReferenceArrayInputProps) {
  const [selectedToAdd, setSelectedToAdd] = useState<string>("");

  // Get current reference array
  const { data: currentRefs } = useDocument({
    ...handle,
    projectId,
    dataset,
    path,
  });
  const editRefs = useEditDocument({ ...handle, projectId, dataset, path });

  // Fetch all documents of the reference type
  const { data: availableDocuments } = useDocuments({
    documentType: referenceType,
    projectId,
    dataset,
  });

  const refs = (currentRefs as SanityReference[]) ?? [];
  const currentRefIds = new Set(refs.map((r) => r._ref));

  // Filter out already-added references
  const availableToAdd = availableDocuments?.filter(
    (doc) => !currentRefIds.has(doc.documentId),
  );

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = refs.findIndex(
        (r) => r._key === active.id || r._ref === active.id,
      );
      const newIndex = refs.findIndex(
        (r) => r._key === over.id || r._ref === over.id,
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newRefs = arrayMove(refs, oldIndex, newIndex);
        editRefs(newRefs as SanityReference[]);
      }
    }
  };

  const handleAdd = () => {
    if (!selectedToAdd) return;

    const newRef: SanityReference = {
      _type: "reference",
      _ref: selectedToAdd,
      _key: crypto.randomUUID(),
    };

    editRefs([...refs, newRef] as SanityReference[]);
    setSelectedToAdd("");
  };

  const handleRemove = (refId: string) => {
    editRefs(refs.filter((r) => r._ref !== refId) as SanityReference[]);
  };

  // Get sortable IDs (prefer _key, fallback to _ref)
  const sortableIds = refs.map((r) => r._key ?? r._ref);

  return (
    <div className="space-y-3">
      <Label className="text-zinc-300">{label}</Label>

      {/* Current references list with drag-and-drop */}
      {refs.length > 0 ? (
        <div className="p-2 rounded-lg border border-zinc-700 bg-zinc-800/30">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortableIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {refs.map((ref) => {
                  const id = ref._key ?? ref._ref;
                  return (
                    <Suspense
                      key={id}
                      fallback={
                        <div className="flex items-center gap-2 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                          <GripVertical className="h-4 w-4 text-zinc-500" />
                          <Skeleton className="h-4 w-32 flex-1 bg-zinc-700" />
                          <Skeleton className="h-6 w-6 bg-zinc-700" />
                        </div>
                      }
                    >
                      <SortableReferenceItem
                        id={id}
                        documentId={ref._ref}
                        documentType={referenceType}
                        projectId={projectId}
                        dataset={dataset}
                        onRemove={() => handleRemove(ref._ref)}
                      />
                    </Suspense>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <p className="text-sm text-zinc-500 py-2">No items added yet</p>
      )}

      {/* Add new reference */}
      {availableToAdd && availableToAdd.length > 0 && (
        <div className="flex gap-2">
          <Select value={selectedToAdd} onValueChange={setSelectedToAdd}>
            <SelectTrigger className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-300">
              <SelectValue placeholder={`Add ${referenceType}...`} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {availableToAdd.map((doc) => (
                <SelectItem
                  key={doc.documentId}
                  value={doc.documentId}
                  className="text-zinc-300 focus:bg-zinc-700 focus:text-white"
                >
                  <Suspense fallback={doc.documentId}>
                    <AvailableDocumentOption {...doc} />
                  </Suspense>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAdd}
            disabled={!selectedToAdd}
            size="icon"
            className="bg-violet-600 hover:bg-violet-500 text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ReferenceArrayInput(props: ReferenceArrayInputProps) {
  return (
    <Suspense fallback={<ReferenceArrayInputFallback label={props.label} />}>
      <ReferenceArrayInputField {...props} />
    </Suspense>
  );
}

export type { ReferenceArrayInputProps } from "./types";

