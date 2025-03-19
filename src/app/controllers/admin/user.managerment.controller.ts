import { Request, Response } from "express";
import * as UserManagermentService from '../../services/admin/user.managerment.service'
export const getUserList = async (req:Request,res:Response):Promise<any>=>{
    try{
        const response = await UserManagermentService.getUserList(req);
        return res.status(200).json(response)
    }
    catch(err:any){
        return res.status(err.status || 500).json(err)
    }
}

export const setActiveUser = async (req:Request,res:Response):Promise<any>=>{
    try{
        const response = await UserManagermentService.setActiveUser(req);
        return res.status(200).json(response)
    }
    catch(err:any){
        return res.status(err.status || 500).json(err)
    }
}