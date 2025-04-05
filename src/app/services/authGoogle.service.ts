import { Request } from 'express';
import User from '../models/user.model';
import * as JWTService from './jwt.service';
export const GoogleCallback = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user: any = req.user;
            if (!user) return reject({ status: 401, message: 'ERROR' });
            const email = user.emails[0].value;
            if (!email) return reject({ status: 401, message: 'ERROR' });
            const findUser = await User.findOne({ email });
            if (!findUser) {
                const newUser = new User({
                    email,
                    avatar: user.photos[0].value || '',
                    name: user.displayName,
                });
                const saveInfo = await newUser.save();
                const access_token = JWTService.generalToken({
                    id: saveInfo.id,
                    isAdmin: saveInfo.isAdmin,
                    isActive: saveInfo.isActive,
                });
                if (saveInfo) {
                    return resolve({ message: 'OK', access_token });
                }
                return reject({ message: 'ERROR' });
            }
            const access_token = JWTService.generalToken({
                id: findUser.id,
                isAdmin: findUser.isAdmin,
                isActive: findUser.isActive,
            });
            return resolve({ message: 'OK', access_token });
        } catch (err) {
            return reject({ message: 'ERROR', error: err });
        }
    });
};
