export interface User {
    id: string;
    email: string;
    password: string;
    fullName: string;
    creationDate: Date;
    lastLogin: Date;
    role: string;
}