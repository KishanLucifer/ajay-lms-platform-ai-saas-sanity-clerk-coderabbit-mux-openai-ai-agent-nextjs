import { defineSchema } from "@portabletext/editor";

/**
 * PTE schema definition matching the lesson content field structure.
 * Includes styles, decorators, lists, and image block objects.
 */
export const schemaDefinition = defineSchema({
  // Block styles for headings and formatting
  styles: [
    { name: "normal", title: "Normal" },
    { name: "h1", title: "Heading 1" },
    { name: "h2", title: "Heading 2" },
    { name: "h3", title: "Heading 3" },
    { name: "h4", title: "Heading 4" },
    { name: "blockquote", title: "Quote" },
  ],

  // Inline text decorators
  decorators: [
    { name: "strong", title: "Bold" },
    { name: "em", title: "Italic" },
    { name: "underline", title: "Underline" },
    { name: "strike-through", title: "Strikethrough" },
    { name: "code", title: "Code" },
  ],

  // List types
  lists: [
    { name: "bullet", title: "Bullet List" },
    { name: "number", title: "Numbered List" },
  ],

  // Inline annotations (links, etc.)
  annotations: [
    {
      name: "link",
      title: "Link",
      fields: [
        {
          name: "href",
          title: "URL",
          type: "string",
        },
      ],
    },
  ],

  // Block objects (images)
  blockObjects: [
    {
      name: "image",
      title: "Image",
      fields: [
        {
          name: "asset",
          title: "Asset",
          type: "object",
        },
        {
          name: "caption",
          title: "Caption",
          type: "string",
        },
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    },
  ],

  // No inline objects for now
  inlineObjects: [],
});
