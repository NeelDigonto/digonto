import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    route: { type: "string", required: true },
    title: { type: "string", required: true },
    author: { type: "string", required: false },
    abstract: { type: "string", required: true },
    isPublished: { type: "boolean", required: true },
    publishedOn: { type: "date", required: true },
    lastUpdated: { type: "date", required: true },
    tags: {
      type: "list",
      of: { type: "string" },
      required: true,
    },
    /* heroImage: {
      type: "image",
      required: true,
    }, */
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (blog) => `/blog/${blog._raw.flattenedPath}`,
    },
    wordCount: {
      type: "number",
      resolve: (doc) => doc.body.raw.split(/\s+/gu).length,
    },
    readTime: {
      type: "string",
      resolve: (post) => {
        const wordsPerMinute = 200;
        const noOfWords = post.body.raw.split(/\s/g).length;
        const minutes = noOfWords / wordsPerMinute;
        const readTime = Math.ceil(minutes);
        return readTime;
      },
    },
  },
}));

export default makeSource({ contentDirPath: "blog", documentTypes: [Blog] });
