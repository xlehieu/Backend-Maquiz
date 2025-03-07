import { Router } from 'express';
import { authUserMiddleware } from '@middlewares/auth.middleware';
import * as ExamHistoryController from '@controllers/examHistory.controller';

const examHistoryRouter = Router();
examHistoryRouter.post('/', authUserMiddleware, ExamHistoryController.saveQuizHistory);
examHistoryRouter.get('/mine', authUserMiddleware, ExamHistoryController.getMyExamHistory);
export default examHistoryRouter;
