import { Router, Request, Response } from 'express';
import {
  register,
  verifyOTP,
  login,
  resetPassword,
  verifyResetPasswordOTP,
} from '../controllers/authController';
import { rateLimiter } from '../middleware/auth';

const router: Router = Router();

// Rate limiting configuration
const authLimiter = rateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes
const otpLimiter = rateLimiter(5 * 60 * 1000, 3); // 3 requests per 5 minutes

// Test route
router.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Auth routes are working!' });
});

// Auth routes
router.post('/register', authLimiter, register);
router.post('/verify-otp', otpLimiter, verifyOTP);
router.post('/login', authLimiter, login);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/verify-reset-password', otpLimiter, verifyResetPasswordOTP);

export default router; 