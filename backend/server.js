import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json()); // to parse req.body
app.use(cookieParser()); // to parse req.cookies
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);

connectDB();
app.listen(port, () => {
  console.log(`Server Started at http://localhost:${port}`);
});
