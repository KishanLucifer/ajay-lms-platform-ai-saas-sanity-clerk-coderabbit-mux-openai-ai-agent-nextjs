import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const noteType = defineType({
  name: "note",
  title: "Note",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => [
        Rule.required().error("Title is required to publish"),
      ],
    }),
    defineField({
      name: "content",
      type: "text",
      description: "The main content of the note",
      validation: (Rule) => [
        Rule.max(500).warning("Keep notes concise for better readability"),
      ],
    }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "In Progress", value: "inProgress" },
          { title: "Complete", value: "complete" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "content",
      status: "status",
    },
    prepare(selection) {
      const { title, subtitle, status } = selection;
      return {
        title: title || "Untitled Note",
        subtitle: subtitle
          ? `${status || "draft"} • ${subtitle.slice(0, 50)}${subtitle.length > 50 ? "..." : ""}`
          : status || "draft",
      };
    },
  },
});



