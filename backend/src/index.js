import cloudinary from 'cloudinary'
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); 

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';  // Import express-session
import userRouter from './routes/user.router.js';

const app = express();

// Enable CORS
app.use(cors());

// Set up session management
app.use(session({
  secret: 'your-secret-key',  // A secret key to sign the session ID cookie
  resave: false,              // Don't save session if unmodified
  saveUninitialized: false,   // Don't save empty sessions
  cookie: { secure: false }   // Set 'secure: true' if you're using HTTPS
}));

// Parse incoming JSON requests
app.use(express.json());

// MongoDB connection
const connection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/hospital-management");
    console.log("mongodb is connected...");
  } catch (err) {
    console.log(err, "error while connecting to the database");
  }
};
connection();

// Use user routes
app.use("/api/users", userRouter);
app.listen(8000, () => {
  console.log("server started at 8000");
});
