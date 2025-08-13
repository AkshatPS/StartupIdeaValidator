import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
    let token;

    // Check for the token in the Authorization header
    if (req.header('Authorization') && req.header('Authorization').startsWith('Bearer')) {
        try {
            // Get token from header (e.g., "Bearer <token>")
            token = req.header('Authorization').split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by the ID from the token's payload
            // and attach it to the request object, excluding the password
            req.user = await User.findById(decoded.user.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ msg: 'No user found with this token' });
            }

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ msg: 'Token is not valid' });
        }
    }

    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

export default auth;
