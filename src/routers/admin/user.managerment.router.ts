import { Router } from "express";
import * as AuthMiddleware from '../../app/middlewares/auth.middleware'
import * as UserManagermentController from '../../app/controllers/admin/user.managerment.controller'
const userManagerment = Router();
userManagerment.get('/userList',AuthMiddleware.checkIsAdmin,UserManagermentController.getUserList);
userManagerment.patch('/activeUser/:id',AuthMiddleware.checkIsAdmin,UserManagermentController.setActiveUser);
export default userManagerment