import { Router } from 'express';
import * as QuizManageController from '../../app/controllers/admin/quiz.management.controller';
const quizManageRouter = Router();

quizManageRouter.get('/quizList', QuizManageController.getQuizList);
quizManageRouter.patch('/disabledQuiz/:id', QuizManageController.setDisabledQuiz);

export default quizManageRouter;
