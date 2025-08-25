// models/User.js

import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    // --- Fields for Google OAuth ---
    googleId: {
        type: String,
        unique: true,
        sparse: true // Creates a unique index, but allows multiple documents to have a null value
    },
    displayName: { // To store the full name from Google, which is more reliable
        type: String,
        required: true,
    },
    image: { // To store the profile picture URL from Google
        type: String,
    },
    
    // --- Core Fields (Modified for Flexibility) ---
    email: {
        type: String,
        required: true,
        unique: true, // Email must be unique across all users
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false // *** CRITICAL CHANGE: Password is no longer required ***
    },
    
    // --- Original Fields (Now Optional) ---
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        sparse: true // Same logic as googleId for uniqueness
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const User = mongoose.model('User', userSchema);

export default User;