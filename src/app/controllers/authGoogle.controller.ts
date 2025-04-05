import { Request, Response } from 'express';
import * as AuthGoogleService from '../services/authGoogle.service';
export const GoogleCallback = async (req: Request, res: Response): Promise<any> => {
    try {
        const response: any = await AuthGoogleService.GoogleCallback(req);
        res.cookie('access_token', `Bearer ${response.access_token}`, {
            httpOnly: true, // Chặn truy cập từ JavaScript
            secure: true, // Chỉ gửi qua HTTPS
            sameSite: 'none', // Để cookie có thể gửi giữa các subdomain khác nhau
            maxAge: 1000 * 60 * 60 * 24, // 1 ngày
        });
        res.redirect(`${process.env.ALLOW_ORIGIN}/login-success`);
    } catch (err: any) {
        return res.status(err.status || 500).json({});
    }
};
