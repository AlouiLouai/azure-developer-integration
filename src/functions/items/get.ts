import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { container } from "../../config/cosmosDBClient";

export async function getItem(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const id = request.params.id;

    if (!id) {
        return {
            status: 400,
            body: "Please provide an item ID."
        };
    }

    try {
        const { resource: item } = await container.item(id, id).read();

        if (item) {
            return { jsonBody: item };
        } else {
            return {
                status: 404,
                body: "Item not found."
            };
        }
    } catch (error) {
        context.log('Error reading item from Cosmos DB:', error);
        if (error.code === 404) {
            return {
                status: 404,
                body: "Item not found."
            };
        }
        return {
            status: 500,
            body: `Failed to read item. Error: ${error.message}`
        };
    }
};

app.http('getItem', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'items/{id}',
    handler: getItem
});
