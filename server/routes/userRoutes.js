import { Router } from 'express';
import { getUserProfile } from '../controllers/userController.js';
import auth from '../middleware/auth.js'; // Import the auth middleware

const router = Router();

// This route is protected. The 'auth' middleware will run first.
// If the token is valid, it will proceed to 'getUserProfile'.
router.get('/me', auth, getUserProfile);

export default router;
