import { Router } from 'express';
import passport from 'passport';
import '../../auth/googleAuth';
import dotenv from 'dotenv';
dotenv.config();
import * as JWTService from '../../app/services/jwt.service';
const authGoogleRouter = Router();

// Route login Google
authGoogleRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
authGoogleRouter.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const user = req.user as any;
    const token = JWTService.generalToken({ id: user.id, displayName: user.displayName, email: user.emails[0].value });
    res.redirect(`${process.env.ALLOW_ORIGIN}/login-success?token=${token}`);
});

// Check login
authGoogleRouter.get('/auth/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// Logout
authGoogleRouter.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.redirect('http://localhost:3000');
    });
});
