import React from "react";
import fs from "fs";
import path from "path";
import { MDXContent } from "mdx/types";
import {
  BlogPostMetadata,
  blogPostMetadataSchema,
} from "@/types/BlogPostMetadata";

const root = process.cwd();

export default async function Page() {
  const fileNames = fs
    .readdirSync(path.join(root, "src", "markdown"), {
      withFileTypes: true,
      encoding: "utf-8",
      recursive: false,
    })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)
    .filter((file) => file.endsWith(".mdx"));

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const parsedMDX: {
        default: MDXContent;
        metadata: BlogPostMetadata;
        // eslint-disable-next-line @typescript-eslint/no-require-imports
      } = require(`@/markdown/${fileName}`);

      const parsedResult = blogPostMetadataSchema.safeParse(parsedMDX.metadata);
      if (!parsedResult.success) {
        throw new Error(
          `Invalid metadata for blog post: ${fileName}, ${parsedResult.error.message}`
        );
      }

      return parsedMDX;
    })
  );

  const postMetadatas = posts.map((post) => {
    return post.metadata;
  });

  return <div>{JSON.stringify(postMetadatas)}</div>;
}
