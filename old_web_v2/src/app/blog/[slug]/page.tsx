import { newWebRequest } from "@/lib/analytics";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import axios from "axios";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";

export const generateStaticParams = async () =>
  (await getAllPosts())
    .filter((post) => post.frontmatter.isPublished)
    .map((post) => ({ slug: post.frontmatter.route, content: post.content }));

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const post = (await getAllPosts())
    .filter((post) => post.frontmatter.isPublished)
    .find((post) => post.frontmatter.route === params.slug);

  if (!post) throw new Error(`Blog not found for slug: ${params.slug}`);

  const metadata: Metadata = {
    title: post.frontmatter.title,
    description: post.frontmatter.abstract,
  };

  return metadata;
};

const Post = async ({ params }: { params: { slug: string } }) => {
  const { content } = await getPostBySlug(params.slug);

  await newWebRequest(`/blog/${params.slug}`, headers(), cookies());

  return <div>{content}</div>;
};

export default Post;
