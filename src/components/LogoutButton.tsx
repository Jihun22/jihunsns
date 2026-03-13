"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.replace("/login");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-blue-500 text-white px-4 py-2 rounded"
        >
            로그아웃
        </button>
    );
}