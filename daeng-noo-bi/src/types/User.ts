export interface User {
    id: string;
    password: string;
    email: string;
    favorites?: string[]; // optional
}