import { z } from "zod";

export const blogPostMetadataSchema = z.object({
  route: z.string(),
  title: z.string(),
  abstract: z.string(),
  author: z.string(),
  isPublished: z.boolean(),
  publishedOn: z.coerce.date(),
  lastUpdated: z.coerce.date(),
  tags: z.string().array(),
  coverImage: z.string(),
});

export type BlogPostMetadata = z.infer<typeof blogPostMetadataSchema>;
