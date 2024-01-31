import { getAllPosts } from "@/lib/mdx";

export default async function Posts() {
  const posts = await getAllPosts();

  return (
    <div>
      {posts.map((post, index) => {
        return <div key={index}>{post.slug}</div>;
      })}
    </div>
  );
}
