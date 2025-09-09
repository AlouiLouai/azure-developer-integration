import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { OAuth2Client } from "google-auth-library";
import { getContainer } from "../../../../utils/getcontainer";
import { User } from "../../../../types/user";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

app.http('google-callback', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'auth/google/callback',
    handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
        const code = req.query.get('code');
        if (!code) {
            return { status: 400, body: "Authorization code not found." };
        }

        try {
            const { tokens } = await client.getToken(code);
            client.setCredentials(tokens);
            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();

            const container = getContainer('users');
            const { resources: users } = await container.items.query({
                query: "SELECT * FROM c WHERE c.providerId = @providerId",
                parameters: [{
                    name: "@providerId",
                    value: payload.sub
                }]
            }).fetchAll();

            if (users.length > 0) {
                return { jsonBody: users[0] };
            }

            const newUser: User = {
                email: payload.email,
                provider: 'google',
                providerId: payload.sub,
                accessToken: tokens.access_token,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                profilePictureUrl: payload.picture
            };

            const { resource: createdUser } = await container.items.create(newUser);
            return { jsonBody: createdUser };

        } catch (error) {
            return { status: 500, body: `Authentication failed: ${error.message}` };
        }
    }
});
