import { Blog } from "contentlayer/generated";
import React from "react";
import type { MDXComponents } from "mdx/types";
import Header from "@/components/Header";

type MDXContentProps = {
  [props: string]: unknown;
  components?: MDXComponents;
};

interface BlogStructureProps {
  blog: Blog;
  MDXContent: any;
}

const BlogStructure: React.FC<BlogStructureProps> = (props) => {
  return (
    <React.Fragment>
      <div className="blogHeaderPadding" />
      <Header />
      <main>
        <div className="blogContainer">
          <div className="blogMeta">
            <h1>{props.blog.title}</h1>
          </div>
          <div className="blogContent">{props.MDXContent}</div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default BlogStructure;
