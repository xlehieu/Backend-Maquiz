import 'tsconfig-paths/register';
import express from 'express';
import * as QuizController from '../app/controllers/quiz.controller';
import { authUserMiddleware, checkToken } from '../app/middlewares/auth.middleware';
const quizRouter = express.Router();
// Authentication required
quizRouter.get('/mine', authUserMiddleware, QuizController.getQuizzes);
quizRouter.post('/create', authUserMiddleware, QuizController.createQuiz);
quizRouter.get('/detail', authUserMiddleware, QuizController.getQuizDetail);

quizRouter.put('/createQuestion', authUserMiddleware, QuizController.createQuestion);
quizRouter.put('/updateGeneralInfo', authUserMiddleware, QuizController.updateQuizGeneralInfo);
quizRouter.put('/updateQuestion', authUserMiddleware, QuizController.updateQuizQuestion);
quizRouter.delete('/:id/deleteQuiz', authUserMiddleware, QuizController.deleteQuiz);
quizRouter.get('/forExam/:slug', authUserMiddleware, QuizController.getQuizForExam);
// No authentication required
quizRouter.get('/preview/:slug', checkToken, QuizController.getQuizPreview);
quizRouter.get('/discovery', QuizController.getDiscoveryQuizzes);
export default quizRouter;
