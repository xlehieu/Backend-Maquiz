import { Request, Response } from 'express';
import * as NewsService from '../services/news.service';
export const createNews = async (req: Request, res: Response): Promise<any> => {
    try {
        const news = await NewsService.createNews(req);
        return res.status(200).json(news);
    } catch (err: any) {
        return res.status(err.status).json(err);
    }
};
export const getNews = async (req: Request, res: Response): Promise<any> => {
    try {
        const news = await NewsService.getNews();
        return res.status(200).json(news);
    } catch (err: any) {
        return res.status(err.status).json(err);
    }
};
export const updateNews = async (req: Request, res: Response): Promise<any> => {
    try {
        const news = await NewsService.updateNews(req);
        return res.status(200).json(news);
    } catch (err: any) {
        return res.status(err.status).json(err);
    }
};
export const deleteNews = async (req: Request, res: Response): Promise<any> => {
    try {
        const news = await NewsService.deleteNews(req);
        return res.status(200).json(news);
    } catch (err: any) {
        return res.status(err.status).json(err);
    }
};
