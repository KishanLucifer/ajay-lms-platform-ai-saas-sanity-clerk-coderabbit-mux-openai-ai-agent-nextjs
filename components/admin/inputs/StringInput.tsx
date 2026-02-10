"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface StringInputProps extends DocumentHandle {
  path: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
}

function StringInputFallback({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

function StringInputField({
  path,
  label,
  placeholder,
  maxLength,
  ...handle
}: StringInputProps) {
  const { data: value } = useDocument({ ...handle, path });
  const editValue = useEditDocument({ ...handle, path });

  return (
    <div className="space-y-2">
      <Label htmlFor={path}>{label}</Label>
      <Input
        id={path}
        type="text"
        value={(value as string) ?? ""}
        onChange={(e) => editValue(e.currentTarget.value)}
        placeholder={placeholder}
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

export function StringInput(props: StringInputProps) {
  return (
    <Suspense fallback={<StringInputFallback label={props.label} />}>
      <StringInputField {...props} />
    </Suspense>
  );
}


