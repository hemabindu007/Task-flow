// This is the entry point of your Express application. It does the following:
// Loads environment variables.
// Creates an Express server.
// Adds middleware.
// Registers routes.
// Connects to the database.
// Starts the server.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { syncDatabase } from "./models";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
// a browser safety rule that controls which websites can use a server’s data.
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Task Management API Running");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

syncDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });

export default app;
