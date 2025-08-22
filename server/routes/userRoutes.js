import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Idea from '../models/idea.model.js'; // <-- Add this line to import the Idea model
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/user/me
// @desc    Get current user's data
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // req.user is attached by the auth middleware
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/user/update
// @desc    Update user profile details
// @access  Private
router.put('/update', auth, async (req, res) => {
    const { firstName, lastName, username, email } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { firstName, lastName, username, email } },
            { new: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/user/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/user/delete
// @desc    Delete user account and all their associated ideas
// @access  Private
router.delete('/delete', auth, async (req, res) => {
    try {
        // Delete all ideas associated with this user
        await Idea.deleteMany({ userId: req.user.id });
        
        // Then, delete the user account
        await User.findByIdAndDelete(req.user.id);

        res.json({ message: 'Account and all associated ideas deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


export default router;
