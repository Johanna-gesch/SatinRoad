import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {Api, type User} from "@/api/Api.ts";

export const MyApi = new Api({
    baseUrl: process.env.NODE_ENV === "production"
        ? "https://SATINROAD-API.fly.dev"
        : "http://localhost:5000"
});

type UsersListProps = {
    users: User[];
    setUsers: Dispatch<SetStateAction<User[]>>;
};

export function UserList({users, setUsers}: UsersListProps) {
    const [editingUserId, setEditingUserId] = useState<string | null>(null);


    function handleEditOrSaveUser(user: User) {
        if (editingUserId === user.userId) {
            MyApi.updateUser.userUpdateUser({
                userId: user.userId,
                userName: user.userName,
            })
                .then(() => setEditingUserId(null))
                .then(() => {
                    MyApi.getUsers.userGetUsers().then(r => {
                        setUsers(r);
                    });
                });
        } else {
            setEditingUserId(user.userId);
        }
    }

    function handleDelete(user: User) {
        MyApi.deleteUser.userDeleteUser({id: user.userId})
            .then(r => {
                MyApi.getUsers.userGetUsers().then(r => {
                    setUsers(r);
                })
            })
    }

    useEffect(() => {
        MyApi.getUsers.userGetUsers().then(r => {
            setUsers(r);
        });
    }, []);

    return (
        <div>
            {users.map(user => (
                <div
                    key={user.userId}
                    className={"adminLists"}
                >
                    <div>
                        {editingUserId === user.userId ? (
                            <input
                                value={user.userName}
                                onChange={e => {
                                    setUsers(users.map(u =>
                                        u.userId === user.userId
                                            ? {...u, userName: e.target.value}
                                            : u
                                    ));
                                }}
                            />
                        ) : (
                            <>{user.userName}</>
                        )}
                    </div>
                    <div className={"adminListsBtns"}>
                        <button onClick={() => handleEditOrSaveUser(user)}>
                            {editingUserId === user.userId ? "Save" : "Edit"}
                        </button>
                        <button onClick={() => handleDelete(user)}>Delete User</button>
                    </div>
                </div>
            ))}
        </div>
    );
}