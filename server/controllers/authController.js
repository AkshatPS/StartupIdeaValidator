import User from '../models/User.js'; // Use import and add .js extension for Node ESM
import bcrypt from 'bcryptjs'; // Use import for packages
import jwt from 'jsonwebtoken';

// Use the export keyword directly on the function declaration
export const signup = async (req, res) => {
    // Destructure all fields from the request body
    const { firstName, lastName, username, email, password } = req.body;

    try {
        // 1. Check if user already exists by email or username
        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        let userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ msg: 'Username is already taken' });
        }

        // 2. Create a new user instance with all fields
        let user = new User({
            firstName,
            lastName,
            username,
            email,
            password
        });

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save the user to the database
        await user.save();

        // 5. Send a success response (in the future, you'll send a JWT)
        res.status(201).json({ msg: 'User registered successfully! Please log in.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 3. Create and sign a JWT
        const payload = { id: user._id, email: user.email };

        // Sign the token and send it back to the client
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { /* user details if you want */ } }); // CRITICAL: Send the token

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const logout = (req, res) => {
    // For stateless JWT, the server doesn't need to do anything.
    // The client is responsible for destroying the token.
    // This endpoint is here for good practice and to give the client a target to hit.
    res.status(200).json({ msg: 'Logged out successfully' });
};
