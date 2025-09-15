import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Item } from "../../types/item";
import { getContainer } from "../../utils/getcontainer";
import { validate, itemUpdateSchema } from "../../utils/zodValidation";

export async function updateItem(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        const itemFromRequest = await request.json();
        const validationResult = validate(itemFromRequest, itemUpdateSchema);

        if ('status' in validationResult) {
            return { ...validationResult, headers: corsHeaders };
        }

        const { resource: existingItem } = await container.item(id, id).read<Item>();

        if (!existingItem) {
            return {
                status: 404,
                body: "Item not found.",
                headers: corsHeaders
            };
        }

        const itemToUpdate: Item = { ...existingItem, ...validationResult };

        const { resource: updatedItem } = await container.item(id, id).replace(itemToUpdate);

        return { jsonBody: updatedItem, headers: corsHeaders };
    } catch (error) {
        context.log('Error updating item:', error);
        return {
            status: 500,
            body: `Failed to update item. Error: ${error.message}`,
            headers: corsHeaders
        };
    }
};

app.http('updateItem', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'items/{id}',
    handler: updateItem
});