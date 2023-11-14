import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allBlogs, Blog } from "contentlayer/generated";
import React from "react";

export default function BlogHomePage({
  children,
}: {
  children: React.ReactNode;
}) {
  const blogs = allBlogs.sort((a, b) =>
    compareDesc(new Date(a.publishedOn), new Date(b.publishedOn))
  );

  return (
    <React.Fragment>
      {blogs.map((blog, idx) => (
        <div key={idx}>{blog.title}</div>
      ))}
    </React.Fragment>
  );
}
// de-facto-guide-to-kubernetes-on-aws
