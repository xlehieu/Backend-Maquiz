import { Router } from 'express';
import * as QuizManageController from '../../app/controllers/admin/quiz.management.controller';
const quizManageRouter = Router();

quizManageRouter.get('/quizzes', QuizManageController.getQuizzesList);
quizManageRouter.patch('/set-disabled', QuizManageController.setDisabledQuiz);

export default quizManageRouter;
