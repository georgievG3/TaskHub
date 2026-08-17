import apiClient from "../api/client";
import type { TokenResponse, User } from "../types/auth";

export const login = async (
    email: string,
    password: string
): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>(
        "/auth/login/",
        {
            email,
            password,
        }
    );

    return response.data;
};

export const register = async (
    email: string,
    password: string,
    first_name: string,
    last_name: string
): Promise<User> => {
    const response = await apiClient.post<User>(
        "/auth/register/",
        {
            email,
            password,
            first_name,
            last_name,
        }
    );

    return response.data;
};

export const getMe = async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me/");

    return response.data;
};

export async function refreshToken(refresh: string) {
    const response = await apiClient.post("/auth/refresh/", {
        refresh: refresh,
    });

    return response.data;
}