// src/lib/mappers.ts
import type { AppUserDTO, AppUser, Role } from "@/types/auth";

function normalizeRole(raw: AppUserDTO["role"]): Role {
    const val =
        Array.isArray(raw) ? raw[0] :
            typeof raw === "object" && raw && "name" in raw ? (raw as any).name :
                String(raw || "");

    const upper = val.replace(/^ROLE_/, "").toUpperCase();
    return upper === "ADMIN" ? "ADMIN" : "USER";
}

export function toAppUser(dto: AppUserDTO): AppUser {
    return {
        id: Number(dto.id),
        email: dto.email,
        nickname: dto.nickname ?? dto.username ?? "",  // 비어 있으면 빈 문자열
        role: normalizeRole(dto.role),
    };
}