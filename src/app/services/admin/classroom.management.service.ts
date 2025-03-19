import { Request, Response } from 'express';
import Classroom from '../../models/classroom.model';

export const getListClassroom = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { skip, limit, classCode } = req.query;
            const matchStage: any = {};
            if (classCode) {
                matchStage['classCode'] = new RegExp(String(classCode), 'i');
            }
            const aggregationPipeline = [];
            Object.keys(matchStage).length > 0;
            aggregationPipeline.push(matchStage);
            aggregationPipeline.push({
                $facet: {
                    metadata: {
                        $count: 'total',
                    },
                    data: [
                        { $skip: isNaN(Number(skip)) ? 0 : Number(skip) },
                        { $limit: isNaN(Number(limit)) ? 20 : Number(limit) },
                    ],
                },
            });
            const classrooms = await Classroom.aggregate(aggregationPipeline);
            const data = Object.assign(classrooms[0].metadata[0], { classrooms: classrooms[0].data });
            resolve({ message: 'fetched successfully', data });
        } catch (error) {
            return reject({ message: 'Error' });
        }
    });
};

export const setDisabledClassroom = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.params;
            if (!id) return reject({ status: 404, message: 'id is required' });
            const classroom = await Classroom.findById(id);
            if (!classroom) return reject({ status: 404, message: 'Classroom not found' });
            if (!('Disabled' in classroom)) classroom.isDisabled = false;
            classroom.isDisabled = !classroom.isDisabled;
            classroom.save();
            return resolve({ message: 'successfully update classroom' });
        } catch (err) {
            return reject({ message: 'Loi', error: err });
        }
    });
};
