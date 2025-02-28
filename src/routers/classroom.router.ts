import 'tsconfig-paths/register';
import { Router } from 'express';
import { authUserMiddleware } from '../app/middlewares/auth.middleware';
import * as ClassroomController from '../app/controllers/classroom.controller';
const classroomRouter = Router();

classroomRouter.post('/createClassroom', authUserMiddleware, ClassroomController.createClassroom);
classroomRouter.get('/getUserClassrooms', authUserMiddleware, ClassroomController.getUserClassrooms);
classroomRouter.get('/getClassroomDetail', authUserMiddleware, ClassroomController.getClassroomDetail);
classroomRouter.patch('/enrollInClassroom', authUserMiddleware, ClassroomController.enrollInClassroom);

export default classroomRouter;
