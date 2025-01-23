import fs from "fs";
import path from "path";

const root = process.cwd();

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  // const { default: Post } = await import(`@/markdown/${slug}.mdx`);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { default: Post } = require(`@/markdown/${slug}.mdx`);

  return <Post />;
}

export function generateStaticParams() {
  const slugs = fs
    .readdirSync(path.join(root, "src", "markdown"), {
      withFileTypes: true,
      encoding: "utf-8",
      recursive: false,
    })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)
    .filter((file) => file.endsWith(".mdx"))
    .map((fileName) => fileName.slice(0, -4))
    .map((slug) => ({ slug }));

  return slugs;
}

export const dynamicParams = false;
