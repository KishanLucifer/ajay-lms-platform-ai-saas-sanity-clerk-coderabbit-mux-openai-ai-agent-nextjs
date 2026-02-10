"use client";

import { Suspense } from "react";
import { useDocuments } from "@sanity/sdk-react";
import { NoteCard } from "@/components/NoteCard";
import { CreateNoteButton } from "@/components/CreateNoteButton";

// Fallback component that matches NoteCard dimensions to prevent layout shift
function NoteCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
      <div className="h-20 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

export function NotesList() {
  const { data: noteHandles } = useDocuments({
    documentType: "note",
    orderings: [{ field: "_createdAt", direction: "desc" }],
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center ml-auto gap-4">
          <CreateNoteButton />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Live</span>
          </div>
        </div>
      </div>

      {!noteHandles || noteHandles.length === 0 ? (
        <div className="bg-muted rounded-lg p-8 text-center">
          <p className="text-muted-foreground">
            No notes yet. Create one in the Studio!
          </p>
          <a
            href="/studio"
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            Go to Studio →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {noteHandles.map((handle) => (
            <Suspense key={handle.documentId} fallback={<NoteCardSkeleton />}>
              <NoteCard documentId={handle.documentId} />
            </Suspense>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Testing Realtime Updates:</h3>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Keep this page open</li>
          <li>
            Open the{" "}
            <a href="/studio" className="text-blue-500 hover:underline">
              Studio
            </a>{" "}
            in another tab
          </li>
          <li>Create, edit, or delete a note</li>
          <li>Watch this page update automatically! ✨</li>
          <li>
            <strong>NEW:</strong> Edit notes directly on this page - changes are
            local-first and sync automatically!
          </li>
          <li>
            <strong>NEW:</strong> Create notes with the "+ Create Note" button
          </li>
          <li>
            <strong>NEW:</strong> Publish/Unpublish and Delete notes in realtime
          </li>
        </ol>
      </div>
    </div>
  );
}



