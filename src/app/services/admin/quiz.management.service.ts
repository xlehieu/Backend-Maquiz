import { Request } from 'express';
import Quiz from '../../models/quiz.model';

export const getListQuizzes = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { skip, limit, name } = req.query;
            const matchStage: any = {};
            if (name) {
                matchStage['nameNoAccent'] = new RegExp(String(name), 'i');
            }
            const aggregationPipeline = [];
            Object.keys(matchStage).length > 0;
            aggregationPipeline.push(matchStage);
            aggregationPipeline.push({
                $facet: {
                    metadata: {
                        $count: 'total',
                    },
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
            return reject({ message: 'Error', error: error });
        }
    });
};

export const setDisabledQuiz = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.params;
            if (!id) return reject({ status: 404, message: 'id is required' });
            const quiz = await Quiz.findById(id);
            if (!quiz) return reject({ status: 404, message: 'Quiz not found' });
            if (!('Disabled' in quiz)) quiz.isDisabled = false;
            quiz.isDisabled = !quiz.isDisabled;
            quiz.save();
            return resolve({ message: 'successfully update quiz' });
        } catch (err) {
            return reject({ message: 'Loi', error: err });
        }
    });
};
