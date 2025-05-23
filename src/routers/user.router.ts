import 'tsconfig-paths/register';
import express from 'express';
import * as UserController from '../app/controllers/user.controller';
import { checkIsAdmin, authUserMiddleware } from '../app/middlewares/auth.middleware';
import { forgotPassword, resetPassword } from '../app/controllers/auth.controller';
const router = express.Router();
// const upload = multer({ imageDB: multer.memoryStorage() }); // lưu ảnh tạm thời vào bộ nhớ tạm thời, sau khi up ảnh xong thì xóa (delete req.file)

router.patch('/update', authUserMiddleware, UserController.updateUser);
router.post('/sign-in', UserController.loginUser);
router.post('/sign-up', UserController.registerUser);
router.post('/log-out', UserController.logoutUser);
router.post('/refresh-token', UserController.refreshToken);
router.delete('/delete/:id', checkIsAdmin, UserController.deleteUser);
router.get('/detail', authUserMiddleware, UserController.getUserDetail);
router.patch('/favorite-quiz', authUserMiddleware, UserController.favoriteQuiz);
router.get('/favorite-quiz', authUserMiddleware, UserController.getMyFavoriteQuiz);
router.get('/', checkIsAdmin, UserController.getAllUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
export default router;
