import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generalToken = (payload: any) => {
    const token = jwt.sign({ ...payload }, process.env.ACCESS_TOKEN as any, { expiresIn: '24h' });
    return token;
};
export const generalRefreshToken = (payload: any) => {
    const refresh_token = jwt.sign({ ...payload }, process.env.REFRESH_TOKEN as any, { expiresIn: '365d' });
    return refresh_token;
};
export const refreshTokenService = (token: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN as any, async (err: any, user: any) => {
                if (err) {
                    resolve({
                        status: 'ERROR',
                        message: 'Lỗi định danh',
                    });
                }
                const access_token = await generalToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin,
                });
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token,
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};
