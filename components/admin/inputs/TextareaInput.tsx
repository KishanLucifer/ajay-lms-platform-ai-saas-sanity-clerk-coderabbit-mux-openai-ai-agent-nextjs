"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface TextareaInputProps extends DocumentHandle {
  path: string;
  label: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

function TextareaInputFallback({
  label,
  rows = 4,
}: {
  label: string;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Skeleton className="w-full" style={{ height: `${rows * 1.5 + 1}rem` }} />
    </div>
  );
}

function TextareaInputField({
  path,
  label,
  placeholder,
  rows = 4,
  maxLength,
  ...handle
}: TextareaInputProps) {
  const { data: value } = useDocument({ ...handle, path });
  const editValue = useEditDocument({ ...handle, path });

  return (
    <div className="space-y-2">
      <Label htmlFor={path}>{label}</Label>
      <Textarea
        id={path}
        value={(value as string) ?? ""}
        onChange={(e) => editValue(e.currentTarget.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
      />
      {maxLength && (
        <p className="text-xs text-muted-foreground">
          {((value as string) ?? "").length}/{maxLength} characters
        </p>
      )}
    </div>
  );
}

export function TextareaInput(props: TextareaInputProps) {
  return (
    <Suspense
      fallback={<TextareaInputFallback label={props.label} rows={props.rows} />}
    >
      <TextareaInputField {...props} />
    </Suspense>
  );
}


