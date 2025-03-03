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
export const getPostsByClassroomId = async (req: Request, res: Response): Promise<any> => {
    try {
        const posts = await PostService.getPostsByClassroomId(req);
        return res.status(200).json(posts);
    } catch (err: any) {
        return res.status(err.status || 500).json(err);
    }
};
export const deletePostByPostId = async (req:Request, res:Response):Promise<any> => {
    try{
        const response = await PostService.deletPostByPostId(req)
        return res.status(200).json(response);
    }
    catch(err:any){
        return res.status(err?.status||500).json(err);
    }
}