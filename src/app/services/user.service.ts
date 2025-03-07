import { uploadAndGetLink, validateEmail } from '../../utils';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import * as JWTService from '../services/jwt.service';
import constants from '../../constants';
import { Types } from 'mongoose';
import { Request } from 'express';
import Quiz from '@models/quiz.model';
import ExamHistory from '@models/examHistory.model';
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
            const user = await User.findById(id).select(
                'name email phone avatar address quizAccessHistory examHistory favoriteQuiz',
            );
            if (!user) return reject('User not found');
            if (Array.isArray(user.quizAccessHistory)) {
                await user.populate('quizAccessHistory', 'name thumb slug createdAt accessCount examCount'); //populate cũng lấy dữ liệu từ database nên cũng là bất đồng bộ
                await user.populate('favoriteQuiz', 'name thumb slug createdAt accessCount examCount');
            }
            const examHistory = await ExamHistory.find({
                _id: {
                    $in: user.examHistory,
                },
            }).populate('quiz', '-_id name thumb slug');
            if (user) {
                return resolve({
                    message: 'Successfully fetched user',
                    data: Object.assign(user, { examHistory }),
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
export const favoriteQuiz = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { user, quizId } = req.body;
            if (!user.id || !quizId) return reject({ message: 'Missing data', status: 404 });
            const findUser = await User.findById(user.id);
            if (!findUser) return reject({ message: 'User not found', status: 401 });
            if (!Array.isArray(findUser.favoriteQuiz)) {
                findUser.favoriteQuiz = [];
            } else {
                if (findUser.favoriteQuiz.includes(quizId)) {
                    findUser.favoriteQuiz = findUser.favoriteQuiz.filter((id) => id != quizId);
                } else {
                    findUser.favoriteQuiz.push(quizId);
                }
            }
            findUser.save();
            return resolve({ message: 'success' });
        } catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    });
};
export const getMyFavoriteQuiz = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { user } = req.body;
            const findUser = await User.findById(user.id);
            if (!findUser) return reject({ message: 'User not found', status: 401 });
            const favoriteQuiz = await Quiz.find({ _id: { $in: findUser.favoriteQuiz } });
            resolve({ message: 'fetched successfully', data: favoriteQuiz });
        } catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    });
};
