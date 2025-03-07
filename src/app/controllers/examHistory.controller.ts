import * as QuizHistory from '@services/examHistory.service';
import { Request, Response } from 'express';

export const saveQuizHistory = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizHistory.saveExamHistory(req);
        return res.status(200).json(response);
    } catch (err: any) {
        return res.status(err.status || 500).json(err);
    }
};

export const getMyExamHistory = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizHistory.getExamHistory(req);
        return res.status(200).json(response);
    } catch (err: any) {
        return res.status(err.status || 500).json(err);
    }
};
