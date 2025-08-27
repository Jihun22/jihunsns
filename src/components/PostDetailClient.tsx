"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import CommentForm from "@/components/CommentForm";
import EditCommentForm from "@/components/EditCommentForm";
import { useSession } from "next-auth/react";

// ✅ 타입 정의
interface ImageInfo {
  id: number;
  url: string;
}

interface CommentInfo {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    nickname: string;
  };
}

interface PostInfo {
  id: number;
  content: string;
  images?: ImageInfo[];
  comments?: CommentInfo[];
}

export default function PostDetailClient({ post }: { post: PostInfo }) {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const currentUserRole = session?.user?.role;

  const [comments, setComments] = useState<CommentInfo[]>(post.comments || []);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ✅ 댓글 새로고침
  const fetchComments = async () => {
    const res = await fetch(`http://localhost:8080/api/comment?postId=${post.id}`);
    const data: CommentInfo[] = await res.json();
    setComments(data);
  };

  // ✅ 게시글 삭제
  const handleDelete = async () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const res = await fetch(`http://localhost:8080/api/post/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/");
        router.refresh(); // 페이지 새로고침 (Next.js 13 이상)
      } else {
        alert("삭제 실패");
      }
    }
  };

  // ✅ 댓글 삭제
  const deleteComment = async (commentId: number) => {
    if (!confirm("댓글 삭제하시겠습니까?")) return;

    const res = await fetch(`http://localhost:8080/api/comment/${commentId}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "삭제 실패");
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
        <button onClick={() => router.push(`http://localhost:8080/post/${post.id}/edit`)} className="text-blue-600">
          ✏️ 수정
        </button>
      </div>

      {/* ✅ 이미지 출력 (next/image 최적화) */}
      {post.images && post.images.length > 0 && (
        <div className="flex flex-wrap gap-4 my-4">
          {post.images.map(img => (
            <div key={img.id} className="relative w-64 h-48">
              <Image src={img.url} alt="첨부 이미지" fill className="object-cover rounded border" />
            </div>
          ))}
        </div>
      )}

      {/* ✅ 댓글 영역 */}
      <div className="mt-6 space-y-2">
        <h2 className="text-lg font-semibold">댓글</h2>
        <CommentForm postId={post.id} onSuccess={fetchComments} />

        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">댓글이 없습니다.</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="border p-2 rounded">
              <p className="text-sm text-gray-500">{comment.author.nickname}</p>

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

                  {(Number(currentUserId) === comment.author.id || currentUserRole === "admin") && (
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
          ))
        )}
      </div>
    </div>
  );
}
