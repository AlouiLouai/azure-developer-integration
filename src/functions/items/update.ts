import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { container } from "../../config/cosmosDBClient";
import { Item } from "../../types/item";

export async function updateItem(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const id = request.params.id;

    if (!id) {
        return {
            status: 400,
            body: "Please provide an item ID."
        };
    }

    try {
        const itemFromRequest = await request.json() as Omit<Item, 'id'>;
        const itemToReplace = { ...itemFromRequest, id: id };

        const { resource: updatedItem } = await container.item(id, id).replace(itemToReplace);

        return { jsonBody: updatedItem };
    } catch (error) {
        context.log('Error updating item in Cosmos DB:', error);
        return {
            status: 500,
            body: `Failed to update item. Error: ${error.message}`
        };
    }
};

app.http('updateItem', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'items/{id}',
    handler: updateItem
});
