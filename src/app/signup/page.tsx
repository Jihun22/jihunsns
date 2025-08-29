"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", nickname: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const checkDuplicate = async (email: string, nickname: string) => {
        const res = await fetch(`${API_BASE}/api/user/check-nickname`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, nickname }),
        });
        if (!res.ok) throw new Error("중복 검사 실패");
        return res.json();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const duplicate = await checkDuplicate(form.email, form.nickname);

            if (duplicate.email) {
                setMessage("이미 사용중인 이메일");
                return;
            }
            if (duplicate.nickname) {
                setMessage("이미 사용중인 닉네임");
                return;
            }

            const res = await fetch(`${API_BASE}/api/auth/signup`, {
                method: "POST",
                body: JSON.stringify(form),
                headers: { "Content-Type": "application/json" },
            });

            let data: any = {};
            try {
                data = await res.json();
            } catch {}

            if (res.ok) {
                setMessage("회원가입 성공!");
                router.push("/login");
            } else {
                setMessage(data?.error || "회원가입 실패");
            }
        } catch (err) {
            console.error("회원가입 오류", err);
            setMessage("회원가입 요청 실패");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">회원가입</h1>
            <form onSubmit={handleSubmit} className="space-y-2">
                <input name="email" placeholder="이메일" onChange={handleChange} className="border p-2 w-full" />
                <input name="nickname" placeholder="닉네임" onChange={handleChange} className="border p-2 w-full" />
                <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} className="border p-2 w-full" />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? "가입 중..." : "가입하기"}
                </button>
            </form>
            {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
        </div>
    );
}