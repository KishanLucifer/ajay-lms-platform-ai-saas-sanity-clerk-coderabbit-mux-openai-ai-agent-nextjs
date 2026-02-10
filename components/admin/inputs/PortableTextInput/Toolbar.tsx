"use client";

import {
  useDecoratorButton,
  useStyleSelector,
  useListButton,
  useToolbarSchema,
  type ToolbarDecoratorSchemaType,
  type ToolbarStyleSchemaType,
  type ToolbarListSchemaType,
  type ExtendDecoratorSchemaType,
  type ExtendStyleSchemaType,
  type ExtendListSchemaType,
} from "@portabletext/toolbar";
import { useEditor } from "@portabletext/editor";
import type { PortableTextBlock } from "@portabletext/editor";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Type,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolbarProps {
  onInsertImage: (insertIndex: number) => void;
}

// Extend style schema with icons
const extendStyle: ExtendStyleSchemaType = (style) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    normal: Type,
    h1: Heading1,
    h2: Heading2,
    h3: Heading3,
    h4: Heading4,
    blockquote: Quote,
  };

  return {
    ...style,
    icon: icons[style.name] || Type,
  };
};

// Extend decorator schema with icons
const extendDecorator: ExtendDecoratorSchemaType = (decorator) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    strong: Bold,
    em: Italic,
    underline: Underline,
    "strike-through": Strikethrough,
    code: Code,
  };

  const icon = icons[decorator.name];
  if (icon) {
    return {
      ...decorator,
      icon,
      title: "", // Hide title since we show icon
    };
  }

  return decorator;
};

// Extend list schema with icons
const extendList: ExtendListSchemaType = (list) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    bullet: List,
    number: ListOrdered,
  };

  return {
    ...list,
    icon: icons[list.name] || List,
    title: "",
  };
};

// Decorator button component
function DecoratorButton({
  schemaType,
}: {
  schemaType: ToolbarDecoratorSchemaType;
}) {
  const button = useDecoratorButton({ schemaType });
  const isActive = button.snapshot.matches({ enabled: "active" });
  const Icon = schemaType.icon as React.ComponentType<{ className?: string }>;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => button.send({ type: "toggle" })}
      className={`h-8 w-8 p-0 ${
        isActive
          ? "bg-violet-600 text-white hover:bg-violet-700"
          : "text-zinc-400 hover:text-white hover:bg-zinc-700"
      }`}
      title={schemaType.name}
    >
      {Icon && <Icon className="h-4 w-4" />}
    </Button>
  );
}

// List button component
function ListButton({ schemaType }: { schemaType: ToolbarListSchemaType }) {
  const button = useListButton({ schemaType });
  const isActive = button.snapshot.matches({ enabled: "active" });
  const Icon = schemaType.icon as React.ComponentType<{ className?: string }>;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => button.send({ type: "toggle" })}
      className={`h-8 w-8 p-0 ${
        isActive
          ? "bg-violet-600 text-white hover:bg-violet-700"
          : "text-zinc-400 hover:text-white hover:bg-zinc-700"
      }`}
      title={schemaType.name}
    >
      {Icon && <Icon className="h-4 w-4" />}
    </Button>
  );
}

// Style selector component
function StyleSelector({
  styles,
}: {
  styles: readonly ToolbarStyleSchemaType[];
}) {
  const mutableStyles = [...styles];
  const selector = useStyleSelector({ schemaTypes: mutableStyles });
  const activeStyleName = selector.snapshot.context.activeStyle;
  const activeStyle = styles.find((s) => s.name === activeStyleName);

  return (
    <Select
      value={activeStyle?.name || "normal"}
      onValueChange={(value) => {
        selector.send({ type: "toggle", style: value });
      }}
    >
      <SelectTrigger className="w-[130px] h-8 bg-zinc-800 border-zinc-700 text-zinc-300 text-sm">
        <SelectValue placeholder="Style" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-800 border-zinc-700">
        {styles.map((style) => {
          const Icon = style.icon as React.ComponentType<{
            className?: string;
          }>;
          return (
            <SelectItem
              key={style.name}
              value={style.name}
              className="text-zinc-300 hover:bg-zinc-700 focus:bg-zinc-700"
            >
              <span className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4" />}
                {style.title || style.name}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

// Main toolbar component
export function Toolbar({ onInsertImage }: ToolbarProps) {
  const toolbarSchema = useToolbarSchema({
    extendStyle,
    extendDecorator,
    extendList,
  });

  // Get the editor to access current value and selection
  const editor = useEditor();

  const handleInsertImage = () => {
    // Get current snapshot from the editor
    const snapshot = editor.getSnapshot();
    const value = snapshot.context.value as PortableTextBlock[] | undefined;
    const selection = snapshot.context.selection;

    // Find the index of the currently focused block
    let insertIndex = value?.length || 0; // Default to end

    if (selection && value) {
      // Get the focus path - first element is the block key
      const focusPath = selection.focus.path;
      const firstSegment = focusPath[0];
      // Path segment can be string or object with _key
      const focusBlockKey =
        typeof firstSegment === "object" &&
        firstSegment !== null &&
        "_key" in firstSegment
          ? (firstSegment._key as string)
          : undefined;
      if (focusBlockKey) {
        const currentIndex = value.findIndex(
          (block) => block._key === focusBlockKey,
        );
        if (currentIndex !== -1) {
          // Insert after the current block
          insertIndex = currentIndex + 1;
        }
      }
    }

    onInsertImage(insertIndex);
  };

  return (
    <div className="flex items-center gap-1 p-2 bg-zinc-900 border-b border-zinc-700 rounded-t-lg flex-wrap">
      {/* Style selector */}
      {toolbarSchema.styles && toolbarSchema.styles.length > 0 && (
        <>
          <StyleSelector styles={toolbarSchema.styles} />
          <div className="w-px h-6 bg-zinc-700 mx-1" />
        </>
      )}

      {/* Decorator buttons */}
      {toolbarSchema.decorators?.map((decorator) => (
        <DecoratorButton key={decorator.name} schemaType={decorator} />
      ))}

      {toolbarSchema.decorators && toolbarSchema.decorators.length > 0 && (
        <div className="w-px h-6 bg-zinc-700 mx-1" />
      )}

      {/* List buttons */}
      {toolbarSchema.lists?.map((list) => (
        <ListButton key={list.name} schemaType={list} />
      ))}

      {toolbarSchema.lists && toolbarSchema.lists.length > 0 && (
        <div className="w-px h-6 bg-zinc-700 mx-1" />
      )}

      {/* Insert image button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleInsertImage}
        className="h-8 px-2 text-zinc-400 hover:text-white hover:bg-zinc-700"
        title="Insert image"
      >
        <ImagePlus className="h-4 w-4 mr-1" />
        <span className="text-xs">Image</span>
      </Button>
    </div>
  );
}
