import { HttpResponseInit } from "@azure/functions";
import { z } from "zod";

/**
 * Validates the request data against a Zod schema.
 * Handles both JSON and key-value objects from form data.
 * @param data The data object to validate.
 * @param schema The Zod schema to validate against.
 * @returns A validated object or an HTTP response with an error.
 */
export function validate<T>(
  data: any,
  schema: z.ZodSchema<T>
): T | HttpResponseInit {
  try {
    const validatedData = schema.parse(data);
    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        jsonBody: {
          message: "Validation failed.",
          errors: error,
        },
      };
    }

    return {
      status: 400,
      jsonBody: {
        message: "Invalid data format or missing fields.",
      },
    };
  }
}

export const itemSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters long"),
  description: z.string().optional(),
});

export const itemUpdateSchema = itemSchema.partial();
