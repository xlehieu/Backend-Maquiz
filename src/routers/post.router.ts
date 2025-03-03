import { authUserMiddleware } from '../app/middlewares/auth.middleware';
import 'tsconfig-paths/register';
import express from 'express';
import * as PostController from '../app/controllers/post.controller';
const postRouter = express.Router();
postRouter.post('/createPost', authUserMiddleware, PostController.createPost);
postRouter.get('/getPostByClassroomId', authUserMiddleware, PostController.getPostsByClassroomId);
export default postRouter;
