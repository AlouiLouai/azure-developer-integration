// api/src/services/serviceBus.ts

import { ServiceBusClient } from "@azure/service-bus";

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
if (!connectionString) {
  throw new Error("SERVICE_BUS_CONNECTION_STRING environment variable not set.");
}

const sbClient = new ServiceBusClient(connectionString);

/**
 * Sends a message to the specified Service Bus queue.
 * @param queueName The name of the queue.
 * @param message The message to send.
 */
export async function sendMessageToQueue(queueName: string, message: any): Promise<void> {
  const sender = sbClient.createSender(queueName);
  try {
    const messageToSend = {
      body: message,
      contentType: "application/json"
    };
    await sender.sendMessages(messageToSend);
    console.log(`Sent a single message to the queue: ${queueName}`);
  } finally {
    await sender.close();
  }
}

/**
 * Sends a message to the specified Service Bus topic.
 * @param topicName The name of the topic.
 * @param message The message to send.
 */
export async function sendMessageToTopic(topicName: string, message: any): Promise<void> {
  const sender = sbClient.createSender(topicName);
  try {
    const messageToSend = {
      body: message,
      contentType: "application/json"
    };
    await sender.sendMessages(messageToSend);
    console.log(`Sent a single message to the topic: ${topicName}`);
  } finally {
    await sender.close();
  }
}
