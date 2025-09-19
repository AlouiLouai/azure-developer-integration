// api/src/functions/send-to-queue.ts

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { sendMessageToQueue } from "../../services/serviceBus";
import { getUserById } from "../../utils/userUtils";

interface IncomingChatMessage {
  id?: string; // Make id optional
  senderId: string;
  recipientId: string;
  text: string;
}

export async function sendToQueue(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const queueName = "queue";
    const incomingMessage = await request.json() as IncomingChatMessage;

    if (!incomingMessage || !incomingMessage.senderId || !incomingMessage.recipientId || !incomingMessage.text) {
        return {
            status: 400,
            body: "Please pass a message with 'senderId', 'recipientId', and 'text' in the request body."
        };
    }

    try {
        const senderUser = await getUserById(incomingMessage.senderId);
        const recipientUser = await getUserById(incomingMessage.recipientId);

        if (!senderUser) {
            return {
                status: 404,
                body: `Sender user with ID '${incomingMessage.senderId}' not found.`
            };
        }
        if (!recipientUser) {
            return {
                status: 404,
                body: `Recipient user with ID '${incomingMessage.recipientId}' not found.`
            };
        }

        // Generate a consistent conversationId by sorting user IDs
        const userIds = [senderUser.id, recipientUser.id].sort();
        const conversationId = userIds.join('_');

        const messageToSend = {
            id: incomingMessage.id, // Pass the client-generated ID
            sender: senderUser,
            recipient: recipientUser,
            conversationId: conversationId,
            text: incomingMessage.text,
            timestamp: new Date().toISOString(),
        };

        await sendMessageToQueue(queueName, messageToSend);
        return {
            status: 200,
            body: `Message sent to queue ${queueName} for conversation ${conversationId}`
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
    authLevel: 'anonymous',
    handler: sendToQueue
});