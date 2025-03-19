import { Request, Response } from 'express';
import * as ClassroomManageService from '../../services/admin/classroom.management.service';

export const getClassesList = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await ClassroomManageService.getListClassroom(req);
        return res.status(200).json(response);
    } catch (error: any) {
        return res.status(error.status || 500).json(error);
    }
};
export const setDisabledClass = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await ClassroomManageService.setDisabledClassroom(req);
        return res.status(200).json(response);
    } catch (err: any) {
        return res.status(err.status || 500).json(err);
    }
};
