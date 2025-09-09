import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

app.http('google', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'auth/google',
    handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
        const url = client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
        });
        return {
            status: 302,
            headers: {
                Location: url
            }
        };
    }
});
