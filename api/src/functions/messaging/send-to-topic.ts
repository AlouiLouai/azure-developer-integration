// api/src/functions/send-to-topic.ts

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { sendMessageToTopic } from "../../services/serviceBus";

export async function sendToTopic(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const topicName = "topic"; 
    const message = await request.json();

    if (!message) {
        return {
            status: 400,
            body: "Please pass a message in the request body."
        };
    }

    try {
        await sendMessageToTopic(topicName, message);
        return {
            status: 200,
            body: `Message sent to topic ${topicName}`
        };
    } catch (error) {
        context.log(error);
        return {
            status: 500,
            body: "Error sending message to topic."
        };
    }
};

app.http('send-to-topic', {
    methods: ['POST'],
    authLevel: 'function',
    handler: sendToTopic
});
