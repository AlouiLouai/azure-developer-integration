export interface User {
    userId?: string;
    email: string;
    provider: string;
    providerId: string;
    accessToken: string;
    createdAt: string;
    updatedAt: string;
    profilePictureUrl?: string;
}