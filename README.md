# Serverless Items API

A simple serverless CRUD API for managing items, built with TypeScript and deployed on Azure Functions. It uses Azure Cosmos DB as its data store.

## Features

- Create, Read, Update, and Delete (CRUD) operations for items.
- Built with TypeScript for type safety.
- Serverless architecture using Azure Functions.
- Connects to Azure Cosmos DB for data persistence.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20.x or later recommended)
- [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools)
- An Azure account and a configured Azure Cosmos DB instance.

## Setup and Configuration

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd serverless
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure local settings:**

    This project requires a `local.settings.json` file in the root directory to store your Cosmos DB connection string. This file is not checked into source control for security reasons.

    Create a file named `local.settings.json` and add the following content, replacing the placeholder with your actual Cosmos DB connection string:

    ```json
    {
      "IsEncrypted": false,
      "Values": {
        "AzureWebJobsStorage": "",
        "FUNCTIONS_WORKER_RUNTIME": "node",
        "CosmosDbConnectionString": "YOUR_COSMOS_DB_CONNECTION_STRING"
      }
    }
    ```

## Running the Project Locally

Once the setup is complete, you can start the local development server:

```bash
npm start
```

This command will build the TypeScript source and launch the Azure Functions host. The API will be available at `http://localhost:7071`.

## API Endpoints

The following endpoints are available:

| Method | Route              | Description                               |
| :----- | :----------------- | :---------------------------------------- |
| `POST` | `/api/items`       | Creates a new item.                       |
| `GET`  | `/api/items`       | Retrieves a list of all items.            |
| `GET`  | `/api/items/{id}`  | Retrieves a single item by its ID.        |
| `PUT`  | `/api/items/{id}`  | Replaces an existing item with new data.  |
| `DELETE`| `/api/items/{id}`| Deletes an item by its ID.                |

### Example: Create an Item

**Request:** `POST /api/items`

**Body:**
```json
{
    "name": "My New Item",
    "price": 19.99,
    "description": "This is a description of my new item."
}
```

### Example: Update an Item

**Request:** `PUT /api/items/{id}`

**Body:**
```json
{
    "name": "My Updated Item",
    "price": 25.99,
    "description": "This is the updated description."
}
```

## Deployment

This function app can be deployed to Azure using the [Azure Functions extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) or the Azure CLI. Ensure your Cosmos DB connection string is configured in the application settings of your Function App on Azure.
