import { Request } from 'express';
import User from '../../models/user.model';

export const verify = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.userInfo;
            const user = await User.findById(id);
            if (!user) {
                return reject({ status: 403 });
            }
            return resolve(user.isAdmin);
        } catch (error) {
            return reject({ message: 'Lỗi' });
        }
    });
};
