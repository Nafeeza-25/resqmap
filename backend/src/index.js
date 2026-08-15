import { onRequest } from "firebase-functions/v2/https";
import { createApiHandler } from "./app.js";
import { createRepositoryFromEnv } from "./repository/index.js";

// Initialize the repository once when the function is loaded
const repository = await createRepositoryFromEnv();
const app = createApiHandler({ repository });

// Export the Express app as a Firebase Cloud Function
export const api = onRequest(app);
