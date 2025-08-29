// src/lib/types.ts
export type Role = "USER" | "ADMIN";

// 서버 응답 DTO (optional 많게)
export interface AuthorDTO { id: number; nickname?: string }
export interface CommentDTO {
    id: number;
    content: string;
    createdAt: string;
    author?: AuthorDTO;
}
export interface PostDTO {
    id: number;
    title?: string;
    content?: string;
    createdAt: string;
    author?: AuthorDTO;
    images?: { id: number; url: string }[];
    comments?: CommentDTO[];
}

// 클라이언트에서 쓰는 확정 VM (필수/배열 보장, author는 optional)
export interface AuthorVM { id: number; nickname?: string }
export interface CommentVM {
    id: number;
    content: string;
    createdAt: string;
    author?: AuthorVM;
}
export interface PostVM {
    id: number;
    content: string; // 항상 문자열 보장
    title?: string;
    createdAt: string;
    author?: AuthorVM;
    images: { id: number; url: string }[];
    comments: CommentVM[];
}

// 로그인 유저
export type AppUser = {
    id: number | string;
    email: string;
    nickname: string;
    role: Role;
};