import { format, parseISO } from "date-fns";
import { allBlogs } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import type { Metadata } from "next";
import React from "react";
import BlogStructure from "@/components/BlogStructure";
// import { notFound } from 'next/navigation'

//  blog._raw.flattenedPath

export const generateStaticParams = async () =>
  allBlogs
    .filter((blog) => blog.isPublished)
    .map((blog) => ({ slug: blog.route }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const blog = allBlogs
    .filter((blog) => blog.isPublished)
    .find((blog) => blog.route === params.slug);

  if (!blog) throw new Error(`Blog not found for slug: ${params.slug}`);

  const metadata: Metadata = {
    title: blog.title,
    description: blog.title,
  };

  return metadata;
};

const BlogLayout = ({ params }: { params: { slug: string } }) => {
  const blog = allBlogs
    .filter((blog) => blog.isPublished)
    .find((blog) => blog.route === params.slug);

  if (!blog) throw new Error(`Blog not found for slug: ${params.slug}`);

  // 404 if the post does not exist.
  //if (!post) notFound();

  // Parse the MDX file via the useMDXComponent hook.
  const MDXContent = useMDXComponent(blog.body.code);

  return (
    <React.Fragment>
      <BlogStructure {...{ blog, MDXContent: <MDXContent /> }} />
      {/* <MDXContent /> */}
    </React.Fragment>
  );
};

export default BlogLayout;
