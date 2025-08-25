// server/routes/auth.js

import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { signup, login, logout } from '../controllers/authController.js';

const router = Router();

// --- Local Authentication Routes ---

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Login a user
router.post('/login', login);

// @route   POST /api/auth/logout
// @desc    Logout a user
router.post('/logout', logout);


// --- Google OAuth Authentication Routes ---

// @route   GET /api/auth/google
// @desc    Start the Google authentication flow
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // The user data we are requesting from Google
}));

// @route   GET /api/auth/google/callback
// @desc    The callback route Google redirects to after authentication
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.CLIENT_URL}/login`, // Redirect on failure
        session: false // We are using JWTs, not sessions
    }),
    (req, res) => {
        // On successful authentication, Passport attaches the user object to req.user.
        // We then create a JWT for that user.
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email }, // Payload
            process.env.JWT_SECRET,                      // Secret
            { expiresIn: '1d' }                          // Expiration
        );

        // Redirect the user back to the React frontend, passing the token in the URL.
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?authToken=${token}`);
    }
);

export default router;