import { createContext, useEffect, useState } from "react";
import type { User } from "../types/auth";
import apiClient from "../api/client";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginUser: (access: string, refresh: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginUser: async () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loginUser = async (access: string, refresh: string) => {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);

        const response = await apiClient.get<User>("/auth/me/");

        setUser(response.data);
    };

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("access");

        if (accessToken) {
            apiClient.get<User>("/auth/me/")
                .then((response) => {
                    setUser(response.data);
                })
                .catch(() => {
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}