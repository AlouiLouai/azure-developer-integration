import { input, output } from "@azure/functions";

export const cosmosOutput = output.cosmosDB({
    
    databaseName: process.env.COSMOS_DB_DATABASE_NAME || 'dev',
    containerName: process.env.COSMOS_DB_CONTAINER_NAME || 'items',
    createIfNotExists: true,
    connection: process.env.CosmosDBConnectionString, 
});

export const cosmosInput = input.cosmosDB({
    databaseName: process.env.COSMOS_DB_DATABASE_NAME,
    containerName: process.env.COSMOS_DB_CONTAINER_NAME,
    id: '{id}',
    partitionKey: '{id}',
    connection: process.env.CosmosDBConnectionString,
});

export const cosmosInputAll = input.cosmosDB({
    databaseName: process.env.COSMOS_DB_DATABASE_NAME,
    containerName: process.env.COSMOS_DB_CONTAINER_NAME,
    sqlQuery: 'SELECT * from items',
    connection: process.env.CosmosDBConnectionString,
});

