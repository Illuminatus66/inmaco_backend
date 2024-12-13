import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connect_db.js";
import authRoutes from "./routes/authRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

dotenv.config();
connectDB();
const app = express();

const allowedOrigins = ["https://inmaco.netlify.app"];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/api/admin", authRoutes);
app.use("/api/invoices", invoiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
