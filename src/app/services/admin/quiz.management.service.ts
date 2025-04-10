import { Request } from 'express';
import Quiz from '../../models/quiz.model';

export const getQuizList = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { skip, limit, name } = req.query;
            const matchStage: any = {};
            if (name) {
                matchStage['nameNoAccent'] = new RegExp(String(name), 'i');
            }
            const aggregationPipeline = [];
            if (Object.keys(matchStage).length > 0) aggregationPipeline.push(matchStage);
            aggregationPipeline.push({
                $lookup: {
                    from: 'users', //từ bảng users
                    localField: 'user', // nối đến trường ref ở trong quiz
                    foreignField: '_id', // khóa ngoại _id
                    as: 'userInfo',
                },
            }); // dùng $lookup sẽ gán vào trong mỗi đối tượng quiz một thằng userInfo nhưng ở dạng mảng
            // thằng $unwind sẽ giúp biến từ mảng thành đối tượng, nếu trong user có 2 đối tượng trở lên thì nó sẽ tạo nhiều bản ghi
            // nghĩa là sẽ tạo 2 bản ghi quiz mỗi bản sẽ có thông tin người dùng khác
            aggregationPipeline.push({
                $unwind: {
                    // phải có $ trước tên field để mongo hiểu được
                    path: '$userInfo', // trường này để nó biến đổi mà ta đã đặt tên ở phía trên là userInfo ở mỗi bản ghi
                    //chắc là unwind sẽ lặp qua từng bản ghi và lấy ra thằng userInfo
                },
            });
            aggregationPipeline.push({
                $facet: {
                    metadata: [
                        {
                            $count: 'total',
                        },
                    ],
                    data: [
                        { $skip: isNaN(Number(skip)) ? 0 : Number(skip) },
                        { $limit: isNaN(Number(limit)) ? 20 : Number(limit) },
                    ],
                },
            });
            const quizzes = await Quiz.aggregate(aggregationPipeline);
            const data = Object.assign(quizzes[0].metadata[0], { quizzes: quizzes[0].data });
            resolve({ message: 'fetched successfully', data });
        } catch (error) {
            console.log(error);
            return reject({ message: 'Error', error: error });
        }
    });
};

export const setDisabledQuiz = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.params;
            console.log(id);
            if (!id) return reject({ status: 404, message: 'id is required' });
            const quiz = await Quiz.findById(id);
            if (!quiz) return reject({ status: 404, message: 'Quiz not found' });
            quiz.isDisabled = !quiz.isDisabled;
            quiz.save();
            return resolve({ message: 'successfully update quiz' });
        } catch (err) {
            return reject({ message: 'Loi', error: err });
        }
    });
};
export const getQuizDetail = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.params;
            console.log(id);
            if (!id) return reject({ status: 404, message: 'id is required' });
            const quiz = await Quiz.findById(id);
            if (!quiz) return reject({ status: 404, message: 'Quiz not found' });
            return resolve({ message: 'successfully fetch quiz', data: quiz });
        } catch (err) {
            return reject({ message: 'Loi', error: err });
        }
    });
};
