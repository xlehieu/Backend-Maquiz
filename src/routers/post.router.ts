import { authUserMiddleware } from '../app/middlewares/auth.middleware';
import 'tsconfig-paths/register';
import express from 'express';
import * as PostController from '../app/controllers/post.controller';
const postRouter = express.Router();
postRouter.post('/', authUserMiddleware, PostController.createPost);
postRouter.get('/:id/detail', authUserMiddleware, PostController.getPostsByClassroomId);
postRouter.delete('/:id', authUserMiddleware, PostController.deletePostByPostId);
export default postRouter;
