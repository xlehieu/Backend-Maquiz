declare global {
    namespace Express {
        interface Request {
            userInfo?: any;
        }
    }
}
export {};
