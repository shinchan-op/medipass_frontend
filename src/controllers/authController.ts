import { Request, Response } from 'express';
import User from '../models/User';
import { generateOTP, generateOTPExpiry, isOTPExpired } from '../utils/otp';
import { sendOtpEmail, sendPasswordResetEmail } from '../services/emailService';
import { sendOtpSms, sendWelcomeSms } from '../services/smsService';
import { generateTokenPair } from '../services/tokenService';

interface RegisterRequestBody {
  fullName: string;
  mobileNumber: string;
  email?: string;
  password: string;
  pin: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  bloodGroup?: string;
  emergencyContact: string;
}

interface OTPVerificationBody {
  medipassId: string;
  otp: string;
}

interface LoginRequestBody {
  mobileNumber: string;
  password: string;
}

interface ResetPasswordBody {
  mobileNumber: string;
}

interface VerifyResetPasswordBody {
  medipassId: string;
  otp: string;
  newPassword: string;
}

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      mobileNumber,
      email,
      password,
      pin,
      dateOfBirth,
      gender,
      address,
      bloodGroup,
      emergencyContact,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { mobileNumber },
        { email: email || undefined },
      ],
    });

    if (existingUser) {
      res.status(400).json({
        message: 'User already exists with this mobile number or email',
      });
      return;
    }

    // Generate Medipass ID
    const user = new User({
      medipassId: `MED-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      fullName,
      mobileNumber,
      email,
      password,
      pin,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      bloodGroup,
      emergencyContact,
    });

    // Generate and save OTP
    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: generateOTPExpiry(5), // 5 minutes
      attempts: 0,
    };

    await user.save();

    // Send OTP via SMS and email
    await Promise.all([
      sendOtpSms(mobileNumber, otp),
      email && sendOtpEmail(email, otp),
    ]);

    res.status(201).json({
      message: 'Registration successful. Please verify your mobile number.',
      medipassId: user.medipassId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const verifyOTP = async (req: Request<{}, {}, OTPVerificationBody>, res: Response): Promise<void> => {
  try {
    const { medipassId, otp } = req.body;

    const user = await User.findOne({ medipassId });
    if (!user || !user.otp) {
      res.status(400).json({ message: 'Invalid verification request' });
      return;
    }

    if (user.otp.attempts >= 3) {
      res.status(400).json({ message: 'Too many attempts. Please request a new OTP' });
      return;
    }

    if (isOTPExpired(user.otp.expiresAt)) {
      res.status(400).json({ message: 'OTP has expired' });
      return;
    }

    if (user.otp.code !== otp) {
      user.otp.attempts += 1;
      await user.save();
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    // Mark mobile as verified and clear OTP
    user.isMobileVerified = true;
    user.otp = undefined;
    await user.save();

    // Generate tokens
    const tokens = generateTokenPair(user._id.toString());

    // Update refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      message: 'Mobile number verified successfully',
      ...tokens,
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
};

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  try {
    const { mobileNumber, password } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      res.status(401).json({
        message: 'Account is locked. Please try again later',
        lockUntil: user.lockUntil,
      });
      return;
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      await user.incrementLoginAttempts();
      
      if (user.loginAttempts >= 5) {
        res.status(401).json({
          message: 'Account locked due to too many failed attempts',
          lockUntil: user.lockUntil,
        });
        return;
      }

      res.status(401).json({
        message: 'Invalid credentials',
        attemptsRemaining: 5 - user.loginAttempts,
      });
      return;
    }

    // Generate OTP for 2FA
    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: generateOTPExpiry(5),
      attempts: 0,
    };

    // Reset login attempts on successful password verification
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Send OTP
    await sendOtpSms(user.mobileNumber, otp);
    if (user.email) {
      await sendOtpEmail(user.email, otp);
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokenPair(user._id.toString());

    res.json({
      message: 'Please verify OTP to complete login',
      medipassId: user.medipassId,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const resetPassword = async (req: Request<{}, {}, ResetPasswordBody>, res: Response): Promise<void> => {
  try {
    const { mobileNumber } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = {
      code: otp,
      expiresAt: generateOTPExpiry(5),
      attempts: 0,
    };
    await user.save();

    // Send OTP
    await sendOtpSms(user.mobileNumber, otp);
    if (user.email) {
      await sendOtpEmail(user.email, otp);
    }

    res.json({
      message: 'Password reset OTP sent',
      medipassId: user.medipassId,
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Password reset failed' });
  }
};

export const verifyResetPasswordOTP = async (req: Request<{}, {}, VerifyResetPasswordBody>, res: Response): Promise<void> => {
  try {
    const { medipassId, otp, newPassword } = req.body;

    const user = await User.findOne({ medipassId });
    if (!user || !user.otp) {
      res.status(400).json({ message: 'Invalid reset request' });
      return;
    }

    if (user.otp.attempts >= 3) {
      res.status(400).json({ message: 'Too many attempts. Please request a new OTP' });
      return;
    }

    if (isOTPExpired(user.otp.expiresAt)) {
      res.status(400).json({ message: 'OTP has expired' });
      return;
    }

    if (user.otp.code !== otp) {
      user.otp.attempts += 1;
      await user.save();
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    // Update password and clear OTP
    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset verification error:', error);
    res.status(500).json({ message: 'Password reset verification failed' });
  }
}; 