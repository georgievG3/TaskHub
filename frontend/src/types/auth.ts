export interface TokenResponse {
    access: string;
    refresh: string;
}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
}