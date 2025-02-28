import { Request, Response } from 'express';
import * as ClassroomService from '../services/classroom.service';
export const createClassroom = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await ClassroomService.createClassroom(req);
        return res.status(201).json(response);
    } catch (err) {
        res.status(500).json(err);
    }
};
export const getUserClassrooms = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await ClassroomService.getUserClassrooms(req);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json(err);
    }
};
export const getClassroomDetail = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await ClassroomService.getClassroomDetail(req);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json(err);
    }
};
export const enrollInClassroom = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await ClassroomService.enrollInClassroom(req);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json(err);
    }
};
