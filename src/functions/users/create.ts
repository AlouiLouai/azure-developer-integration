import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { User } from "../../types/user";
import { v4 as uuidv4 } from 'uuid';
import { getContainer } from "../../utils/getcontainer";

export async function createUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    // Get the specific container for users
    const container = getContainer('users');

    try {
        const item = await request.json() as Omit<User, 'userId'>;
        const newUser: User = { ...item, userId: uuidv4() };

        const { resource: createdUser } = await container.items.create(newUser);

        return { jsonBody: createdUser };
    } catch (error) {
        context.log('Error creating item:', error);
        return {
            status: 500,
            body: `Failed to create item. Error: ${error.message}`
        };
    }
};

app.http('createUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'users',
    handler: createUser
});
