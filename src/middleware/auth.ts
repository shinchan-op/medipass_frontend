import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/tokenService';
import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    if (!payload) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    // Attach user info to request
    req.user = payload as any;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    next();
  };
};

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

export const rateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  maxRequests: number = 100 // limit each IP to 100 requests per windowMs
) => {
  const requests = new Map<string, RateLimitInfo>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const requestData = requests.get(ip);

    if (!requestData || now > requestData.resetTime) {
      requests.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      next();
      return;
    }

    if (requestData.count >= maxRequests) {
      res.status(429).json({
        message: 'Too many requests, please try again later',
        resetTime: new Date(requestData.resetTime),
      });
      return;
    }

    requestData.count++;
    next();
  };
}; 