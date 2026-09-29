import {useEffect, useState} from "react";
import {Api, type Product, type Category} from "@/api/Api.ts";

export const MyApi = new Api();

export function UserList() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        MyApi.getUsers.userGetUsers().then(r => {
            setUsers(r);
        });
    }, []);
    
    return (
        <div>
            {users.map(user => (
                <div key={user.userId}>
                    {user.userName}
                </div>
            ))}
        </div>
    )    
}