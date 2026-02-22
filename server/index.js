// index.js (server)

import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoute from "./routes/userRoute.js";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";


// load env Server
dotenv.config();
// console.log(process.env);

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to Database
connectDB();

// Core's configuration
const allowedOrigins = [process.env.ADMIN_URL].filter(Boolean); // Remove any undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile app,curl request)
      if (!origin) return callback(null, true);
      // In dev mode> allow all origin for easier testing
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      // Production cases
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware
// Increase body size limit for JSON & URL-encoded payloads
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); 

// Routes (entry get way)
// app.get("/api/products", (req, res)=> {
//   res.send("Product route is working")
// });
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoute);

// API Documentation

// Home Route
app.get("/", (req, res) => {
  res.send("Hello from Baby mart!!");
});

// Error Handler

// Start Server setup
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL}`);
  console.log(`Admin URL: ${process.env.ADMIN_URL}`);
  console.log(`API docs available at: http://localhost:${PORT}/api/docs`);
});
