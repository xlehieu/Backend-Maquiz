import { Router } from 'express';
import * as ClassManageController from '../../app/controllers/admin/classroom.manage.controller';
const classManageRouter = Router();

classManageRouter.get('/quizzes', ClassManageController.getClassesList);
classManageRouter.patch('/set-disabled', ClassManageController.setDisabledClass);

export default classManageRouter;
