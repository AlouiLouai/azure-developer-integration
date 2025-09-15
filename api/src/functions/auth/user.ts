import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import jwt from "jsonwebtoken";

interface DecodedToken {
  name: string;
  email: string;
  picture?: string;
  sub: string; // Google user ID
}

app.http("user", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous", // This should be 'function' or 'anonymous' with proper token validation
  route: "user",
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    context.log(`Http function processed request for url "${request.url}"`);

    const corsHeaders = {
      "Access-Control-Allow-Origin": process.env.FRONTEND_URL,
      "Access-Control-Allow-Credentials": "true",
    };

    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return {
        status: 200,
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      };
    }

    const cookieHeader = request.headers.get("Cookie");
    let token: string | undefined;

    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      for (const cookie of cookies) {
        if (cookie.startsWith("authToken=")) {
          token = cookie.substring("authToken=".length);
          break;
        }
      }
    }

    if (!token) {
      return {
        status: 401,
        body: "Unauthorized: No token provided.",
        headers: corsHeaders,
      };
    }

    try {
      // In a real application, you would verify the token with Google's API
      // or a robust JWT library with your secret.
      // Verify the token using the JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

      if (!decoded) {
        return {
          status: 401,
          body: "Unauthorized: Invalid token.",
          headers: corsHeaders,
        };
      }

      const userProfile = {
        id: decoded.sub, // Google user ID
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture, // URL to user's profile picture
      };

      return {
        status: 200,
        jsonBody: userProfile,
        headers: corsHeaders,
      };
    } catch (error: any) {
      context.error("Token decoding error:", error);
      return {
        status: 401,
        body: `Unauthorized: Token verification failed. ${error.message}`,
        headers: corsHeaders,
      };
    }
  },
});
