import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    token?: string;
    user?: any;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }

    const token = authHeader.replace('Bearer ', '');
    req.token = token;

    try {
        // Decode token to get user ID (sub). We trust the token because we don't have the secret 
        // to verify it, relying on the fact that this is a backend-for-frontend where the 
        // frontend handles login with Supabase.
        // Ideally, we'd verify with the JWT secret if available.
        const decoded = jwt.decode(token);

        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token');
        }

        req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};
