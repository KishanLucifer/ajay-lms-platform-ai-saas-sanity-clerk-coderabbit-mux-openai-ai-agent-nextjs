"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structure } from "./sanity-server/structure";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion } from "./sanity-server/env";
import { schema } from "./sanity-server/schemaTypes";
import { muxInput } from "sanity-plugin-mux-input";

export default defineConfig({
  name: "default",
  title: "My Studio",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  // plugins: [deskTool()],

  // schema: {
  //   types: schemaTypes,
  // },
  // projectId,
  // dataset,
  // // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    muxInput(), // ✅ REQUIRED
  ],
});
