import { Request, Response } from 'express';
import * as UserManagementService from '../../services/admin/user.management.service';
export const getUserList = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await UserManagementService.getUserList(req);
        return res.status(200).json(response);
    } catch (err: any) {
        return res.status(err.status || 500).json(err);
    }
};

export const setActiveUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await UserManagementService.setActiveUser(req);
        return res.status(200).json(response);
    } catch (err: any) {
        return res.status(err.status || 500).json(err);
    }
};
export const getUserDetail = async (req: Request, res: Response): Promise<any> => {
    try {
        const response = await UserManagementService.getUserDetail(req);
        return res.status(200).json(response);
    } catch (err: any) {
        return res.status(err.status || 500).json(err);
    }
};
