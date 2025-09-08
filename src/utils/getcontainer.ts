import { database } from "../config/cosmosDBClient";

/**
 * Returns a Cosmos DB container instance.
 * @param containerId The ID of the container to retrieve.
 * @returns The Cosmos DB container object.
 */
export const getContainer = (containerId: string) => {
    return database.container(containerId);
};