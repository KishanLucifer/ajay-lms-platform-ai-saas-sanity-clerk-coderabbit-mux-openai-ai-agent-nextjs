"use client";

import { useTransition } from "react";
import { useApplyDocumentActions, createDocument } from "@sanity/sdk-react";
import { Loader2 } from "lucide-react";

export function CreateNoteButton() {
  const [isPending, startTransition] = useTransition();
  const apply = useApplyDocumentActions();

  const handleCreateNote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startTransition(async () => {
      // Add a minimum x second delay to show the spinner
      await Promise.all([
        apply(
          createDocument({
            documentType: "note",
          }),
        ),
        new Promise((resolve) => setTimeout(resolve, 6000)),
      ]);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCreateNote}
      disabled={isPending}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        "+ Create Note"
      )}
    </button>
  );
}



