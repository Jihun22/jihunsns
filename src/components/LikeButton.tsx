"use client";
import {useEffect, useState } from "react";

interface LikeButtonProps {
  postId: number;
  initialLiked: boolean;
  initialCount: number;
}

export default function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const toggleLike = async () => {
    const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        process.env.NEXTAUTH_URL ??
        "http://localhost:8080";

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const res = await fetch(`${apiBase}/api/like/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({postId})
    });

    if (!res.ok) {
      // 여기서 C006(401) 나오면 토큰이 없거나 만료/형식 문제
      const err = await res.json().catch(() => ({}));
      console.error("like error", res.status, err);
      alert(err?.message ?? "좋아요 실패");
      return;
    }


    const data = await res.json();
    setLiked(data.liked);
    setCount(data.count); // 백엔드가 count 주면 그걸로
  };

  return (
      <button onClick={toggleLike} className="text-sm text-pink-500">
        {liked ? "💖" : "🤍"} {count}
      </button>
  );
}