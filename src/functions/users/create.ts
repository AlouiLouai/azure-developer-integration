import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { User } from "../../types/user";
import { v4 as uuidv4 } from 'uuid';
import { getContainer } from "../../utils/getcontainer";
import * as bcrypt from 'bcrypt';
import { HttpError, FileUploadError } from "../../utils/errors";
import { uploadProfilePicture } from "../../utils/blobStorage";
import { validate, userSchema } from "../../utils/zodValidation";

async function createUserLogic(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const formData = await request.formData();
    const userString = formData.get('user') as string;

    if (!userString || typeof userString !== 'string') {
        throw new HttpError(400, "Please provide the user data as a JSON string in the 'user' field.");
    }

    const user = JSON.parse(userString);
    const validationResult = validate(user, userSchema);
    if ('status' in validationResult) {
        return validationResult;
    }

    const validatedUser = validationResult as Omit<User, 'userId' | 'createdAt' | 'updatedAt' | 'profilePictureUrl'>;

    let profilePictureUrl: string | undefined;
    const profilePicture = formData.get('profilePicture') as unknown as File;
    if (profilePicture) {
        profilePictureUrl = await uploadProfilePicture(profilePicture);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validatedUser.password, saltRounds);

    const newUser: User = {
        userId: uuidv4(),
        username: validatedUser.username,
        email: validatedUser.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profilePictureUrl
    };

    const container = getContainer('users');
    const { resource: createdUser } = await container.items.create(newUser);

    return { jsonBody: createdUser };
}

export async function createUser(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        return await createUserLogic(request, context);
    } catch (error) {
        context.log('Error creating user:', error);
        if (error instanceof SyntaxError) {
            return {
                status: 400,
                body: `Invalid JSON in the 'user' field. Error: ${error.message}`
            };
        }
        if (error instanceof HttpError) {
            return {
                status: error.status,
                body: error.message
            };
        }
        if (error instanceof FileUploadError) {
            return {
                status: 500,
                body: error.message
            };
        }
        return {
            status: 500,
            body: `Failed to create user. Error: ${error.message}`
        };
    }
}

app.http('createUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'users',
    handler: createUser
});
