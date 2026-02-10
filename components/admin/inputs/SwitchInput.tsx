"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

interface SwitchInputProps extends DocumentHandle {
  path: string;
  label: string;
  description?: string;
}

function SwitchInputFallback({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <Skeleton className="h-6 w-11 rounded-full" />
    </div>
  );
}

function SwitchInputField({
  path,
  label,
  description,
  ...handle
}: SwitchInputProps) {
  const { data: value } = useDocument({ ...handle, path });
  const editValue = useEditDocument({ ...handle, path });

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor={path}>{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={path}
        checked={(value as boolean) ?? false}
        onCheckedChange={(checked) => editValue(checked)}
      />
    </div>
  );
}

export function SwitchInput(props: SwitchInputProps) {
  return (
    <Suspense fallback={<SwitchInputFallback label={props.label} />}>
      <SwitchInputField {...props} />
    </Suspense>
  );
}


