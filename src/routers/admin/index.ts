import { Router } from 'express';
import userManagement from './user.management.router';
import classManageRouter from './classroom.management.router';
import quizManageRouter from './quiz.management.router';
import * as VerifyAdmin from '../../app/controllers/admin/verifyAdmin.controller';

const adminRouter = Router();
adminRouter.use('/user-management', userManagement);
adminRouter.use('/quiz-management', quizManageRouter);
adminRouter.use('/classroom-management', classManageRouter);
adminRouter.get('/verify', VerifyAdmin.verify);

export default adminRouter;
