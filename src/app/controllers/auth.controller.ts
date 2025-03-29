import { Request, Response } from 'express';
import { verifyResetToken, updatePassword } from '../services/auth.service';
import * as JWTService from './../services/jwt.service';
import User from '../models/user.model';
import { sendResetPasswordEmail } from '../services/mail/index.service';
import bcrypt from 'bcryptjs';
export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email không tồn tại' });
    const token = JWTService.generalToken({ id: user.id.toString() });
    await sendResetPasswordEmail(email, token);
    return res.json({ message: 'Đã gửi email đặt lại mật khẩu' });
};
var salt = bcrypt.genSaltSync(10);
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;
        const payload = await verifyResetToken(token);
        const hash = bcrypt.hashSync(newPassword, salt);
        await updatePassword(payload.id, hash);
        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (err) {
        res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};
