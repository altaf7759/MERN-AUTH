import express from "express";
import cors from "cors";
import "dotenv/config.js";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouters.js";

const app = express();
const port = process.env.PORT || 4000;

// Database connection
connectDB();

const allowedOrigins = ["https://mern-auth-gold-chi.vercel.app"];

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API Endpoints
app.get("/", (req, res) => {
  res.send("API working");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`Server started at ${port}`));
