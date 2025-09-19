import { database } from "../config/cosmosDBClient";

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export async function getUserByDisplayName(displayName: string): Promise<User | undefined> {
  const container = database.container("users"); // Assuming a 'users' container
  const querySpec = {
    query: "SELECT * FROM c WHERE c.name = @displayName",
    parameters: [
      {
        name: "@displayName",
        value: displayName,
      },
    ],
  };

  const { resources } = await container.items.query<User>(querySpec).fetchAll();
  return resources[0]; // Return the first user found, or undefined
}

export async function getUserById(id: string): Promise<User | undefined> {
  const container = database.container("users");
  const querySpec = {
    query: "SELECT * FROM c WHERE c.googleId = @id",
    parameters: [
      {
        name: "@id",
        value: id,
      },
    ],
  };

  const { resources } = await container.items.query<User>(querySpec).fetchAll();
  return resources[0]; // Return the first user found, or undefined
}
