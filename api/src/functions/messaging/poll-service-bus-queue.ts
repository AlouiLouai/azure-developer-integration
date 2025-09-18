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

const sbClient = new ServiceBusClient(serviceBusConnectionString);
const receiver = sbClient.createReceiver(queueName);

app.timer('poll-service-bus-queue', {
    schedule: '*/5 * * * * *', // Run every 5 seconds
    handler: async (myTimer: Timer, context: InvocationContext) => {
        context.log('Timer trigger function started.');

        try {
            const messages: ServiceBusReceivedMessage[] = await receiver.receiveMessages(10, { maxWaitTimeInMs: 5000 });

            if (messages.length === 0) {
                context.log('No messages received from the queue.');
                return;
            }

            await Promise.all(messages.map(async (message) => {
                context.log(`Processing message: ${message.body}`);

                try {
                    const messageBody = message.body; // Assuming message.body is the actual content

                    // 1. Save message to Cosmos DB
                    const container = getContainer('messages');
                    const newItem = {
                        id: uuidv4(),
                        message: messageBody,
                        createdAt: new Date().toISOString()
                    };
                    await container.items.create(newItem);
                    context.log('Message saved to Cosmos DB');

                    // 2. Send message to SignalR manually
                    await sendSignalRMessage('chat', 'newMessage', [newItem]);
                    context.log('Message sent to SignalR hub manually');

                    // Complete the message to remove it from the queue
                    await receiver.completeMessage(message);
                    context.log('Message completed on Service Bus queue.');

                } catch (innerError) {
                    context.log(`Error processing message ${message.messageId}:`, innerError);
                    // Abandon the message so it can be retried
                    await receiver.abandonMessage(message);
                }
            }));
        } catch (error) {
            context.log('Error polling Service Bus queue:', error);
        } finally {
            // It's important to close the receiver and client when the function is done,
            // but for a timer trigger that runs repeatedly, we might want to keep them open
            // or manage their lifecycle carefully. For simplicity, we'll keep them open
            // at the global scope for now, assuming the host manages the process lifecycle.
            // If the function app is frequently restarted, this might lead to issues.
            // A more robust solution would involve managing the client/receiver per invocation
            // or using a singleton pattern with proper cleanup.
        }
        context.log('Timer trigger function finished.');
    },
});
