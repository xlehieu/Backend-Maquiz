import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routers';
import * as database from './db/mongodb';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import corsMiddleware from './app/middlewares/cors.middleware';
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
async function connect(){
    await database.connect();
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
app.use(corsMiddleware);
routes(app);

// Middleware xử lý lỗi
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
}
connect()
export default app;
