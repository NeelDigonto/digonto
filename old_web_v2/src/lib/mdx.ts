import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { ReactElement, JSXElementConstructor } from "react";
import { z } from "zod";

const mdxFrontmatterSchema = z
  .object({
    route: z.string(),
    title: z.string(),
    abstract: z.string(),
    author: z.string(),
    isPublished: z.boolean(),
    publishedOn: z.string(),
    lastUpdated: z.string(),
    tags: z.string().array(),
    coverImage: z.string(),
  })
  .strict();
export type MDXFrontmatter = z.infer<typeof mdxFrontmatterSchema>;

const fullFrontMatterSchema = z
  .object({
    url: z.string(),
    wordCount: z.number(),
    readTime: z.number(),
  })
  .merge(mdxFrontmatterSchema)
  .strict();
export type FullFrontMatter = z.infer<typeof fullFrontMatterSchema>;

const rootMDXDirectory = path.join(process.cwd(), "src", "content");

export interface PostDescription {
  frontmatter: FullFrontMatter;
  content: ReactElement<any, string | JSXElementConstructor<any>>;
  slug: string;
}

export async function getPostBySlug(
  fileName: string
): Promise<PostDescription> {
  const slug = fileName.replace(/\.mdx$/, "");
  const filePath = path.join(rootMDXDirectory, `${slug}.mdx`);

  const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });

  const { frontmatter, content } = await compileMDX({
    source: fileContent,
    options: { parseFrontmatter: true, mdxOptions: {} },
  });

  const validationResult = mdxFrontmatterSchema.safeParse(frontmatter);
  if (!validationResult.success) {
    throw new Error(`
    getPostBySlug(${fileName}):
    ${validationResult.error.toString()}
    `);
  }

  const fullFrontMatter: FullFrontMatter = {
    ...(frontmatter as unknown as MDXFrontmatter),
    url: `/blog/${slug}`,
    wordCount: 0,
    readTime: 0,
  };

  return {
    frontmatter: fullFrontMatter,
    content,
    slug,
  };
}

export async function getAllPosts() {
  const fileNames = fs.readdirSync(rootMDXDirectory);

  let posts: PostDescription[] = [];

  for (const fileName of fileNames) {
    posts.push(await getPostBySlug(fileName));
  }

  return posts;
}
