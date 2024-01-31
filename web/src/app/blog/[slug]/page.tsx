import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { Metadata } from "next";

export const generateStaticParams = async () =>
  (await getAllPosts())
    .filter((post) => post.frontmatter.isPublished)
    .map((post) => ({ slug: post.frontmatter.route }));

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

const Post = async ({ params: { slug } }: { params: { slug: string } }) => {
  const { content } = await getPostBySlug(slug);

  return <div>{content}</div>;
};

export default Post;
