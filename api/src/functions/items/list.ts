import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getContainer } from "../../utils/getcontainer";

export async function listItems(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const corsHeaders = {
        "Access-Control-Allow-Origin": process.env.FRONTEND_URL,
        "Access-Control-Allow-Credentials": "true",
    };

    const container = getContainer('items');

    try {
        const { resources: items } = await container.items.readAll().fetchAll();
        return { jsonBody: items, headers: corsHeaders };
    } catch (error) {
        context.log('Error reading items from Cosmos DB:', error);
        return {
            status: 500,
            body: `Failed to read items. Error: ${error.message}`,
            headers: corsHeaders
        };
    }
};

app.http('listItems', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'items',
    handler: listItems
});