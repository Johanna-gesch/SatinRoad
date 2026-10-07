import {useEffect, useState} from "react";
import { Api, type User } from "@/api/Api.ts";

export const MyApi = new Api({
    baseUrl: process.env.NODE_ENV === "production"
        ? "https://SATINROAD-API.fly.dev"   // ret når backend er deployet
        : "http://localhost:5000"
});

type LoginPageProps = {
    onLogin: (user: User) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState("");

    useEffect(() => {
        MyApi.getUsers.userGetUsers().then(r => {
            setUsers(r);
        })
    }, []);

    function handleLogin() {
        const user = users.find(u => u.userName === selectedUser);

        if (user) {
            onLogin(user);
        }
    }

    return (
        <div className="loginOverlay"> {/*Layer to "lock" the homepage */}
            <div className="loginPopup"> {/*The actual popup */}
                <h2>Welcome to SatinRoad</h2>

                <p>Choose your user:</p>

                <select
                    value={selectedUser}
                    onChange={e => setSelectedUser(e.target.value)}
                >
                    <option value={""}>Choose user</option>

                    {users.map(user => (
                        <option key={user.userId} value={user.userName}>
                            {user.userName}
                        </option>
                    ))}
                </select>
                <br />
                <button onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    );
}