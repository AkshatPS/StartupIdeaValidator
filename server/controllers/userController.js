import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/user/me
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        // The user object is attached to the request by the auth middleware
        const user = await User.findById(req.user.id).select('-password');

        if (user) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
            });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
};

export { getUserProfile };
