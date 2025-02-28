import * as QuizService from '../services/quiz.service';
import { Request, Response } from 'express';
export const getQuizzes = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizService.getQuizzes(req);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json(err);
    }
};
export const getQuizDetail = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizService.getQuizDetail(req);
        if (response) {
            return res.status(200).json(response);
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};
export const createQuiz = async (req: Request, res: Response): Promise<any> => {
    try {
        //const contentLength = req.headers['content-length'];
        //console.log('Kích thước dữ liệu trong yêu cầu:', contentLength);
        const response = await QuizService.createQuiz(req);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json(err);
    }
};
//Lưu câu hỏi trong tạo mới quiz
export const createQuestion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id, partName, questionType, questionContent, answers } = req.body;
        if (!id || !partName || !questionType || !questionContent || !answers || answers.length === 0) {
            return res.status(400).json({
                message: 'Vui lòng kiểm tra lại thông tin câu hỏi',
            });
        }
        const response = await QuizService.createQuestion(req);
        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
//Lưu thông tin chung trong sửa quiz
export const updateQuizGeneralInfo = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizService.updateQuizGeneralInfo(req);
        return res.status(200).json(response);
    } catch (err) {
        // console.log(err);
        return res.status(500).json(err);
    }
};
//Lưu câu hỏi trong sửa quiz
export const updateQuizQuestion = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizService.updateQuizQuestion(req);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json(err);
    }
};
export const getQuizPreview = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizService.getQuizPreview(req);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json(err);
    }
};
export const getQuizForExam = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizService.getQuizForExam(req);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json(err);
    }
};
export const getDiscoveryQuizzes = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizService.getDiscoveryQuizzes(req);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json(err);
    }
};
export const deleteQuiz = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await QuizService.deleteQuiz(req);
        return res.status(200).json(response);
    } catch (err) {
        res.status(500).json(err);
    }
};
