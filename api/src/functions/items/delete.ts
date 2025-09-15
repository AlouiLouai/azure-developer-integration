import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getContainer } from "../../utils/getcontainer";

export async function deleteItem(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const corsHeaders = {
        "Access-Control-Allow-Origin": process.env.FRONTEND_URL,
        "Access-Control-Allow-Credentials": "true",
    };

    const id = request.params.id;

    if (!id) {
        return {
            status: 400,
            body: "Please provide an item ID.",
            headers: corsHeaders
        };
    }

    const container = getContainer('items');

    try {
        await container.item(id, id).delete();

        return { body: "Item deleted successfully.", headers: corsHeaders };
    } catch (error) {
        context.log('Error deleting item from Cosmos DB:', error);
        return {
            status: 500,
            body: `Failed to delete item. Error: ${error.message}`,
            headers: corsHeaders
        };
    }
};

app.http('deleteItem', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'items/{id}',
    handler: deleteItem
});
