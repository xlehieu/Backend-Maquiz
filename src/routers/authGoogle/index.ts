import { Router } from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import * as AuthGoogleController from '../../app/controllers/auth/authGoogle.controller';
dotenv.config();
const authGoogleRouter = Router();
// Route login Google
authGoogleRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
authGoogleRouter.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false }),
    AuthGoogleController.GoogleCallback,
);

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

export default authGoogleRouter;
