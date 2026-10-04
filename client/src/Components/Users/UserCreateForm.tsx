import {Api, type User} from "@/api/Api.ts";
import {type Dispatch, type SetStateAction, useState} from "react";


export const MyApi = new Api();

export function UserCreateForm({setUsers}:{
    setUsers: Dispatch<SetStateAction<User[]>>;
}) {
    const [userNameField, setUserNameField] = useState("");

    function handleCreateUser(){
        MyApi.createUser.userCreateUser({userName: userNameField})
            .then(() => setUserNameField(""))
            .then(() =>{
                MyApi.getUsers.userGetUsers().then(r => {
                    setUsers(r);
                });
            });
    }
    return (
        <div>
            Create User:
            <input
                placeholder={"Username"}
                value={userNameField}
                onChange={(e) => setUserNameField(e.target.value)}
                ></input>/
            <button onClick={handleCreateUser}>Create User</button>
        </div>
    )
}