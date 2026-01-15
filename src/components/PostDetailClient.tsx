"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import CommentForm from "@/components/CommentForm";
import EditCommentForm from "@/components/EditCommentForm";
import type { PostVM, CommentVM, AppUser } from "@/lib/types";
import { formatAuthorName } from "@/lib/author";
import { resolveImageUrl } from "@/lib/image";

export default function PostDetailClient({ post }: { post: PostVM }) {
    const router = useRouter();

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

    // ✅ 현재 로그인 유저 (NextAuth 제거 → /api/me로 조회)
    const [me, setMe] = useState<AppUser | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    if (mounted) setMe(null);
                    return;
                }

                const res = await fetch(`${apiBase}/api/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                });

                if (res.ok) {
                    const raw: unknown = await res.json();
                    const candidate =
                        raw && typeof raw === "object" && "data" in raw ? (raw as { data?: unknown }).data : raw;
                    const parsed =
                        candidate && typeof candidate === "object" && "id" in candidate
                            ? (candidate as AppUser)
                            : null;
                    if (mounted) setMe(parsed);
                } else if (mounted) {
                    setMe(null);
                }
            } catch {
                if (mounted) setMe(null);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [apiBase]);

    const currentUserId = me ? Number(me.id) : undefined;
    const currentUserRole = me?.role; // "USER" | "ADMIN"

    const [comments, setComments] = useState<CommentVM[]>(post.comments || []);
    const [editingId, setEditingId] = useState<number | null>(null);

    // ✅ 댓글 새로고침 (프록시 경유)
    const fetchComments = async () => {
        const res = await fetch(`${apiBase}/api/comment?postId=${post.id}`, {
            credentials: "include",
            cache: "no-store",
        });
        if (!res.ok) {
            // 필요 시 에러 처리
            return;
        }
        const data: CommentVM[] = await res.json();
        setComments(data);
    };

    useEffect(() => {
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post.id]);

    // ✅ 게시글 삭제 (프록시 경유)
    const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        const res = await fetch(`${apiBase}/api/posts/${post.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (res.ok) {
            router.push("/");
            router.refresh();
        } else {
            try {
                const data = await res.json();
                alert(data?.message ?? "삭제 실패");
            } catch {
                alert("삭제 실패");
            }
        }
    };

    // ✅ 댓글 삭제 (프록시 경유)
    const deleteComment = async (commentId: number) => {
        if (!confirm("댓글 삭제하시겠습니까?")) return;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }


        const res = await fetch(`${apiBase}/api/comment/${commentId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            let msg = "삭제 실패";
            try {
                const data = await res.json();
                msg = data?.message || data?.error || msg;
            } catch {}
            alert(msg);
            return;
        }

        alert("삭제 완료");
        fetchComments();
    };

    return (
        <div>
            <p className="my-4">{post.content}</p>

            {/* 게시글 수정/삭제 */}
            <div className="flex gap-2 mb-4">
                <button onClick={handleDelete} className="text-red-600">
                    🗑 삭제
                </button>
                <button onClick={() => router.push(`/post/${post.id}/edit`)} className="text-blue-600">
                    ✏️ 수정
                </button>
            </div>

            {/* ✅ 이미지 출력 (next/image 최적화) */}
            {post.images && post.images.length > 0 && (
                <div className="flex flex-wrap gap-4 my-4">
                    {post.images.map((img) => {
                        const imageSrc = resolveImageUrl(img.url, apiBase);
                        if (!imageSrc) return null;
                        return (
                            <div key={img.id} className="relative w-64 h-48">
                                <Image src={imageSrc} alt="첨부 이미지" fill className="object-cover rounded border" />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ✅ 댓글 영역 */}
            <div className="mt-6 space-y-2">
                <h2 className="text-lg font-semibold">댓글</h2>

                {/* 댓글 작성 폼: onSuccess 시 목록 갱신 */}
                <CommentForm postId={post.id} onSuccess={fetchComments} />

                {comments.length === 0 ? (
                    <p className="text-sm text-gray-500">댓글이 없습니다.</p>
                ) : (
                    comments.map((comment) => {
                        const isOwner = currentUserId !== undefined && comment.author?.id === currentUserId;
                        const isAdmin = currentUserRole === "ADMIN"; // 백엔드와 대소문자 맞추기
                        return (
                            <div key={comment.id} className="border p-2 rounded">
                                <p className="text-sm text-gray-500">{formatAuthorName(comment.author)}</p>

                                {editingId === comment.id ? (
                                    <EditCommentForm
                                        commentId={comment.id}
                                        initialContent={comment.content}
                                        onFinish={() => {
                                            setEditingId(null);
                                            fetchComments();
                                        }}
                                    />
                                ) : (
                                    <>
                                        <p>{comment.content}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </p>

                                        {(isOwner || isAdmin) && (
                                            <div className="flex gap-2 mt-1">
                                                <button
                                                    onClick={() => setEditingId(comment.id)}
                                                    className="text-blue-600 text-sm"
                                                >
                                                    ✏️ 수정
                                                </button>
                                                <button
                                                    onClick={() => deleteComment(comment.id)}
                                                    className="text-red-600 text-sm"
                                                >
                                                    🗑 삭제
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
