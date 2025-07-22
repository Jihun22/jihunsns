// src/app/users/page.tsx
import { getUsers } from "@/lib/db/user";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">회원 목록</h1>
      <ul className="mt-2 space-y-1">
        {users.map(user => (
          <li key={user.id}>
            {user.email} / {user.nickname}
          </li>
        ))}
      </ul>
    </div>
  );
}
