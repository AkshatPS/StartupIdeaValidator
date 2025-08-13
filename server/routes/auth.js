import { Router } from 'express';
import { signup, login, logout } from '../controllers/authController.js'; // Remember the .js extension

const router = Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

export default router;
