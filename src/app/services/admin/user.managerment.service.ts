import { Request } from "express";
import User from "../../models/user.model";

export const getUserList = (req:Request)=>{
    return new Promise(async(resolve,reject)=>{
        try{
        const {limit,skip,name} = req.query;
        const matchStage:any = {};
        if(typeof name === "string"){
            matchStage.name = {$regex: new RegExp(name,'i')}
        }
        matchStage.isAdmin = false
        const aggregationPipeline = []
        if(Object.keys(matchStage).length>0){
            aggregationPipeline.push({$match:matchStage})
        }
        aggregationPipeline.push({
            $facet:{
                metadata:[{$count:"total"}],
                data:[
                    {$skip:isNaN(Number(skip))?0:Number(skip)},
                    {$limit:isNaN(Number(limit))?12:Number(limit)}
                ]
            }
        })
        const users = await User.aggregate(aggregationPipeline)
        
        const data = Object.assign(users[0].metadata[0],{users:users[0].data})
        if (users) {
            resolve({ message: "Successfully fetched", data: data });
        }
    }
    catch(err){
        reject({message:"Loi",error:err})
    }
    })
}
export const setActiveUser = (req:Request)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const {id} = req.params;
            if (!id) return reject({status:404,message:"id is required"})
            const user = await User.findById(id);
            if(!user) return reject({status:404,message:"Khong tim thay user"})
            user.active = !user.active
            user.save();
            return resolve({message:"successfully update user"})
        }
        catch(err){
            return reject({message:"Loi",error:err})
        }
    })
}