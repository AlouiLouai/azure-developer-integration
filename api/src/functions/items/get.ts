import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getContainer } from "../../utils/getcontainer";

export async function getItem(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        const { resource: item } = await container.item(id, id).read();

        if (item) {
            return { jsonBody: item, headers: corsHeaders };
        } else {
            return {
                status: 404,
                body: "Item not found.",
                headers: corsHeaders
            };
        }
    } catch (error) {
        context.log('Error reading item from Cosmos DB:', error);
        if (error.code === 404) {
            return {
                status: 404,
                body: "Item not found.",
                headers: corsHeaders
            };
        }
        return {
            status: 500,
            body: `Failed to read item. Error: ${error.message}`,
            headers: corsHeaders
        };
    }
};

app.http('getItem', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'items/{id}',
    handler: getItem
});
