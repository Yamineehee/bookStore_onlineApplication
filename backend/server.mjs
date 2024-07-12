import express from "express";
import cors from "cors";
import connection from "./models/index.js"; // Import the Sequelize connection
import bookRoutes from "./routes/bookR.js";
import userRoutes from "./routes/userR.js";
import orderRoutes from "./routes/orderR.js";
import "dotenv/config";

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve static files from the 'public/uploads' directory
app.use('/uploads', express.static('public/uploads'));

// Simple route to check if the backend is working
app.get("/", (req, res) => res.send("Backend is working"));

// API routes
app.use("/book", bookRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);

// Get the port from environment variables or use 8000 by default
const PORT = process.env.PORT || 8000;

// Start the server and connect to the database
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await connection.authenticate(); // Authenticate the connection to the database
    await connection.sync(); // Sync all defined models to the database
    console.log("Successfully connected to the database");
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
});
