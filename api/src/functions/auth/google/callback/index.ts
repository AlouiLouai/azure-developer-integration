import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { OAuth2Client } from "google-auth-library";
import * as jwt from 'jsonwebtoken';
import { getContainer } from "../../../../utils/getcontainer";

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
            return { status: 400, body: "Code is required" };
        }

        try {
            const { tokens } = await client.getToken(code);
            client.setCredentials(tokens);

            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { sub: googleId, email, name, picture } = payload;

            const container = await getContainer('users');
            const { resources: users } = await container.items.query({ 
                query: "SELECT * FROM c WHERE c.googleId = @googleId",
                parameters: [{ name: "@googleId", value: googleId }]
            }).fetchAll();

            let user = users[0];

            if (!user) {
                const newUser = {
                    googleId,
                    email,
                    name,
                    picture,
                    createdAt: new Date(),
                };
                const { resource: createdUser } = await container.items.create(newUser);
                user = createdUser;
            }

            const jwtToken = jwt.sign({ id: user.id, name: user.name, picture: user.picture }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return {
                status: 302,
                headers: {
                    "Set-Cookie": `authToken=${jwtToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60}`, // Max-Age for 1 hour
                    Location: `${process.env.FRONTEND_URL}/auth/callback`
                }
            };
        } catch (error) {
            console.error(error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});