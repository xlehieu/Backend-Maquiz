import 'tsconfig-paths/register';
import { Router } from 'express';
import { authUserMiddleware } from '../app/middlewares/auth.middleware';
import * as ClassroomController from '../app/controllers/classroom.controller';
const classroomRouter = Router();

classroomRouter.post('/create', authUserMiddleware, ClassroomController.createClassroom);
classroomRouter.get('/mine', authUserMiddleware, ClassroomController.getUserClassrooms);
classroomRouter.get('/detail', authUserMiddleware, ClassroomController.getClassroomDetail);
classroomRouter.patch('/enroll', authUserMiddleware, ClassroomController.enrollInClassroom);
classroomRouter.patch('/info', authUserMiddleware, ClassroomController.updateClassroom);
export default classroomRouter;
