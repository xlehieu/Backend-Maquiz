import 'tsconfig-paths/register';
import userRouter from './user.router';
import quizRouter from './quiz.router';
import classroomRouter from './classroom.router';
import postRouter from './post.router';
import newsRouter from './news.router';
import examHistoryRouter from './examHistory.router';
import authGoogleRouter from './authGoogle.router';

import adminRouter from './admin';
import { checkIsAdmin } from '../app/middlewares/auth.middleware';
const routes = function (app: any) {
    app.use('/api/user', userRouter);
    app.use('/api/quiz', quizRouter);
    app.use('/api/classroom', classroomRouter);
    app.use('/api/post', postRouter);
    app.use('/api/news', newsRouter);
    app.use('/api/quiz-history', examHistoryRouter);
    app.use('/api/admin', checkIsAdmin, adminRouter);
    app.use('/', authGoogleRouter);
    console.log('Routes registered successfully!');
};
export default routes;
