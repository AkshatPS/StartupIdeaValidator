import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport'; // 1. Import Passport
import 'dotenv/config';

// Import your custom Passport configuration
import configurePassport from './config/passport.js'; // 2. Import your Passport config

// Import your routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import ideaRoutes from './routes/idea.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Passport Middleware Initialization ---
app.use(passport.initialize()); // 3. Initialize Passport
configurePassport(passport);      // 4. Apply your Google strategy configuration

// MongoDB Connection
const uri = process.env.ATLAS_URI;

mongoose.connect(uri)
  .then(() => console.log("MongoDB database connection established successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ideas', ideaRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});