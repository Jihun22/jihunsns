"use client";

import BackButton from "@/components/BackButton";
import type { AppUser } from "@/types/auth";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Msg = { text: string; type: "success" | "error" | "" };

export default function ProfilePageClient() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [saving, setSaving] = useState(false);

    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    const [currentNickname, setCurrentNickname] = useState("");
    const [draftNickname, setDraftNickname] = useState("");

    const [msg, setMsg] = useState<Msg>({ text: "", type: "" });

    const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ??
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        "http://localhost:8080";

    const NICK_RE = useMemo(() => /^[A-Za-z0-9가-힣._-]{2,20}$/, []);
    const busy = saving || isPending;

    // ✅ 클라이언트에서 내 정보 로딩 (Bearer)
    useEffect(() => {
        const load = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    router.replace("/login");
                    return;
                }

                const res = await fetch(`${backendUrl}/api/user/me`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    cache: "no-store",
                });

                if (!res.ok) {
                    router.replace("/login");
                    return;
                }

                const json = await res.json();
                const u = json?.data as AppUser; // ✅ ApiResponse.data
                if (!u) {
                    router.replace("/login");
                    return;
                }

                setUser(u);
                setCurrentNickname(u.nickname);
                setDraftNickname(u.nickname);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [backendUrl, router]);

    const onSave = async () => {
        const next = draftNickname.trim();

        if (!next) return setMsg({ text: "닉네임을 입력하세요.", type: "error" });
        if (next === currentNickname) return setMsg({ text: "기존 닉네임과 동일합니다.", type: "error" });
        if (!NICK_RE.test(next))
            return setMsg({ text: "닉네임은 2~20자, 영문/숫자/한글/._-만 사용할 수 있어요.", type: "error" });

        setSaving(true);
        setMsg({ text: "", type: "" });

        try {
            // 1) 중복 검사 (응답: ApiResponse<CheckNicknameRes>)
            const dupRes = await fetch(`${backendUrl}/api/user/check-nickname`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nickname: next }),
            });

            const dupJson = dupRes.ok ? await dupRes.json() : null;
            const exists = dupJson?.data?.exists ?? true;
            if (exists) {
                setMsg({ text: "이미 사용중인 닉네임입니다.", type: "error" });
                return;
            }

            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setMsg({ text: "로그인이 필요합니다.", type: "error" });
                router.replace("/login");
                return;
            }

            // 2) 닉네임 변경 (Bearer 필요)
            const res = await fetch(`${backendUrl}/api/user/nickname`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ nickname: next }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.message || data?.error || "닉네임 변경 실패");
            }

            // ✅ 성공 처리(로컬 UI 즉시 반영)
            setCurrentNickname(next);
            setDraftNickname(next);
            setUser((prev) => (prev ? { ...prev, nickname: next } : prev));
            setMsg({ text: "닉네임 변경 완료!", type: "success" });

            startTransition(() => router.refresh());
        } catch (e: any) {
            setMsg({ text: e?.message || "닉네임 변경 실패", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="max-w-md mx-auto p-6">로딩중...</div>;
    if (!user) return null; // router.replace로 이동 중

    return (
        <div className="max-w-md mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">내 프로필</h1>

            <div className="space-y-2">
                <p><strong>이메일:</strong> {user.email}</p>
                <p><strong>닉네임:</strong> {currentNickname}</p>
                <p><strong>ID:</strong> {String(user.id)}</p>
                <p><strong>권한:</strong> {user.role}</p>
            </div>

            <div className="space-y-2">
                <input
                    type="text"
                    value={draftNickname}
                    onChange={(e) => {
                        setDraftNickname(e.target.value);
                        if (msg.text) setMsg({ text: "", type: "" });
                    }}
                    onKeyDown={(e) => {
                        // @ts-ignore
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) onSave();
                    }}
                    className="border p-2 w-full"
                    placeholder="새 닉네임"
                    disabled={busy}
                    aria-label="닉네임 입력"
                    autoComplete="nickname"
                />

                <button
                    onClick={onSave}
                    disabled={busy}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-busy={busy}
                >
                    {busy ? "저장 중..." : "닉네임 수정"}
                </button>
            </div>

            {msg.text && (
                <p className={`text-sm ${msg.type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {msg.text}
                </p>
            )}

            <BackButton />
        </div>
    );
}