import express from "express";
import cors from "cors";
import connection from "./models/index.js";
import bookRoutes from "./routes/bookR.js";
import userRoutes from "./routes/userR.js";
import orderRoutes from "./routes/orderR.js";
import "dotenv/config";

const app = express();

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

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await connection.authenticate();
    await connection.sync();
    console.log("Successfully connected to the database");
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
});
