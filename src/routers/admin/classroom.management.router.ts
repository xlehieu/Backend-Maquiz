import { Router } from 'express';
import * as ClassroomManageController from '../../app/controllers/admin/classroom.management.controller';
const classManageRouter = Router();

classManageRouter.get('/classroomList', ClassroomManageController.getClassroomList);
classManageRouter.patch('/disabledClassroom/:id', ClassroomManageController.setDisabledClass);

export default classManageRouter;
