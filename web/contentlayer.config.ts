import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    route: { type: "string", required: true },
    title: { type: "string", required: true },
    abstract: { type: "string", required: true },
    isPublished: { type: "boolean", required: true },
    publishedOn: { type: "date", required: true },
    lastUpdated: { type: "date", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (blog) => `/blog/${blog._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({ contentDirPath: "blog", documentTypes: [Blog] });
