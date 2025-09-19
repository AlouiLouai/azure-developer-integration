import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getSignalRServiceInfo } from "../../utils/signalr";

export async function joinGroup(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const hubName = 'chat';
    const { userId, groupName } = await request.json() as { userId?: string; groupName?: string };

    if (!userId || !groupName) {
        return {
            status: 400,
            body: "Please provide 'userId' and 'groupName' in the request body."
        };
    }

    try {
        const { url: addGroupUrl, token } = getSignalRServiceInfo(hubName, context, groupName, userId);

        const response = await fetch(addGroupUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to add user to group: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return {
            status: 200,
            body: `User ${userId} added to group ${groupName}.`
        };
    } catch (error) {
        context.log(error);
        return {
            status: 500,
            body: "Error adding user to group."
        };
    }
}

app.http('joinGroup', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'signalr/joinGroup',
    handler: joinGroup
});
