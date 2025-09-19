import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { database } from "../../config/cosmosDBClient";
import { User } from "../../utils/userUtils"; // Reusing the User interface

export async function getAllUsers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const container = database.container("users"); // Assuming a 'users' container
        const querySpec = {
            query: "SELECT * FROM c" // Fetch all documents
        };

        const { resources: users } = await container.items.query<User>(querySpec).fetchAll();

        return {
            status: 200,
            jsonBody: users
        };
    } catch (error) {
        context.log(error);
        return {
            status: 500,
            body: "Error fetching users."
        };
    }
}

app.http('users', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'users', // GET /api/users
    handler: getAllUsers
});
