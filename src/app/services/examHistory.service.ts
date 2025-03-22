import ExamHistory from '../models/examHistory.model';
import User from '../models/user.model';
import { Request } from 'express';

export const saveExamHistory = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = req.userInfo;
            const { quizId, score, answerChoices } = req.body;
            if (!quizId || !score || !answerChoices || !user?.id) {
                return reject({ message: 'Thiếu dữ liệu' });
            }
            const findUser = await User.findById(user?.id);
            if (!findUser) return reject({ message: 'Lỗi xác thực', status: 401 });
            const createQuizHistoryInfo = await ExamHistory.create({
                user: user.id,
                quiz: quizId,
                score: score,
                answerChoices: answerChoices,
            });
            findUser.examHistory.push(createQuizHistoryInfo.id);
            const saveInfo = findUser.save();
            if (!createQuizHistoryInfo || !saveInfo) return reject({ message: 'Lỗi, không tạo được lịch sử làm bài' });
            resolve({ message: 'Create quiz history success' });
        } catch (err) {
            reject({ message: 'Lỗi', error: err });
        }
    });
};

export const getExamHistory = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.userInfo;
            const { skip } = req.query;
            if (!id) {
                return reject({ message: 'Thiếu dữ liệu' });
            }
            const findUser = await User.findById(id);
            if (!findUser) return reject({ message: 'Không tìm thấy người dùng', status: 401 });
            const myQuizHistory = await ExamHistory.find({ user: id })
                .limit(12)
                .skip(Number(skip) || 0);
            resolve({ message: 'Fetch success', data: myQuizHistory });
        } catch (err) {
            reject({ message: 'Lỗi', error: err });
        }
    });
};
