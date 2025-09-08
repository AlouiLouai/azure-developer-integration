import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { User } from "../../types/user";
import { v4 as uuidv4 } from 'uuid';
import { getContainer } from "../../utils/getcontainer";
import { BlobServiceClient } from "@azure/storage-blob";

export async function createUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const container = getContainer('users');

    try {
        const parsedBody = await request.formData();
        const profilePicture = parsedBody.get('profilePicture') as unknown as File;
        
        let profilePictureUrl: string | undefined;

        if (profilePicture) {
            const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureWebJobsStorage);
            const containerClient = blobServiceClient.getContainerClient('profile-pictures');
            const blobName = `${uuidv4()}-${profilePicture.name}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            const buffer = Buffer.from(await profilePicture.arrayBuffer());
            await blockBlobClient.upload(buffer, buffer.length);
            profilePictureUrl = blockBlobClient.url;
        }

        const newUser: User = {
            userId: uuidv4(),
            username: parsedBody.get('username') as string,
            email: parsedBody.get('email') as string,
            password: parsedBody.get('password') as string,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            profilePictureUrl
        };

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
