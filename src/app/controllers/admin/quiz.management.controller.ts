import { Request, Response } from 'express';
import * as QuizManageService from '../../services/admin/quiz.management.service';
export const getQuizzesList = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizManageService.getListQuizzes(req);
        return res.status(200).json(response);
    } catch (err: any) {
        return res.status(err.status || 500).json(err);
    }
};

export const setDisabledQuiz = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizManageService.setDisabledQuiz(req);
        return res.status(200).json(response);
    } catch (err: any) {
        return res.status(err.status || 500).json(err);
    }
};
