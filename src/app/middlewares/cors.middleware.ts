import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export default function corsMiddleware(req: Request, res: Response, next: NextFunction): any {
    // if (!req.headers.origin || !(req.headers.origin == process.env.ALLOW_ORIGIN))
    //     return res.status(404).json({ message: 'No origin' });
    res.setHeader('Access-Control-Allow-Origin', String(process.env.ALLOW_ORIGIN));
    res.setHeader('Vary', 'Origin'); // Giúp trình duyệt xử lý cache CORS đúng cách
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // ✅ Cho phép gửi credentials
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours in seconds
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
}
