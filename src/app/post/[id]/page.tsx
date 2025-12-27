import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import PostDetailClient from "@/components/PostDetailClient";

export const dynamic = "force-dynamic";

interface PostDTO {
  id: number;
  content: string;
  createdAt: string;
  author?: { id: number; nickname?: string };
  images?: Array<{ id: number; url: string }>;
  comments?: Array<{
    id: number;
    content: string;
    createdAt: string;
    author?: { id: number; nickname?: string };
  }>;
}

async function fetchPost(id: number): Promise<PostDTO | null> {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:8080";

  const res = await fetch(`${apiBase}/api/posts/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return (await res.json()) as PostDTO;
}

export default async function Page({ params }: any) {
  const numericId = Number(params.id);
  if (Number.isNaN(numericId)) return notFound();

  const post = await fetchPost(numericId);
  if (!post) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">게시글 상세</h1>
      <p className="text-gray-500">작성자: {post.author?.nickname}</p>

      {/* @ts-expect-error: Next.js type generation for PageProps is stale and incorrectly requires Promise */}
      <PostDetailClient post={post} />

      <p className="text-xs text-gray-400">
        {new Date(post.createdAt).toLocaleString()}
      </p>

      <BackButton />
    </div>
  );
}
