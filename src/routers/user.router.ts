import 'tsconfig-paths/register';
import express from 'express';
import * as UserController from '../app/controllers/user.controller';
import { authMiddleware, authUserMiddleware } from '../app/middlewares/auth.middleware';

const router = express.Router();
// const upload = multer({ imageDB: multer.memoryStorage() }); // lưu ảnh tạm thời vào bộ nhớ tạm thời, sau khi up ảnh xong thì xóa (delete req.file)

router.put('/update', authUserMiddleware, UserController.updateUser);
router.post('/sign-in', UserController.loginUser);
router.post('/sign-up', UserController.registerUser);
router.post('/log-out', UserController.logoutUser);
router.post('/refresh-token', UserController.refreshToken);
router.delete('/delete/:id', authMiddleware, UserController.deleteUser);
router.get('/detail', authUserMiddleware, UserController.getUserDetail);

router.get('/', authMiddleware, UserController.getAllUser);

export default router;
