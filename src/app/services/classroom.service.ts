import { Request } from 'express';
import Classroom from '../models/classroom.model';
import mongoose, { Types } from 'mongoose';
import User from '../models/user.model';
import { generateUniqueRandomString } from '../../utils';
import { imageClassThumbnailDefault } from '../../constants';
import Post from '../models/post.model';
export const getUserClassrooms = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user  = req.user;
            const findUser = await User.findById(user.id);
            if (!findUser) return reject({ message: 'Không tìm thấy người dùng' });
            const teacherId = user?.id && Types.ObjectId.isValid(user.id) ? user.id : new Types.ObjectId(user.id);
            const myClassrooms = await Classroom.find({ teacher: teacherId })
                .select(['name', 'classCode', 'thumb'])
                .populate('teacher', 'name avatar');
            //toán tử in, tìm các phần tử trong dánh sách, như trên là tìm _id của Classroom nào có trong enrolledClassrooms
            const enrolledClassrooms = await Classroom.find({
                _id: {
                    $in: findUser.enrolledClassrooms,
                },
            })
                .select(['name', 'classCode', 'thumb']) // chỉ lấy trường name, classCode, thumb của classroom
                .populate('teacher', 'name avatar'); // ref đến bảng teacher và lấy name và avatar của teacher
            //nếu muốn bỏ id thì chỉ cần thêm -id vào là ok
            return resolve({
                message: 'successfully fetched',
                data: {
                    myClassrooms,
                    enrolledClassrooms,
                },
            });
        } catch (err) {
            console.log(err);
            reject({ message: 'Lỗi', error: err });
        }
    });
};
export const createClassroom = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = req.user
            const { name, subject } = req.body;
            if (!name?.trim() || !subject?.trim()) {
                if (!mongoose.Types.ObjectId.isValid(user?.id)) {
                    return reject({ message: 'Không tìm thấy người dùng' });
                }
                return reject({ message: 'Thiếu dữ liệu' });
            }
            const teacher = await User.findById(new Types.ObjectId(user?.id));
            if (!teacher) return reject({ message: 'Không tìm thấy giáo viên' });
            //tạo lớp class code
            let classCode = generateUniqueRandomString(6);
            let classCodeExists = await mongoose.models.classroom.exists({ classCode });
            // kiểm tra xem có trùng không?
            while (classCodeExists) {
                classCode = generateUniqueRandomString(6);
                classCodeExists = await mongoose.models.classroom.exists({ classCode });
            }
            classCode = classCode;
            const thumb = imageClassThumbnailDefault[Math.floor(Math.random() * imageClassThumbnailDefault.length)];
            const classroom = await Classroom.create({ name, subject, teacher: user.id, thumb, classCode });
            teacher.myClassrooms.push(classroom.id);
            await teacher.save();
            if (classroom) {
                resolve({ message: 'successfully created classroom', data: classroom });
            }
        } catch (err) {
            reject({ message: 'Lỗi', error: err });
        }
    });
};
export const getClassroomDetail = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { classCode } = req.query;
            if (typeof classCode === 'string' && !classCode?.trim()) {
                return reject({ status: 400, message: 'Thiếu dữ liệu' });
            }
            const classroomDetail = await Classroom.findOne({ classCode: classCode })
                .select('classCode name posts students subject teacher thumb')
                .populate('teacher', 'name avatar')
                .populate('students', 'name avatar');
            if (!classroomDetail) return reject({ status: 400, message: 'Không tìm thấy lớp học' });
            const posts = await Post.find({ classroomId: classroomDetail?.id })
                .select('createdBy content createdAt quizzes')
                .populate('quizzes', 'name subject slug thumb')
                .populate('createdBy', 'avatar name email');
            if (!classroomDetail) return reject({ status: 400, message: 'Không tìm thấy dữ liệu lớp học' });
            const data = Object.assign(classroomDetail, { posts });
            return resolve({ message: 'Successfully fetched classroom', data: data });
        } catch (err) {
            console.log(err);
            return reject({ message: 'ERROR', error: err });
        }
    });
};
export const enrollInClassroom = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = req.user
            const { classCode } = req.body;
            const userId = user?.id && Types.ObjectId.isValid(user.id) ? user.id : null;
            const findUser = await User.findById(userId);
            if (!classCode || !findUser) {
                return reject({ status: 400, message: 'Thiếu dữ liệu' });
            }
            const classroomDetail = await Classroom.findOne({ classCode: classCode });
            if (!classroomDetail) return reject({ status: 400, message: 'Không tìm thấy dữ liệu lớp học' });
            if (classroomDetail.students.some((student) => student == userId)) {
                return reject({ message: 'Bạn đã ở trong lớp học rồi!!!' });
            }
            classroomDetail?.students.push(userId);
            findUser.enrolledClassrooms.push(classroomDetail.id);
            const saveClass = await classroomDetail?.save();
            const saveUser = await findUser.save();
            if (saveClass && saveUser) return resolve({ message: 'Enrollment successful' });
            return reject({ message: 'ERROR' });
        } catch (err) {
            return reject({ message: 'ERROR', error: err });
        }
    });
};
