import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { container } from "../../config/cosmosDBClient";

export async function deleteItem(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const id = request.params.id;

    if (!id) {
        return {
            status: 400,
            body: "Please provide an item ID."
        };
    }

    try {
        await container.item(id, id).delete();

        return { body: "Item deleted successfully." };
    } catch (error) {
        context.log('Error deleting item from Cosmos DB:', error);
        return {
            status: 500,
            body: `Failed to delete item. Error: ${error.message}`
        };
    }
};

app.http('deleteItem', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'items/{id}',
    handler: deleteItem
});
