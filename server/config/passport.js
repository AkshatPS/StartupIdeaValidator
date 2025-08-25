// server/config/passport.js

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'; // Make sure the path is correct

const configurePassport = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // 1. Check if a user already exists with this Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // User found, log them in
                return done(null, user);
            }

            // 2. If no user with Google ID, check if one exists with the same email
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // User found with email. This means they signed up locally before.
                // Let's link their Google account.
                user.googleId = profile.id;
                user.image = user.image || profile.photos[0].value; // Update image if they don't have one
                await user.save();
                return done(null, user);
            }

            // 3. If no user exists at all, create a new one
            const newUser = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
                // Password is not required for OAuth users
            });

            await newUser.save();
            done(null, newUser);

        } catch (err) {
            console.error(err);
            done(err, null);
        }
    }));
};

export default configurePassport;