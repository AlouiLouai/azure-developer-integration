// api/src/functions/messaging/poll-service-bus-queue.ts
import { app, InvocationContext, Timer } from "@azure/functions";
import { ServiceBusClient, ServiceBusReceivedMessage } from "@azure/service-bus";
import { v4 as uuidv4 } from 'uuid';
import { getContainer } from "../../utils/getcontainer";
import { sendSignalRMessage } from "../../utils/signalr";

const serviceBusConnectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = "queue";

if (!serviceBusConnectionString) {
  throw new Error("SERVICE_BUS_CONNECTION_STRING environment variable not set.");
}

app.timer('poll-service-bus-queue', {
    schedule: '*/5 * * * * *', // Run every 5 seconds
    handler: async (myTimer: Timer, context: InvocationContext) => {
        context.log('Timer trigger function started.');

        const sbClient = new ServiceBusClient(serviceBusConnectionString);
        const receiver = sbClient.createReceiver(queueName);

        try {
            const messages: ServiceBusReceivedMessage[] = await receiver.receiveMessages(10, { maxWaitTimeInMs: 4000 }); // slightly less than 5s schedule

            if (messages.length === 0) {
                context.log('No messages received from the queue.');
                return;
            }

            context.log(`Received ${messages.length} messages from the queue.`);

            await Promise.all(messages.map(async (message) => {
                context.log(`Processing message with ID: ${message.messageId}`);
                context.log(`Raw message body type: ${typeof message.body}`);
                context.log(`Raw message body: ${JSON.stringify(message.body)}`);

                try {
                    interface User {
                      id: string;
                      name: string;
                      email: string;
                      picture?: string;
                    }

                    interface QueueMessage {
                      id?: string; // Add optional id
                      sender: User;
                      recipient: User;
                      conversationId: string;
                      text: string;
                      timestamp: string;
                    }

                    const queueMessage: QueueMessage = message.body;

                    context.log(`Parsed queue message: ${JSON.stringify(queueMessage)}`);

                    if (!queueMessage || !queueMessage.sender || !queueMessage.conversationId) {
                        context.log('Message is missing required properties. Abandoning.');
                        await receiver.abandonMessage(message);
                        return;
                    }

                    // 1. Save message to Cosmos DB
                    const container = getContainer('messages');
                    const newItem = {
                        id: queueMessage.id || uuidv4(), // Use client-generated ID or generate new
                        sender: queueMessage.sender,
                        recipient: queueMessage.recipient,
                        conversationId: queueMessage.conversationId,
                        text: queueMessage.text,
                        createdAt: queueMessage.timestamp,
                    };
                    await container.items.create(newItem);
                    context.log('Message saved to Cosmos DB');

                    // 2. Send message to SignalR manually
                    const signalR_payload = {
                        id: newItem.id,
                        message: {
                            sender: newItem.sender,
                            recipient: newItem.recipient,
                            conversationId: newItem.conversationId,
                            text: newItem.text,
                        },
                        createdAt: newItem.createdAt,
                    };
                    context.log(`Sending to SignalR group ${newItem.conversationId} with payload: ${JSON.stringify(signalR_payload)}`);

                    try {
                        await sendSignalRMessage('chat', 'newMessage', [signalR_payload], newItem.conversationId, context);
                        context.log('Message sent to SignalR hub manually');
                    } catch (signalRError) {
                        context.error('Error sending SignalR message:', signalRError);
                    }

                    // Complete the message to remove it from the queue
                    await receiver.completeMessage(message);
                    context.log('Message completed on Service Bus queue.');

                } catch (innerError) {
                    context.log(`Error processing message ${message.messageId}:`, innerError);
                    await receiver.abandonMessage(message);
                }
            }));
        } catch (error) {
            context.log('Error polling Service Bus queue:', error);
        } finally {
            await receiver.close();
            await sbClient.close();
            context.log('Service Bus client and receiver closed.');
        }
        context.log('Timer trigger function finished.');
    },
});
