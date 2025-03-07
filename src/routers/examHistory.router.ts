import { Router } from 'express';
import { authUserMiddleware } from '../app/middlewares/auth.middleware';
import * as ExamHistoryController from '../app/controllers/examHistory.controller';

const examHistoryRouter = Router();
examHistoryRouter.post('/', authUserMiddleware, ExamHistoryController.saveQuizHistory);
examHistoryRouter.get('/mine', authUserMiddleware, ExamHistoryController.getMyExamHistory);
export default examHistoryRouter;
