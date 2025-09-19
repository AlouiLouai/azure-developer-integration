import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { database } from "../../config/cosmosDBClient";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface StoredMessage {
  id: string;
  sender: User;
  recipient: User;
  conversationId: string;
  text: string;
  createdAt: string;
}

export async function getConversationHistory(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const conversationId = request.query.get('conversationId');

    if (!conversationId) {
        return {
            status: 400,
            body: "Please provide a 'conversationId' in the query parameters."
        };
    }

    try {
        const container = database.container("messages");
        const querySpec = {
            query: "SELECT * FROM c WHERE c.conversationId = @conversationId ORDER BY c.createdAt ASC",
            parameters: [
                {
                    name: "@conversationId",
                    value: conversationId,
                },
            ],
        };

        const { resources: messages } = await container.items.query<StoredMessage>(querySpec).fetchAll();

        return {
            status: 200,
            jsonBody: messages
        };
    } catch (error) {
        context.log(error);
        return {
            status: 500,
            body: "Error fetching conversation history."
        };
    }
}

app.http('getConversationHistory', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'messages/history',
    handler: getConversationHistory
});
