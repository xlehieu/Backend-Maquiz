import 'tsconfig-paths/register';
import userRouter from './user.router';
import quizRouter from './quiz.router';
import classroomRouter from './classroom.router';
import postRouter from './post.router';
import examHistoryRouter from './examHistory.router';
import * as UserService from '../app/services/user.service';
import { Request, Response } from 'express';
const routes = function (app: any) {
    app.get('/api/hello-hieu-mao', async (req: Request, res: Response) => {
        const response = await UserService.getAllUser();
        res.json({ message: 'Successfully fetched', data: response });
    });
    app.use('/api/user', userRouter);
    app.use('/api/quiz', quizRouter);
    app.use('/api/classroom', classroomRouter);
    app.use('/api/post', postRouter);
    app.use('/api/quiz-history', examHistoryRouter);
    app.get('/api', (req: Request, res: Response) => {
        res.json({ message: 'Hello nhe' });
    });
};
export default routes;
