import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPostForm from "@/components/EditPostForm";

export default async function EditPage({
                                           params,
                                       }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const numericId = Number(id);
    if (isNaN(numericId)) return notFound();

    const post = await prisma.post.findUnique({
        where: { id: numericId },
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