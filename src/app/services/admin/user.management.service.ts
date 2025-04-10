import { Request } from 'express';
import User from '../../models/user.model';
import ExamHistory from '../../models/examHistory.model';

export const getUserList = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { limit, skip, name } = req.query;
            const matchStage: any = {};
            if (typeof name === 'string') {
                matchStage.name = { $regex: new RegExp(name, 'i') };
            }
            matchStage.isAdmin = false;
            const aggregationPipeline = [];
            if (Object.keys(matchStage).length > 0) {
                aggregationPipeline.push({ $match: matchStage });
            }
            aggregationPipeline.push({
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [
                        { $skip: isNaN(Number(skip)) ? 0 : Number(skip) },
                        { $limit: isNaN(Number(limit)) ? 20 : Number(limit) },
                    ],
                },
            });
            const users = await User.aggregate(aggregationPipeline);
            const data = Object.assign(users[0].metadata[0], { users: users[0].data });
            if (users) {
                resolve({ message: 'Successfully fetched', data: data });
            }
            reject({ message: 'User not found' });
        } catch (err) {
            reject({ message: 'Loi', error: err });
        }
    });
};
export const setActiveUser = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.params;
            if (!id) return reject({ status: 404, message: 'id is required' });
            const user = await User.findById(id);
            if (!user) return reject({ status: 404, message: 'Khong tim thay user' });
            user.isActive = !user.isActive;
            user.save();
            return resolve({ message: 'successfully update user' });
        } catch (err) {
            return reject({ message: 'Loi', error: err });
        }
    });
};
export const getUserDetail = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const id = req.params.id;
            if (!id) return reject({ status: 404, message: 'id is required' });
            const findUser = await User.findById(id).select(
                'name email phone avatar address quizAccessHistory examHistory favoriteQuiz',
            );
            if (!findUser) return reject('User not found');
            const countQuizAccessHistory = findUser?.quizAccessHistory?.length;
            const countFavoriteQuiz = findUser?.favoriteQuiz?.length;
            if (Array.isArray(findUser.quizAccessHistory) && Array.isArray(findUser.favoriteQuiz)) {
                if (findUser.quizAccessHistory.length > 12) {
                    findUser.quizAccessHistory = findUser.quizAccessHistory.slice(0, 12);
                }
                if (findUser.favoriteQuiz.length > 12) {
                    findUser.favoriteQuiz = findUser.favoriteQuiz.slice(0, 12);
                }
                await findUser.populate(
                    'quizAccessHistory',
                    'name thumb slug createdAt accessCount examCount questionCount',
                ); //populate cũng lấy dữ liệu từ database nên cũng là bất đồng bộ
                await findUser.populate(
                    'favoriteQuiz',
                    'name thumb slug createdAt accessCount examCount questionCount',
                );
            }
            const examHistory = await ExamHistory.find({ user: id }).populate({
                path: 'quiz',
                select: 'name thumb slug createdAt accessCount examCount',
            });
            const validExamHistory = examHistory.filter((exam) => exam.quiz !== null);
            if (findUser) {
                return resolve({
                    message: 'Successfully fetched user',
                    data: Object.assign(
                        findUser,
                        { countQuizAccessHistory, countFavoriteQuiz },
                        { examHistory: validExamHistory },
                    ),
                });
            }
            return reject({
                status: 'Failure fetched user',
                message: 'Xin lỗi! Không tìm thấy dữ liệu người dùng',
            });
        } catch (err) {
            console.log('Loi ne: ', err);
            reject(err);
        }
    });
};
