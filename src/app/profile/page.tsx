// src/app/profile/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { AppUser } from "@/types/auth";
import ProfilePageClient from "@/components/ProfilePageClient";

export default async function Page() {
    const cookie = cookies().toString();
    const res = await fetch(`${process.env.BACKEND_URL}/api/me`, {
        headers: { cookie },
        cache: "no-store",
    });

    if (!res.ok) redirect("/login");
    const user = (await res.json()) as AppUser;

    return <ProfilePageClient user={user} />;
}