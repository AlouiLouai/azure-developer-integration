import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

app.http("signOut", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "auth/signout",
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log(`Http function processed request for url "${request.url}"`);

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.FRONTEND_URL,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
        },
      };
    }

    const isDevelopment = process.env.FRONTEND_URL.startsWith('http://localhost');
    const cookieAttributes = `authToken=; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT${isDevelopment ? '' : '; Secure'}`;

    return {
      status: 200,
      headers: {
        "Set-Cookie": cookieAttributes,
        "Access-Control-Allow-Origin": process.env.FRONTEND_URL,
        "Access-Control-Allow-Credentials": "true",
      },
      body: "Signed out successfully.",
    };
  },
});