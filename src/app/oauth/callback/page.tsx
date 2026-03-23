"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const normalizeNextPath = (value: string | null) => {
  if (!value) return "/";
  if (value.startsWith("/")) return value;
  return "/";
};

function OAuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("소셜 로그인 처리중입니다...");
  const [error, setError] = useState<string | null>(null);

  const serialized = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(serialized);
    const accessToken = params.get("accessToken") ?? params.get("access_token");
    const refreshToken = params.get("refreshToken") ?? params.get("refresh_token");
    const errorParam = params.get("error");
    const description = params.get("message") ?? params.get("error_description");
    const nextPath = normalizeNextPath(params.get("next"));

    if (errorParam) {
      setStatus("소셜 로그인에 실패했습니다.");
      setError(description || errorParam);
      return;
    }

    if (!accessToken) {
      setStatus("소셜 로그인에 실패했습니다.");
      setError("접근 토큰이 전달되지 않았습니다.");
      return;
    }

    let timer: number | null = null;

    try {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      window.dispatchEvent(new Event("auth:updated"));
      setStatus("로그인 성공! 잠시 후 메인으로 이동합니다.");

      timer = window.setTimeout(() => {
        router.replace(nextPath);
      }, 800);
    } catch (err) {
      console.error("[OAuthCallback] Failed to persist tokens", err);
      setStatus("소셜 로그인에 실패했습니다.");
      setError("토큰 저장 중 문제가 발생했습니다.");
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [serialized, router]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-2 text-center">
      <p className="text-lg font-semibold">{status}</p>
      {!error ? (
        <p className="text-sm text-gray-500">이 페이지는 잠시 후 자동으로 닫히거나 이동합니다.</p>
      ) : (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-2 text-center">
          <p className="text-lg font-semibold">소셜 로그인 처리중입니다...</p>
          <p className="text-sm text-gray-500">이 페이지는 잠시 후 자동으로 닫히거나 이동합니다.</p>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
