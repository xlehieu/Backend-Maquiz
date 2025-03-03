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
            if (!findUser) {
                return reject({ status: 404, message: 'User không tồn tại' });
            }
            const classroom = await Classroom.findById(classroomId);
            if (!classroom) {
                return reject({ status: 404, message: 'Class không tồn tại' });
            }
            const post = await Post.create({
                classroomId,
                content,
                createdBy: findUser.id,
                quizzes: [...(quizzes ?? [])],
            });
            if (post) {
                return resolve({ message: 'successfully create post', data: post });
            }
        } catch (err) {
            console.log(err);
            return reject({ message: 'ERROR', error: err });
        }
    });
};
export const getPostsByClassroomId = async (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { classroomId } = req.body;
            if (!classroomId) {
                return reject({ status: 400, message: 'Thiếu dữ liệu' });
            }
            const posts = await Post.find({ classroomId })
                .populate('createdBy', 'name avatar')
                .populate('quizzes', 'name slug thumb subject');
            if (!posts || posts.length === 0) {
                return resolve({ message: 'No post found', data: [] });
            }
            return resolve({ message: 'Get posts successfully', data: posts });
        } catch (err) {
            return reject({ status: 500, message: 'ERROR', error: err });
        }
    });
};
