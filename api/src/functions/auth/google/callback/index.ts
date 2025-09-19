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
                    id: googleId, // Explicitly set id to googleId
                    googleId,
                    email,
                    name,
                    picture,
                    createdAt: new Date(),
                };
                const { resource: createdUser } = await container.items.create(newUser);
                user = createdUser;
            }

            const jwtToken = jwt.sign({ sub: user.id, name: user.name, email: user.email, picture: user.picture }, process.env.JWT_SECRET, { expiresIn: '1h' });

            const isDevelopment = process.env.FRONTEND_URL.startsWith('http://localhost');
            const cookieAttributes = `authToken=${jwtToken}; Path=/; SameSite=Lax; Max-Age=${60 * 60}${isDevelopment ? '' : '; Secure'}`;

            return {
                status: 302,
                headers: {
                    "Set-Cookie": cookieAttributes, 
                    Location: `${process.env.FRONTEND_URL}/auth/callback`
                }
            };
        } catch (error) {
            console.error(error);
            return { status: 500, body: "Internal Server Error" };
        }
    }
});