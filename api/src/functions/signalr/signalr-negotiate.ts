import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as jwt from 'jsonwebtoken';

const hubName = 'chat';

// This function now accepts an optional userId to include in the token
function getSignalRConnectionInfo(userId?: string) {
    const connectionString = process.env.AzureSignalRConnectionString;
    if (!connectionString) {
        throw new Error("AzureSignalRConnectionString is not set");
    }

    const endpointMatch = connectionString.match(/Endpoint=([^;]+);/);
    const accessKeyMatch = connectionString.match(/AccessKey=([^;]+);/);

    if (!endpointMatch || !accessKeyMatch) {
        throw new Error("Invalid AzureSignalRConnectionString");
    }

    const endpoint = endpointMatch[1];
    const accessKey = accessKeyMatch[1];
    const url = `${endpoint}/client/?hub=${hubName}`;

    const audience = url;
    
    // If a userId is provided, include it in the token payload as the 'nameid' claim
    const payload = userId ? { nameid: userId } : {};

    const token = jwt.sign(payload, accessKey, {
        audience: audience,
        expiresIn: '1h', 
    });

    return {
        url: url,
        accessToken: token
    };
}

app.http('negotiate', {
    methods: ['POST', 'GET'],
    authLevel: 'anonymous',
    route: 'negotiate',
    handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
        try {
            context.log('Manually negotiating SignalR connection...');

            // Extract user ID from the auth token cookie, similar to the /api/user function
            const cookieHeader = request.headers.get("Cookie");
            let authToken: string | undefined;

            if (cookieHeader) {
                const cookies = cookieHeader.split(';').map(c => c.trim());
                for (const cookie of cookies) {
                    if (cookie.startsWith("authToken=")) {
                        authToken = cookie.substring("authToken=".length);
                        break;
                    }
                }
            }

            let userId: string | undefined;
            if (authToken) {
                try {
                    // Verify the token and extract the user ID from the 'sub' claim
                    const decoded = jwt.verify(authToken, process.env.JWT_SECRET) as { sub: string };
                    userId = decoded.sub;
                } catch (e) {
                    context.log('Auth token verification failed, proceeding with anonymous connection.', e.message);
                    // If token is invalid, we don't block negotiation but connect anonymously.
                }
            }

            if (userId) {
                context.log(`Negotiating connection for user: ${userId}`);
            } else {
                context.log('Negotiating connection for an anonymous user.');
            }

            // Get connection info, now with the user ID included in the token
            const connectionInfo = getSignalRConnectionInfo(userId);
            context.log('SignalR connection negotiated successfully.');
            return { jsonBody: connectionInfo };
        } catch (e) {
            context.log('Error during manual negotiation:', e.message);
            return { status: 500, body: "Failed to negotiate connection." };
        }
    }
});
