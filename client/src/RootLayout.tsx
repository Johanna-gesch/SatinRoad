import {useState} from "react";
import type {User} from "@/api/Api.ts";
import {Outlet} from "react-router-dom";

export function RootLayout() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    return (
        <Outlet context={{ selectedUser, setSelectedUser }} />
    );
}