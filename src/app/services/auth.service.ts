import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import dotenv from 'dotenv';
dotenv.config();
export const verifyResetToken = async (token: string): Promise<any> => {
    return jwt.verify(token, process.env.ACCESS_TOKEN as string, function (err: any, userInfo: any) {
        if (err) {
            return {
                status: 500,
                message: 'Lỗi verify',
                err,
            };
        }
        const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại tính theo giây
        if (userInfo.exp && userInfo.exp < currentTime) {
            return {
                status: 401,
                message: 'Token expired',
            };
        }
        if (userInfo && 'id' in userInfo) {
            if (!userInfo?.id) {
                return {
                    status: 400,
                    message: 'Authentication error',
                };
            }
        }
        if (userInfo.isActive === false)
            return {
                status: 403,
                message: 'Tài khoản bạn đã bị chặn',
            };
        return userInfo;
    });
};

export const updatePassword = async (userId: string, newPassword: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        user.password = newPassword; // nhớ hash password
        await user.save();
    } catch (err) {
        throw new Error('Update password failed');
    }
};
