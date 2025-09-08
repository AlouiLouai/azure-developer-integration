import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  SASProtocol,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = "profile-pictures"; // The container where images will be stored

// We'll create a single credential instance to reuse
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

export async function generateSasToken(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`); 

  let requestBody: any;
  try {
    requestBody = await request.json();
  } catch (error) {
    return {
      status: 400,
      body: "Please provide a valid JSON body.",
    };
  }
  const { fileName, userId } = requestBody;
  if (!fileName || !userId) {
    return {
      status: 400,
      body: "Please provide both 'fileName' and 'userId' in the request body.",
    };
  }

  if (!accountName || !accountKey) {
    return {
      status: 500,
      body: "Azure Storage credentials are not set in environment variables.",
    };
  } // Use the user ID to organize files within the container, // which is a best practice for security and manageability.

  const blobName = `${userId}/${uuidv4()}-${fileName}`;

  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      sharedKeyCredential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); 

    const sasOptions = {
      containerName,
      blobName,
      permissions: BlobSASPermissions.from({ write: true }), // Grant write permission
      protocol: SASProtocol.Https, // Force HTTPS
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // Token valid for 1 hour
    }; // Generate the SAS token string
    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    ).toString(); // Combine the blob URL and the SAS token for the client
    const sasUrl = blockBlobClient.url + "?" + sasToken; // Return the blob name and the SAS URL to the client.

    return {
      jsonBody: {
        blobName: blobName,
        sasUrl: sasUrl,
      },
    };
  } catch (error) {
    context.log("Error generating SAS token:", error);
    return {
      status: 500,
      body: `Failed to generate SAS token. Error: ${error.message}`,
    };
  }
}

app.http("generateSasToken", {
  methods: ["POST"],
  authLevel: "function",
  route: "sas-token",
  handler: generateSasToken,
});
