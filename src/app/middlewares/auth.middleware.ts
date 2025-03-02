import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Response } from 'express';
import cookieParser from 'cookie-parser';

interface IUser {}
dotenv.config();
//dùng để check admin
export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    if (!req.session.access_token) return;
    const token = req.session.access_token?.split(' ')[1];
    //hàm verify này nhận dối số thứ 2 là khóa để giải mã
    // ở hàm general token bên jwtservice cũng là khóa process.env.access_token nên nó giải mã được
    jwt.verify(token, process.env.ACCESS_TOKEN as any, function (err: any, user: any) {
        if (err) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
        if (!user.isAdmin) {
            return res.status(403).json({
                status: 'ERROR',
                message: 'Authentication error',
            });
        }
        console.log(user);
        next();
    });
};
//dùng để check người dùng
export const authUserMiddleware = (req: any, res: Response, next: NextFunction): any => {
    let cookies: any = req.cookies.access_token; //ở index.ts đã dùng app.use(cookieParser) nên ở d
    //if (!req.session.access_token) return res.status(401).json(); //.json({ status: 'ERR', message: 'Bạn cần đăng nhập' });
    cookies = cookies?.split(' ')[1];
    //hàm verify này nhận dối số thứ 2 là khóa để giải mã
    // ở hàm general token bên jwtservice cũng là khóa process.env.access_token nên nó giải mã được
    if (!process.env.ACCESS_TOKEN) {
        return res.status(500); //.json({ status: 'ERR', message: 'Lỗi' });
    }
    jwt.verify(cookies, process.env.ACCESS_TOKEN, function (err: any, user: any) {
        if (err) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
        const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại tính theo giây
        if (user.exp && user.exp < currentTime) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'Token expired',
            });
        }
        if (user && 'id' in user) {
            if (!user?.id) {
                return res.status(401).json({
                    status: 'ERROR',
                    message: 'Authentication error',
                });
            }
        }
        req.body.user = user;
        next();
    });
};
export const frontEndAppAuthenticateMiddleware = (req: any, res: Response, next: NextFunction): any => {
    if (!req.session.access_token) return res.json(); //.json({ status: 'ERR', message: 'Bạn cần đăng nhập' });
    const token = req.session.access_token?.split(' ')[1];
    //hàm verify này nhận dối số thứ 2 là khóa để giải mã
    // ở hàm general token bên jwtservice cũng là khóa process.env.access_token nên nó giải mã được
    if (!process.env.ACCESS_TOKEN) {
        return res.status(500); //.json({ status: 'ERR', message: 'Lỗi' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err: any, user: any) {
        if (err) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
        const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại tính theo giây
        if (user.exp && user.exp < currentTime) {
            return res.status(401).json({
                status: 'ERROR',
                message: 'Token expired',
            });
        }
        if (user && 'id' in user) {
            if (!user?.id) {
                return res.status(401).json({
                    status: 'ERROR',
                    message: 'Authentication error',
                });
            }
        }
        req.body.user = user;
        next();
    });
};
