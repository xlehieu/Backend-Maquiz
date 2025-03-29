import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendResetPasswordEmail = async (to: string, token: string) => {
    const resetLink = `${process.env.ALLOW_ORIGIN}/reset-password?token=${token}`;
    await transporter.sendMail({
        from: `"MaQuiz" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Đặt lại mật khẩu MaQuiz',
        html: `<p>Click vào link sau để đặt lại mật khẩu:</p><a href="${resetLink}">${resetLink}</a>`,
    });
};
