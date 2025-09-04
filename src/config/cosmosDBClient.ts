import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.CosmosDBConnectionString;

if (!connectionString) {
  throw new Error("Cosmos DB connection string is missing. Please check your environment variables.");
}

class CosmosDBClient {
    private static instance: CosmosClient;

    private constructor() {}

    public static getInstance(): CosmosClient {
        if (!CosmosDBClient.instance) {
            CosmosDBClient.instance = new CosmosClient(connectionString);
        }
        return CosmosDBClient.instance;
    }
}

const client = CosmosDBClient.getInstance();
const databaseId = process.env.COSMOS_DB_DATABASE_ID || 'items';
const containerId = process.env.COSMOS_DB_CONTAINER_ID || 'dev';
const database = client.database(databaseId);

export const container = database.container(containerId);