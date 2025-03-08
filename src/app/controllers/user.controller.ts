import * as userService from '../services/user.service';
import * as JWTService from '../services/jwt.service';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
export const getAllUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await userService.getAllUser();
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
};
export const getUserDetail = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await userService.getUserDetail(req);
        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 'ERROR',
            message: err,
        });
    }
};
export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.cookies?.refresh_token;
        if (!token) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'Token bị lỗi',
            });
        }
        const response = await JWTService.refreshTokenService(token);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            status: 'ERROR',
            message: err,
        });
    }
};
export const registerUser = async (req: any, res: Response): Promise<any> => {
    try {
        const response: any = await userService.registerUser(req);
        res.cookie('user_email', response.email, {
            httpOnly: false, // có thể truy cập cookie từ JavaScript (bảo mật)
            maxAge: 1000 * 60 * 60 * 24, // Cookie hết hạn sau 1 ngày
            sameSite: 'strict', // Ngăn chặn các cuộc tấn công CSRF
            secure: true, // bật khi deploy
        });
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json(err);
    }
};
export const loginUser = async (req: any, res: Response): Promise<any> => {
    try {
        const response: any = await userService.loginUser(req);
        //req.session.access_token = response.access_token;
        res.cookie('access_token', response.access_token, {
            httpOnly: true, // Không cho JavaScript truy cập, chống XSS
            secure: true, // Bật khi deploy trên HTTPS
            sameSite: 'none', // Ngăn chặn CSRF
            maxAge: 1000 * 60 * 60 * 24, // Hết hạn sau 15 phút (hoặc tùy vào token)
        });
        res.cookie('user_email', response.email, {
            httpOnly: false, // có thể truy cập cookie từ JavaScript (bảo mật)
            secure: true,
            maxAge: 1000 * 60 * 60 * 24, // Cookie hết hạn sau 1 ngày
            sameSite: 'none', // Ngăn chặn các cuộc tấn công CSRF
        });
        return res.status(200).json({ message: 'Đăng nhập thành công' });
    } catch (err) {
        console.log(err);
        return res.status(401).json(err);
    }
};
export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await userService.updateUser(req);
        return res.status(200).json(response);
    } catch (err: any) {
        console.log(err);
        return res.status(err.status || 500).json(err);
    }
};
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = new Types.ObjectId(req.params.id);
        if (!id) {
            return res.status(200).json({
                status: 'OK',
                message: 'Xin lỗi quý khách, chúng tôi đang bị lỗi',
            });
        }
        const response = await userService.deleteUser(id);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json(err);
    }
};
export const logoutUser = async (req: Request, res: Response): Promise<any> => {
    try {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        res.clearCookie('user_email', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
            
        // Xóa session
        // req.session.destroy((err) => {
        //     if (err) {
        //         return res.status(500).json({ status: 'error', message: 'Failed to logout' });
        //     }
        //     res.clearCookie('connect.sid'); // Thay 'connect.sid' bằng tên cookie bạn sử dụng
        //     // Xóa cookie liên quan nếu có

        // });
        return res.status(200).json({ status: 'OK', message: 'Log out success' });
    } catch (err) {
        return res.status(500).json(err);
    }
};
export const favoriteQuiz = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await userService.favoriteQuiz(req);
        return res.status(200).json(response);
    } catch (err: any) {
        return res.status(err.status || 500).json(err);
    }
};
export const getMyFavoriteQuiz = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await userService.getMyFavoriteQuiz(req);
        return res.status(200).json(response);
    } catch (err: any) {
        return res.status(err.status || 500).json(err);
    }
};
