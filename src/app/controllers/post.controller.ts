import { Request, Response } from 'express';
import * as PostService from '../services/post.service';
export const createPost = async (req: Request, res: Response): Promise<any> => {
    try {
        const post = await PostService.createPost(req);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json(err);
    }
};
