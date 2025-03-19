import { Request, Response } from 'express';
import * as CheckAdminService from '../../services/admin/verifyAdmin.service';
export const verify = async (req: Request, res: Response): Promise<any> => {
    try {
        const isAdmin = await CheckAdminService.verify(req);
        return res.status(200).json({ isAdmin });
    } catch (err: any) {
        return res.status(err.status || 500).json();
    }
};
