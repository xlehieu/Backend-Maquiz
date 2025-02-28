import Classroom from '../models/classroom.model';
import Post from '../models/post.model';
import User from '../models/user.model';
import { Request } from 'express';

export const createPost = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { classroomId, content, quizzes, user } = req.body;
            if (!classroomId || !content || !user?.id) {
                return reject({ status: 400, message: 'Thiếu dữ liệu' });
            }
            const findUser = await User.findById(user.id);
            const classroom = await Classroom.findById(classroomId);
            const post = await Post.create({
                classroomId,
            });
        } catch (err) {
            return reject({ message: 'ERROR', error: err });
        }
    });
};
