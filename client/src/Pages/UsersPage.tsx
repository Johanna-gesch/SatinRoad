import type {User} from "@/api/Api.ts";
import {UserList} from "@/Components/Users/UserList.tsx"
import {useState} from "react";
import {UserCreateForm} from "@/Components/Users/UserCreateForm.tsx";

export function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    return (
        <div>
            <UserCreateForm setUsers={setUsers} />
            <UserList users={users} setUsers={setUsers} />
        </div>
    )
}