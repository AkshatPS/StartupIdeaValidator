import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config'; // The ESM way to load environment variables

// Import your routes (remember the .js extension for ESM)
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// MongoDB Connection
const uri = process.env.ATLAS_URI; // Your connection string from Atlas

// Mongoose connection logic is updated for better practices
mongoose.connect(uri)
  .then(() => console.log("MongoDB database connection established successfully"))
  .catch(err => console.error("MongoDB connection error:", err));


// Routes
app.use('/api/auth', authRoutes); // All auth routes will be prefixed with /api/auth
app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
