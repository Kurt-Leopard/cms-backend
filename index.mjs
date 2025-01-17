import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router as authRouter } from "./src/routes/authRoutes.mjs";
import cookieParser from "cookie-parser";
dotenv.config();

const port = process.env.PORT;
const app = express();
const corsConfig = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());
app.use(authRouter);
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
