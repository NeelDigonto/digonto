"use client";

import { Blog } from "contentlayer/generated";
import React from "react";
import type { MDXComponents } from "mdx/types";
import styled from "styled-components";
import Header from "@/components/Header";

type MDXContentProps = {
  [props: string]: unknown;
  components?: MDXComponents;
};

interface BlogStructureProps {
  blog: Blog;
  MDXContent: any;
}

const BlogContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr min(38rem, calc(100% - 64px)) 1fr;
  grid-column-gap: 32px;

  > * {
    grid-column: 2;
  }

  margin-bottom: 10rem; /* temporary */
`;

const FullBleedContainer = styled.img`
  width: 100%;
  grid-column: 1 / -1;
`;

const BlogHeaderPadding = styled.div`
  width: 100%;
  height: 12rem;
`;

const BlogMeta = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const BlogContent = styled.div`
  padding-top: 2rem;
`;

const BlogStructure: React.FC<BlogStructureProps> = (props) => {
  return (
    <React.Fragment>
      <BlogHeaderPadding />
      <Header />
      <main>
        <BlogContainer>
          <BlogMeta>
            <h1>{props.blog.title}</h1>
          </BlogMeta>
          <BlogContent>{props.MDXContent}</BlogContent>
        </BlogContainer>
      </main>
    </React.Fragment>
  );
};

export default BlogStructure;
