import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import requestRoutes from "./routes/requestRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
dotenv.config();

const app = express();


connectDB();


const corsOptions = {
  origin: ['https://lotus-green-management-31lb.vercel.app', 'https://lotus-green-management-git-main-nityam-kumars-projects.vercel.app/', 'https://lotus-green-management-r9d40hee9-nityam-kumars-projects.vercel.app/'], // Add more domains here
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(express.json()); 

app.use('/api/users', userRoutes);
app.use('/api/pg', roomRoutes);
app.use('/api/students', studentRoutes);
app.use('/api',paymentRoutes);
app.use("/api/expenses",expenseRoutes);
app.use("/api/requests",requestRoutes);
app.use("/api/reports",reportRoutes)

app.get('/', (req, res) => {
  res.send("API creation is in process...");
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
