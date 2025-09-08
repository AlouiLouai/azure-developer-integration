import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getContainer } from "../../utils/getcontainer";

export async function updateProfile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    let requestBody;
    try {
        requestBody = await request.json();
    } catch (error) {
        return {
            status: 400,
            body: "Please provide a valid JSON body."
        };
    }

    const { userId, profilePictureUrl } = requestBody;

    if (!userId || !profilePictureUrl) {
        return {
            status: 400,
            body: "Please provide both 'userId' and 'profilePictureUrl'."
        };
    }

    const container = getContainer("users");

    try {
        // First, get the existing user item from Cosmos DB
        const { resource: user } = await container.item(userId, userId).read();
        
        if (!user) {
            return {
                status: 404,
                body: `User with ID ${userId} not found.`
            };
        }

        // Update the user item with the new profile picture URL
        const updatedUser = { ...user, profilePictureUrl };
        const { resource: result } = await container.items.upsert(updatedUser);

        return { jsonBody: result };
    } catch (error) {
        context.log('Error updating user profile:', error);
        return {
            status: 500,
            body: `Failed to update user profile. Error: ${error.message}`
        };
    }
};

app.http('updateProfile', {
    methods: ['PUT'], 
    authLevel: 'function', 
    route: 'users/{userId}',
    handler: updateProfile
});
