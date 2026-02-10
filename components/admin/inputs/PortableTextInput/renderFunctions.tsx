import type {
  RenderStyleFunction,
  RenderDecoratorFunction,
  RenderBlockFunction,
  RenderListItemFunction,
  RenderAnnotationFunction,
} from "@portabletext/editor";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

/**
 * Render function for block styles (headings, blockquotes, etc.)
 */
export const renderStyle: RenderStyleFunction = (props) => {
  const style = props.schemaType.value;

  if (style === "h1") {
    return (
      <h1 className="text-3xl font-bold text-white mt-6 mb-3">
        {props.children}
      </h1>
    );
  }
  if (style === "h2") {
    return (
      <h2 className="text-2xl font-bold text-white mt-5 mb-2">
        {props.children}
      </h2>
    );
  }
  if (style === "h3") {
    return (
      <h3 className="text-xl font-semibold text-white mt-4 mb-2">
        {props.children}
      </h3>
    );
  }
  if (style === "h4") {
    return (
      <h4 className="text-lg font-semibold text-white mt-3 mb-1">
        {props.children}
      </h4>
    );
  }
  if (style === "blockquote") {
    return (
      <blockquote className="border-l-4 border-violet-500 pl-4 my-4 italic text-zinc-400">
        {props.children}
      </blockquote>
    );
  }

  // Default normal text
  return <p className="text-zinc-300 leading-relaxed my-2">{props.children}</p>;
};

/**
 * Render function for inline decorators (bold, italic, code, etc.)
 */
export const renderDecorator: RenderDecoratorFunction = (props) => {
  const decorator = props.value;

  if (decorator === "strong") {
    return (
      <strong className="font-semibold text-white">{props.children}</strong>
    );
  }
  if (decorator === "em") {
    return <em className="italic">{props.children}</em>;
  }
  if (decorator === "underline") {
    return <u className="underline underline-offset-2">{props.children}</u>;
  }
  if (decorator === "strike-through") {
    return <s className="line-through">{props.children}</s>;
  }
  if (decorator === "code") {
    return (
      <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm text-violet-300 font-mono">
        {props.children}
      </code>
    );
  }

  return <>{props.children}</>;
};

/**
 * Render function for annotations (links)
 */
export const renderAnnotation: RenderAnnotationFunction = (props) => {
  if (props.schemaType.name === "link") {
    const href = props.value?.href as string | undefined;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors cursor-pointer"
      >
        {props.children}
      </a>
    );
  }

  return <>{props.children}</>;
};

/**
 * Render function for blocks (text blocks and block objects like images)
 */
export const renderBlock: RenderBlockFunction = (props) => {
  // Handle image block objects
  if (props.schemaType.name === "image") {
    const value = props.value as {
      asset?: { _ref?: string };
      caption?: string;
      alt?: string;
    };

    if (!value?.asset?._ref) {
      return (
        <div className="my-4 p-4 border border-dashed border-zinc-600 rounded-lg text-center text-zinc-500">
          Image not found
        </div>
      );
    }

    // Build image URL using Sanity's image URL builder
    const imageUrl = urlFor({ asset: { _ref: value.asset._ref } })
      .width(800)
      .fit("max")
      .auto("format")
      .url();

    return (
      <figure className="my-6" contentEditable={false}>
        <div className="relative rounded-lg overflow-hidden bg-zinc-900">
          <Image
            src={imageUrl}
            alt={value.alt || "Image"}
            width={800}
            height={450}
            className="w-full h-auto object-contain"
          />
        </div>
        {value.caption && (
          <figcaption className="text-sm text-zinc-400 mt-2 text-center italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Default block rendering for text
  return <div className="my-1">{props.children}</div>;
};

/**
 * Render function for list items
 */
export const renderListItem: RenderListItemFunction = (props) => {
  const listType = props.schemaType.value;

  if (listType === "bullet") {
    return (
      <li className="ml-6 list-disc text-zinc-300 my-1">{props.children}</li>
    );
  }
  if (listType === "number") {
    return (
      <li className="ml-6 list-decimal text-zinc-300 my-1">{props.children}</li>
    );
  }

  return <li className="ml-6 text-zinc-300 my-1">{props.children}</li>;
};
