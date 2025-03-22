import { Request, Response } from 'express';
import * as AuthGoogleService from '../../services/auth/authGooogle.service';
export const GoogleCallback = async (req: Request, res: Response): Promise<any> => {
    try {
        const response: any = await AuthGoogleService.GoogleCallback(req);
        res.redirect(`${process.env.ALLOW_ORIGIN}/login-success?access_token=Bearer ${response.access_token}`);
    } catch (err: any) {
        return res.status(err.status || 500).json({});
    }
};
