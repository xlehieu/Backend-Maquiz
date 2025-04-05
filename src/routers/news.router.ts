import { Router } from 'express';
import * as NewsController from '../app/controllers/news.controller';
import { authUserMiddleware, checkIsAdmin } from '../app/middlewares/auth.middleware';
const newsRouter = Router();
newsRouter.get('/', NewsController.getNews);
newsRouter.post('/', authUserMiddleware, NewsController.createNews);
newsRouter.put('/:id', authUserMiddleware, NewsController.updateNews);
newsRouter.delete('/:id', checkIsAdmin, NewsController.deleteNews);
export default newsRouter;
