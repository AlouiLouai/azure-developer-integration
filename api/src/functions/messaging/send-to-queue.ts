// api/src/functions/send-to-queue.ts

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { sendMessageToQueue } from "../../services/serviceBus";

export async function sendToQueue(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const queueName = "queue";
    const message = await request.json();

    if (!message) {
        return {
            status: 400,
            body: "Please pass a message in the request body."
        };
    }

    try {
        await sendMessageToQueue(queueName, message);
        return {
            status: 200,
            body: `Message sent to queue ${queueName}`
        };
    } catch (error) {
        context.log(error);
        return {
            status: 500,
            body: "Error sending message to queue."
        };
    }
};

app.http('send-to-queue', {
    methods: ['POST'],
    authLevel: 'anonymous', // WARNING: Not for production use. Changed for testing.
    handler: sendToQueue
});
