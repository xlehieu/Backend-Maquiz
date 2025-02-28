import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routers';
import * as database from './db';
import cookieParser from 'cookie-parser';
import session from 'express-session';
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
database.connect();
//dung lượng tối đa mà client có thể submit lên server
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

//session là cái để mình kiểm soát được trạng thái của người dùng
app.use(
    session({
        secret: String(process.env.SESSION_SECRET),
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: true }, // 10 minutes
    }),
);
app.set('timeout', 50000);
app.use(express.json({ limit: '30mb' }));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors(),
    //     {
    //     origin: process.env.ALLOW_ORIGIN,
    //     credentials: true,
    //     methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    //     allowedHeaders: ['Content-Type', 'Authorization'],
    // }
);
routes(app);
app.use((req, res, next) => {
    console.log(`Request URL: ${req.originalUrl}`);
    next();
});

// Middleware xử lý lỗi
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
console.log(process.env.ALLOW_ORIGIN);
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
export default app;
