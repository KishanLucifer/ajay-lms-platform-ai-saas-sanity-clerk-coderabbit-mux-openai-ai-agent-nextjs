import { Suspense } from "react";
import { NotesList } from "@/components/NotesList";
import { Providers } from "@/components/Providers";

export default function NotesPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Notes</h1>
      <p className="text-muted-foreground">
        View and test realtime note updates
      </p>

      <Providers>
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto mt-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center ml-auto gap-4">
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium opacity-50 cursor-not-allowed"
                  >
                    + Create Note
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-gray-300 rounded-full" />
                    <span className="text-sm text-muted-foreground">
                      Loading...
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Loading notes...</p>
              </div>
            </div>
          }
        >
          <NotesList />
        </Suspense>
      </Providers>
    </div>
  );
}



