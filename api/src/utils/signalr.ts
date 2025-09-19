import { InvocationContext } from '@azure/functions';
import * as jwt from 'jsonwebtoken';

export function getSignalRServiceInfo(hubName: string, context: InvocationContext, groupName?: string, userId?: string) {
    const connectionString = process.env.AzureSignalRConnectionString;
    if (!connectionString) {
        throw new Error("AzureSignalRConnectionString is not set");
    }

    const endpointMatch = connectionString.match(/Endpoint=([^;]+);/);
    const accessKeyMatch = connectionString.match(/AccessKey=([^;]+);/);

    if (!endpointMatch || !accessKeyMatch) {
        context.log("Invalid AzureSignalRConnectionString format."); // Log error
        throw new Error("Invalid AzureSignalRConnectionString");
    }

    const endpoint = endpointMatch[1];
    const accessKey = accessKeyMatch[1];
    
    let url = `${endpoint}/api/v1/hubs/${hubName}`;
    if (groupName) {
        url = `${url}/groups/${groupName}`;
        if (userId) {
            url = `${url}/users/${userId}`;
        }
    }
    const audience = url;

    const token = jwt.sign({}, accessKey, {
        audience: audience,
        expiresIn: '1h',
    });

    context.log(`SignalR Info: Endpoint=${endpoint}, Hub=${hubName}, Audience=${audience}`); // Log info
    context.log(`SignalR Token (first 20 chars): ${token.substring(0, 20)}...`); // Log partial token

    return { url, token };
}

export async function sendSignalRMessage(hubName: string, target: string, args: any[], groupName?: string, context?: InvocationContext) {
    const { url: finalUrl, token } = getSignalRServiceInfo(hubName, context, groupName);

    const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            target: target,
            arguments: args
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send SignalR message: ${response.status} ${response.statusText} - ${errorText}`);
    }
}
