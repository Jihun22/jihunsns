// src/types/next-auth.d.ts

// ❌ 삭제: import NextAuth from 'next-auth' (사용하지 않으니 제거)

import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            role?: string | null;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        id: string;
        name?: string | null;
        email?: string | null;
        role?: string | null;
    }
}
