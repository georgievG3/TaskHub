import { createContext, useEffect, useState } from "react";
import type { User } from "../types/auth";
import apiClient from "../api/client";

interface AuthContextType {
    user: User | null;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("access");

        if (accessToken) {
            console.log("TOKEN:", accessToken);
            apiClient.get<User>("/auth/me/")
                .then((response) => {
                    setUser(response.data);
                })
                .catch(() => {
                    setUser(null);
                });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
}