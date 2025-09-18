import * as jwt from 'jsonwebtoken';

function getSignalRServiceInfo(hubName: string) {
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
    
    const url = `${endpoint}/api/v1/hubs/${hubName}`;
    const audience = `${endpoint}/api/v1/hubs/${hubName}`;

    const token = jwt.sign({}, accessKey, {
        audience: audience,
        expiresIn: '1h',
    });

    return { url, token };
}

export async function sendSignalRMessage(hubName: string, target: string, args: any[]) {
    const { url, token } = getSignalRServiceInfo(hubName);

    const response = await fetch(url, {
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
