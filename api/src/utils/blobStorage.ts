import { BlobServiceClient, StorageSharedKeyCredential, BlobSASPermissions, generateBlobSASQueryParameters } from "@azure/storage-blob";
import { v4 as uuidv4 } from 'uuid';
import { FileUploadError } from "./errors";

export async function uploadProfilePicture(profilePicture: File): Promise<string> {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureWebJobsStorage);
        const containerClient = blobServiceClient.getContainerClient('profile-pictures');
        const blobName = `${uuidv4()}-${profilePicture.name}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const buffer = Buffer.from(await profilePicture.arrayBuffer());
        
        // Set content type based on the file's MIME type
        const uploadOptions = {
            blobHTTPHeaders: {
                blobContentType: profilePicture.type || 'application/octet-stream',
            },
        };

        await blockBlobClient.upload(buffer, buffer.length, uploadOptions);

        // Generate SAS URL
        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
        const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

        if (!accountName || !accountKey) {
            throw new Error("Azure Storage Account Name or Key not found in environment variables.");
        }

        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

        const sasOptions = {
            containerName: containerClient.containerName,
            blobName: blobName,
            permissions: BlobSASPermissions.parse("r"), // Read-only permission
            startsOn: new Date(),
            expiresOn: new Date(new Date().valueOf() + (3600 * 1000)), // Token expires in 1 hour
        };

        const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
        return `${blockBlobClient.url}?${sasToken}`;

    } catch (error) {
        throw new FileUploadError(`Failed to upload profile picture. Error: ${error.message}`);
    }
}
