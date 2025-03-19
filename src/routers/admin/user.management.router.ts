import { Router } from 'express';
import * as UserManagementController from '../../app/controllers/admin/user.management.controller';
const userManagement = Router();
userManagement.get('/userList', UserManagementController.getUserList);
userManagement.patch('/activeUser/:id', UserManagementController.setActiveUser);
export default userManagement;
