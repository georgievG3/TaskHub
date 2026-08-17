import { useState } from "react";
import { login } from "../../services/authServices";
import LogoutButton from "../../components/LogoutButton";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loginUser } = useContext(AuthContext);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const tokens = await login(email, password);

            console.log("LOGIN SUCCESS - calling loginUser");

            await loginUser(tokens.access, tokens.refresh);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <button type="submit">Login</button>
            <LogoutButton />
        </form>
    );
}