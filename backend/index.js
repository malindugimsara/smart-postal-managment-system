import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './router/userRouter.js';
import authjwt from './middleware/auth.js';
import dotenv from 'dotenv';
import cors from 'cors';
import parcelRouter from './router/parcelRouter.js';

dotenv.config();
const app = express();
// Enable CORS for all routes
app.use(cors());
// Connect to MongoDB

mongoose.connect("mongodb+srv://admin:123@cluster0.vaznqp4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then
(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Middleware 
app.use(bodyParser.json());

app.use(authjwt)

app.use("/api/user", userRouter);
app.use("/api/parcel", parcelRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

