import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Item } from "../../types/item";
import { v4 as uuidv4 } from 'uuid';
import { getContainer } from "../../utils/getcontainer";
import { validate, itemSchema } from "../../utils/zodValidation";

export async function createItem(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const item = await request.json();
        const validationResult = validate(item, itemSchema);

        if ('status' in validationResult) {
            return validationResult;
        }

        const newItem: Item = { ...(validationResult as Omit<Item, 'id'>), id: uuidv4() };

        const container = getContainer('items');

        const { resource: createdItem } = await container.items.create(newItem);

        return { jsonBody: createdItem };
    } catch (error) {
        context.log('Error creating item:', error);
        return {
            status: 500,
            body: `Failed to create item. Error: ${error.message}`
        };
    }
};

app.http('createItem', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'items',
    handler: createItem
});
