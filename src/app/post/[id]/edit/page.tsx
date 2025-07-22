//글 수정
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPostForm from "@/components/EditPostForm";

// @ts-expect-error nextjs타입시스템 충돌방지
export default async function EditPage({ params }) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const post = await prisma.post.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!post) return notFound();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4"> 게시글 수정 </h1>
      <EditPostForm postId={post.id} />
    </div>
  );
}
