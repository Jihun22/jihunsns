// src/lib/mappers.ts
import type { AppUserDTO, AppUser, Role } from "@/types/auth";

function hasRoleName(value: unknown): value is { name: string } {
    return typeof value === "object" && value !== null && "name" in value;
}

function normalizeRole(raw: AppUserDTO["role"]): Role {
    const candidate = Array.isArray(raw) ? raw[0] : raw;
    const value = hasRoleName(candidate) ? candidate.name : candidate ?? "";
    const upper = String(value).replace(/^ROLE_/, "").toUpperCase();
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
