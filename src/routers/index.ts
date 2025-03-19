import 'tsconfig-paths/register';
import userRouter from './user.router';
import quizRouter from './quiz.router';
import classroomRouter from './classroom.router';
import postRouter from './post.router';
import examHistoryRouter from './examHistory.router';
import userManagerment from './admin/user.managerment.router';
import { Request, Response } from 'express';
const routes = function (app: any) {
    app.use('/api/user', userRouter);
    app.use('/api/quiz', quizRouter);
    app.use('/api/classroom', classroomRouter);
    app.use('/api/post', postRouter);
    app.use('/api/quiz-history', examHistoryRouter);
    app.use('/api/user-managerment',userManagerment)
    app.get('/api', (req: Request, res: Response) => {
        res.json({ message: 'Hello nhe' });
    });
};
export default routes;
