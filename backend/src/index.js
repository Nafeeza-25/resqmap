import { onRequest } from "firebase-functions/v2/https";
import { createApiHandler } from "./app.js";
import { createRepositoryFromEnv } from "./repository/index.js";

let appPromise = null;

function getApp() {
  if (!appPromise) {
    appPromise = createRepositoryFromEnv().then(repository => createApiHandler({ repository }));
  }
  return appPromise;
}

// Export the Express app as a Firebase Cloud Function
export const api = onRequest(async (req, res) => {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error) {
    console.error("Failed to initialize app:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
