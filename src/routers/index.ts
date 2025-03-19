import 'tsconfig-paths/register';
import userRouter from './user.router';
import quizRouter from './quiz.router';
import classroomRouter from './classroom.router';
import postRouter from './post.router';
import examHistoryRouter from './examHistory.router';
import userManagement from './admin/user.management.router';
import { verify as verify } from '../app/controllers/admin/verifyAdmin.controller';
import adminRouter from './admin';
import { checkIsAdmin } from '../app/middlewares/auth.middleware';
const routes = function (app: any) {
    app.use('/api/user', userRouter);
    app.use('/api/quiz', quizRouter);
    app.use('/api/classroom', classroomRouter);
    app.use('/api/post', postRouter);
    app.use('/api/quiz-history', examHistoryRouter);
    app.use('/api/admin/', checkIsAdmin, adminRouter);
};
export default routes;
