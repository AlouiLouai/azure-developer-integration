// api/src/functions/process-queue-message.ts
import { app, output, InvocationContext } from "@azure/functions";
import { getContainer } from "../utils/getcontainer";
import { v4 as uuidv4 } from 'uuid';

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
if (!connectionString) {
  throw new Error("SERVICE_BUS_CONNECTION_STRING environment variable not set.");
}

const signalROutput = output.generic({
    type: 'signalR',
    name: 'signalR',
    hubName: 'serverless',
    direction: 'out',
});

app.serviceBusQueue('process-queue-message', {
    connection: connectionString,
    queueName: 'queue',
    extraOutputs: [signalROutput],
    handler: async (message: unknown, context: InvocationContext) => {
        context.log('Service bus queue function processed message:', message);

        // 1. Save message to Cosmos DB
        try {
            const container = getContainer('messages');
            const newItem = {
                id: uuidv4(),
                message: message,
                createdAt: new Date().toISOString()
            };
            await container.items.create(newItem);
            context.log('Message saved to Cosmos DB');

            // 2. Send message to SignalR
            context.extraOutputs.set(signalROutput, {
                'target': 'newMessage',
                'arguments': [newItem]
            });
            context.log('Message sent to SignalR hub');

        } catch (error) {
            context.log('Error processing message:', error);
        }
    },
});
