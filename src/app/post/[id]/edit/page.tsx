// @ts-ignore

import { notFound } from "next/navigation";
import EditPostForm from "@/components/EditPostForm";
import { headers, cookies } from "next/headers";

export const dynamic = "force-dynamic";

type PostDTO = { id: number };

async function fetchPost(id: number): Promise<PostDTO | null> {
    // ✅ headers(), cookies() 둘 다 await
    const hdrs = await headers();
    const host = hdrs.get("host");
    if (!host) return null;
    const proto = process.env.NODE_ENV === "production" ? "https" : "http";

    const ck = await cookies();
    const cookie = ck.toString();

    const res = await fetch(`${proto}://${host}/api/posts/${id}`, {
        cache: "no-store",
        headers: { cookie },
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as PostDTO;
}

export default async function Page({ params }: any) {
    const numericId = Number(params?.id);
    if (Number.isNaN(numericId)) return notFound();

    const post = await fetchPost(numericId);
    if (!post) return notFound();

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
            <EditPostForm postId={post.id} />
        </div>
    );
}