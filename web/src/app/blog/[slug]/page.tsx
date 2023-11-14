import { format, parseISO } from "date-fns";
import { allBlogs } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import type { Metadata } from "next";
import React from "react";
// import { notFound } from 'next/navigation'

//  blog._raw.flattenedPath

export const generateStaticParams = async () =>
  allBlogs.map((blog) => ({ slug: blog.route }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const blog = allBlogs.find((blog) => blog.route === params.slug);

  if (!blog) throw new Error(`Blog not found for slug: ${params.slug}`);

  const metadata: Metadata = {
    title: blog.title,
    description: blog.title,
  };

  return metadata;
};

const BlogLayout = ({ params }: { params: { slug: string } }) => {
  const blog = allBlogs.find((blog) => blog.route === params.slug);

  if (!blog) throw new Error(`Blog not found for slug: ${params.slug}`);

  // 404 if the post does not exist.
  //if (!post) notFound();

  // Parse the MDX file via the useMDXComponent hook.
  const MDXContent = useMDXComponent(blog.body.code);

  return (
    <React.Fragment>
      <MDXContent />
    </React.Fragment>
  );
};

export default BlogLayout;
/**
 <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        <time dateTime={blog.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(blog.date), "LLLL d, yyyy")}
        </time>
        <h1 className="text-3xl font-bold">{blog.title}</h1>
      </div>
      <div
        className="[&>*]:mb-3 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: blog.body.html }}
      />
    </article>
 */
