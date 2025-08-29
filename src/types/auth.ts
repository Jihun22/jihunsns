// src/types/auth.ts

// 1) 백엔드 응답 그대로(예시)
export type AppUserDTO = {
    id: number;                 // 백엔드가 number면 number
    email: string;
    nickname?: string;          // 백엔드가 username이면 nickname?: string, username?: string 등
    username?: string;
    role: string | { name: string } | string[]; // 다양할 수 있어 넉넉히
};

// 2) 프론트에서 쓸 확정 모델
export type Role = "USER" | "ADMIN";

export type AppUser = {
    id: number;
    email: string;
    nickname: string;
    role: Role;
};