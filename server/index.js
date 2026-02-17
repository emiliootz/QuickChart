/**
 * Express is the framework we use to create our backend API.
 * It handles incoming requests from the frontend (React).
 */
import express from "express";
/**
 * CORS allows the React frontend to talk to this server.
 * Without it, the browser would block requests for security reasons.
 */
import cors from "cors";
/**
 * Loads environment variables from the .env file.
 * This is how we read things like the server port and database connection string.
 */
import "dotenv/config";

const app = express();

/**
 * Enable CORS so our React app (running on a different port)
 * can communicate with this backend.
 */
app.use(cors());

/**
 * Allows this server to receive JSON data from the frontend.
 * For when EMT data is sent to generate narratives.
 */
app.use(express.json());

/**
 * Health check endpoint.
 * 
 * This provides a simple way to confirm the server is running and reachable.
 * The frontend calls this when it loads to verify the connection.
 * 
 * This endpoint does not change anything — it only reports status.
 */

app.get("/health", (req, res) => {
  res.json({
    // Indicates the server is working correctly.
    ok: true,
    /**
     * Identifies which service is responding.
     * Useful when multiple backend services exist.
     */
    service: "epcr-api",
    /**
     * Shows the current server time.
     * This confirms the response is live and not cached.
     */
    time: new Date().toISOString()
  });
});

// Read the port number from the .env file.
const PORT = process.env.PORT;

/**
 * Start the server and begin listening for requests.
 * After this runs, the backend is active and ready to receive requests from the frontend.
 */
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
