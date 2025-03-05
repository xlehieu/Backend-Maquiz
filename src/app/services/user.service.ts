import { uploadAndGetLink, validateEmail } from '../../utils';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import * as JWTService from '../services/jwt.service';
import constants from '../../constants';
import { Types } from 'mongoose';
import { Request } from 'express';
interface IUserInfo {
    email: string;
    password: string;
}
interface INewUser extends IUserInfo {
    phone: string;
}
var salt = bcrypt.genSaltSync(10);
export const registerUser = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(req.body);
            const { email, password, confirmPassword, phone } = req.body;
            if (!email || !password || !confirmPassword || !phone) {
                return reject({
                    status: 'OK',
                    message: 'Thiếu dữ liệu',
                });
            }
            if (!validateEmail(email)) {
                return reject({
                    status: 'OK',
                    message: 'Email không đúng định dạng',
                });
            }
            if (password !== confirmPassword) {
                return reject({
                    status: 'OK',
                    message: 'Mật khẩu không giống nhau',
                });
            }
            const checkEmailUser = await User.findOne({
                email: email,
            });
            if (checkEmailUser) {
                return reject({
                    status: 'Error',
                    message: 'Email đã tồn tại',
                });
            }
            const hash = bcrypt.hashSync(password, salt);
            const user = await User.create({
                email,
                password: hash,
                phone,
            });
            if (user) {
                return resolve({
                    status: 'OK',
                });
            }
        } catch (err) {
            console.log(err);
            return reject(err);
        }
    });
};
export const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find();
            resolve(allUser);
        } catch (err) {
            reject(err);
        }
    });
};
export const getUserDetail = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.body.user;
            const user = await User.findById(id).select('name email phone avatar address quizAccessHis');
            if (!user) return reject('User not found');
            if (Array.isArray(user.quizAccessHis)) {
                await user.populate('quizAccessHis', 'name thumb slug createdAt accessCount examCount'); //populate cũng lấy dữ liệu từ database nên cũng là bất đồng bộ
            }
            console.log(user);
            if (user) {
                return resolve({
                    message: 'Successfully fetched user',
                    data: user,
                });
            }
            return reject({
                status: 'Failure fetched user',
                message: 'Xin lỗi! Không tìm thấy dữ liệu người dùng',
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
export const loginUser = (req: Request): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return reject({ message: 'Thiếu dữ liệu' });
            const userCheck = await User.findOne({
                email: email,
            });
            if (!userCheck) {
                return reject({
                    message: 'Email hoặc mật khẩu không chính xác',
                });
            }
            const checkPassword = await bcrypt.compare(password, userCheck!.password);
            if (!checkPassword) {
                return reject({
                    message: 'Email hoặc mật khẩu không chính xác',
                });
            }
            const access_token = JWTService.generalToken({
                id: userCheck!.id,
                isAdmin: userCheck!.isAdmin,
            });
            return resolve({
                email: userCheck?.email,
                message: 'Đăng nhập thành công',
                access_token: `Bearer ${access_token}`,
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
export const updateUser = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { avatar, address, phone, name, email } = req.body;
            if (!avatar || !address || !phone || !name || !email)
                return reject({ status: 404, message: 'Thiếu dữ liệu' });
            const { id } = req.body.user;
            if (!validateEmail(email)) {
                reject({
                    status: 401,
                    message: 'Email không hợp lệ',
                });
            }
            console.log('hello');
            const checkIdUser = await User.findById(id);
            if (!checkIdUser) {
                return reject({
                    status: 401,
                    message: 'Không có dữ liệu người dùng',
                });
            }
            console.log('Hello');
            const avatarURL = await uploadAndGetLink(avatar, constants.uploadAvatars);
            if (!avatarURL) {
                return reject({ status: 404, message: 'Lỗi sửa hình ảnh' });
            }
            console.log(avatar);
            const updateInfo = {
                name,
                address,
                phone,
                avatar: avatarURL ?? checkIdUser?.avatar,
            };
            await User.findByIdAndUpdate(id, updateInfo);
            resolve({
                message: 'Đổi thông tin thành công',
            });
        } catch (err) {
            reject(err);
        }
    });
};
export const deleteUser = (id: Types.ObjectId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkId = await User.findById(id);
            if (checkId) {
                const response = await User.delete({ _id: id });
                if (response) console.log(response);
                resolve({
                    message: 'Delete successfully',
                });
                reject({
                    message: 'Delete unsuccessfully',
                });
            } else {
                reject({
                    message: 'Lỗi! Không tìm thấy người dùng',
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};
