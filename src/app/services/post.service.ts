import Classroom from '../models/classroom.model';
import Post from '../models/post.model';
import User from '../models/user.model';
import { Request } from 'express';

export const createPost = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = req.user
            const { classroomId, content, quizzes } = req.body;
            if (!classroomId || !content || !user?.id) {
                return reject({ status: 400, message: 'Thiếu dữ liệu' });
            }
            const findUser = await User.findById(user.id);
            if (!findUser) {
                return reject({ status: 401, message: 'User không tồn tại' });
            }
            const classroom = await Classroom.findById(classroomId);
            if (!classroom) {
                return reject({ status: 400, message: 'Class không tồn tại' });
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
            const { classroomId } = req.params;
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
export const deletePostByPostId = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.params;
            const user= req.user
            const post = await Post.findById(id);
            if (!(post?.createdBy == user.id)) {
                return reject({ status: 400, message: 'unsuccessfully deleted' });
            }
            const postDeleteInfo: any = await Post.deleteById(id);
            console.log('postDeleteInfo', postDeleteInfo);
            if (postDeleteInfo.matchedCount > 0) {
                return resolve({ message: 'successfully deleted' });
            }
            return reject({ message: 'unsuccessfully deleted' });
        } catch (err) {
            console.log(err);
            return reject({ status: 500, message: 'ERROR', error: err });
        }
    });
};
