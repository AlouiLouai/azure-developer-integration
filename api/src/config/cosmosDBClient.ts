import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.CosmosDBConnectionString;
const databaseName = process.env.COSMOS_DB_CONTAINER_NAME;

if (!connectionString) {
    throw new Error("Cosmos DB connection string is missing. Please check your environment variables.");
}

if (!databaseName) {
    throw new Error("Cosmos DB database ID is missing. Please check your environment variables.");
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
export const database = client.database(databaseName);
