// src/app/post/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import PostDetailClient from "@/components/PostDetailClient";

// @ts-expect-error nextjs타입시스템 충돌방지
export default async function PostDetailPage({ params }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const post = await prisma.post
    .findUnique({
      where: { id },
      include: {
        author: true,
        images: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: "desc" },
        },
      },
    })
    .then(post =>
      post
        ? {
            ...post,
            createdAt: post.createdAt.toISOString(),
            comments: post.comments.map(comment => ({
              ...comment,
              createdAt: comment.createdAt.toISOString(),
            })),
          }
        : null
    );

  if (!post) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">게시글 상세</h1>
      <p className="text-gray-500">작성자: {post.author?.nickname}</p>

      <PostDetailClient post={post} />

      <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>

      <BackButton />
    </div>
  );
}
