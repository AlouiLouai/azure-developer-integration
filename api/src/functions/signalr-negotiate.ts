import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as jwt from 'jsonwebtoken';

const hubName = 'chat';

function getSignalRConnectionInfo() {
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

    // The audience for the token is the client URL
    const audience = url;
    
    // The token is valid for 1 hour
    const token = jwt.sign({}, accessKey, {
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
    handler: (request: HttpRequest, context: InvocationContext): HttpResponseInit => {
        try {
            context.log('Manually negotiating SignalR connection...');
            const connectionInfo = getSignalRConnectionInfo();
            context.log('SignalR connection negotiated successfully.');
            return { jsonBody: connectionInfo };
        } catch (e) {
            context.log('Error during manual negotiation:', e.message);
            return { status: 500, body: "Failed to negotiate connection." };
        }
    }
});
