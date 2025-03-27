import User from '../models/user.model';
import Quiz, { IPart } from '../models/quiz.model';
import { Types } from 'mongoose';
import { uploadAndGetLink } from '../../utils';
import { Request } from 'express';
export const getQuizzes = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.userInfo;
            const { limit, skip } = req.query;
            const findUser = await User.findById(id);
            if (!findUser) {
                reject({
                    message: 'Lỗi xác thực',
                });
            }
            if (!findUser) return resolve({ status: 401, message: 'unauthorized' });
            //trong aggregate chạy các pipeline- các stage ý
            const quizzes = await Quiz.aggregate([
                {
                    $match: {
                        user: new Types.ObjectId(id),
                    },
                },
                {
                    //facet giup chay cac pipeline con
                    // nhu o trong huop nay la ban dau se dem so quiz duoc lay ra
                    $facet: {
                        metadata: [
                            {
                                $count: 'total',
                            },
                        ],
                        data: [
                            {
                                $skip: isNaN(Number(skip)) ? 0 : Number(skip),
                            },
                            {
                                $limit: isNaN(Number(limit)) ? 12 : Number(limit),
                            },
                        ],
                    },
                },
            ]);
            const result = {
                total: quizzes[0].metadata[0].total || 0,
                quizzes: quizzes[0].data || [],
            };
            resolve({ message: 'Successfully fetched quizzes', data: result });
        } catch (err) {
            console.log(err);
            return reject({ message: 'Lỗi', error: err });
        }
    });
};
export const getQuizDetail = async (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.query;
            if (!id) {
                reject({
                    message: 'Có lỗi trong quá trình tìm',
                });
            }
            const quiz = await Quiz.findById(id);
            if (!quiz) {
                reject({
                    message: 'Quiz not found',
                });
            }
            resolve({ message: 'Successfully fetched quiz', data: quiz });
        } catch (err: any) {
            return reject({ message: 'Lỗi', error: err });
        }
    });
};
// tạo bài trác nghiệm -- tạo thông tin chung
export const createQuiz = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            //trong middleware đã truyền user có chứa id theo rồi
            const user = req.userInfo;
            const { name, description, subject, school, topic, schoolYear, educationLevel, thumb } = req.body;
            const userInfo = await User.findById(user.id);
            if (!userInfo) {
                reject({
                    message: 'User not found',
                });
            }
            if (!thumb.startsWith('http')) {
                var urlThumb = await uploadAndGetLink(thumb, `${user.id}/quiz`);
            }
            const quiz = new Quiz({
                name,
                description,
                subject,
                school,
                topic,
                schoolYear,
                educationLevel,
                user: user.id,
                thumb: urlThumb ?? thumb,
                quiz: [],
            });
            const save = await quiz.save();
            if (save && save._id instanceof Types.ObjectId) {
                userInfo?.quizzes.push(new Types.ObjectId(save._id));
                await userInfo?.save();
                resolve({ message: 'Successfully create quiz information', data: quiz });
            }
        } catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    });
};
// Thêm câu hỏi
export const createQuestion = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, partName, questionType, questionContent, answers } = req.body;
            if (!id || !partName || !questionType || !questionContent || !answers || answers.length === 0) {
                reject({
                    message: 'Vui lòng kiểm tra lại thông tin câu hỏi',
                });
            }
            const findQuiz = await Quiz.findById(id);
            if (!findQuiz) {
                reject({
                    message: 'Quiz not found',
                });
                return;
            }
            const checkPart = findQuiz.quiz.some((part: IPart) => {
                return part.partName === partName;
            }); // phương thức some return về true or false, xem có bất kỳ cái nào thỏa mãn điều kiện không
            if (checkPart) {
                findQuiz.quiz.forEach((quizChildren: IPart) => {
                    if (quizChildren.partName === partName) {
                        const newQuestion = {
                            questionType: questionType,
                            questionContent: questionContent,
                            answers: answers,
                        };
                        quizChildren.questions.push(newQuestion);
                    }
                });
            } else {
                const newPart = {
                    partName: partName,
                    questions: [
                        {
                            questionType: questionType,
                            questionContent: questionContent,
                            answers: answers,
                        },
                    ],
                    isDisabled: false,
                };
                findQuiz.quiz.push(newPart);
            }
            const saveQuiz = await findQuiz.save();
            return resolve({ message: 'Successfully create question', data: saveQuiz });
        } catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    });
};
//chỉnh sửa thông tin chung
export const updateQuizGeneralInfo = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = req.userInfo;
            const { id, name, description, subject, school, topic, schoolYear, educationLevel, thumb } = req.body;
            const findQuiz = await Quiz.findById(id);
            if (!findQuiz) {
                return reject({ message: 'Không tìm thấy bài trắc nghiệm tương ứng' });
            }
            if (!thumb.startsWith('http')) {
                var urlThumb = await uploadAndGetLink(thumb, `${user.id}/quiz`); //base64, tên folder ảnh (userId/quiz)
            }
            const quizUpdate = await Quiz.findByIdAndUpdate(
                id,
                {
                    name,
                    description,
                    subject,
                    school,
                    topic,
                    schoolYear,
                    educationLevel,
                    user: user.id,
                    thumb: urlThumb ?? thumb,
                },
                { new: true },
            );
            if (quizUpdate)
                return resolve({ message: 'Successfully updated quiz general information', data: quizUpdate });
            return reject({ message: 'Cập nhật bài trắc nghiệm thất bại' });
        } catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    });
};
// Chỉnh sửa câu hỏi
export const updateQuizQuestion = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, quiz } = req.body;
            const findQuiz = await Quiz.findById(id);
            if (!findQuiz) {
                return reject({ message: 'Không tìm thấy bài trắc nghiệm tương ứng' });
            } else {
                findQuiz.quiz = quiz;
                const saveQuiz = await findQuiz.save();
                if (saveQuiz) return resolve({ message: 'Successfully updated quiz question', data: saveQuiz });
                return reject({ message: 'Cập nhật các câu hỏi trắc nghiệm thất bại' });
            }
        } catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    });
};
// xem trước khi làm bài
export const getQuizPreview = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { slug } = req.params;
            const userInfo = req.userInfo;
            const findQuiz = await Quiz.findOne({ slug: slug })
                .select('name description subject school thumb quiz accessCount examCount createdAt slug')
                .populate('user', 'name avatar');
            if (!findQuiz) return reject({ message: 'Không tìm thấy bài trắc nghiệm' });
            findQuiz.accessCount++;
            findQuiz.save(); // không dùng await cho server nhanh =))))))))
            // nếu đăng nhập rồi thì lấy id ở token ra để thêm vào quiz Access History
            if (userInfo?.id) {
                const findUser = await User.findById(userInfo?.id);
                if (findUser) {
                    if (!findUser.quizAccessHistory.includes(findQuiz.id))
                        findUser.quizAccessHistory?.push(findQuiz!.id);
                    findUser.save();
                }
            }
            return resolve({ message: 'Successfully fetched quiz', data: findQuiz });
        } catch (err) {
            console.log(err);
            return reject({ message: 'Lỗi', error: err });
        }
    });
};
//
export const getQuizForExam = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { slug } = req.params;
            const findQuiz = await Quiz.findOne({ slug: slug });
            if (findQuiz) {
                const findUser = await User.findById(findQuiz.user);
                const { id, name, description, subject, school, thumb, quiz, accessCount, examCount, createdAt } =
                    findQuiz;
                findQuiz.examCount = Number(examCount + 1);
                await findQuiz.save();
                return resolve({
                    message: 'Successfully fetched',
                    data: {
                        id,
                        name,
                        description,
                        subject,
                        school,
                        thumb,
                        quiz,
                        accessCount,
                        examCount,
                        createdAt,
                        slug,
                        user: {
                            name: findUser?.name,
                            avatar: findUser?.avatar,
                        },
                    },
                });
            }
            return reject({ message: 'Không tìm thấy bài trắc nghiệm' });
        } catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    });
};

// tìm bài trắc nghiệm
export const getDiscoveryQuizzes = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { limit, skip, topic, school_year, education_level, name } = req.query;

            // Khởi tạo điều kiện lọc rỗng (không lọc nếu không có gì)
            const matchStage: any = {};

            // Tìm kiếm theo tên nếu có
            if (name && typeof name === 'string') {
                matchStage.$or = [
                    { nameNoAccent: { $regex: new RegExp(name, 'i') } },
                    { name: { $regex: new RegExp(name, 'i') } },
                ];
            }

            // Lọc theo topic nếu có
            if (topic && typeof topic === 'string') {
                const topicsArray = topic.split(',');
                if (topicsArray.length > 0) {
                    matchStage.topic = { $in: topicsArray };
                }
            }

            // Lọc theo school_year nếu có
            if (school_year && typeof school_year === 'string') {
                const schoolYearArray = school_year.split(',');
                if (schoolYearArray.length > 0) {
                    matchStage.school_year = { $in: schoolYearArray };
                }
            }

            // Lọc theo education_level nếu có
            if (education_level && typeof education_level === 'string') {
                const educationLevelArray = education_level.split(',');
                if (educationLevelArray.length > 0) {
                    matchStage.education_level = { $in: educationLevelArray };
                }
            }

            const aggregationPipeline: any[] = [];

            // Chỉ thêm `$match` nếu có điều kiện lọc
            if (Object.keys(matchStage).length > 0) {
                aggregationPipeline.push({ $match: matchStage });
            }

            aggregationPipeline.push({
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [
                        { $skip: isNaN(Number(skip)) ? 0 : Number(skip) },
                        { $limit: isNaN(Number(limit)) ? 12 : Number(limit) },
                    ],
                },
            });

            const quizzes = await Quiz.aggregate(aggregationPipeline);
            const data = Object.assign(quizzes[0].metadata[0], { quizzes: quizzes[0].data });
            if (quizzes) {
                resolve({ message: 'Successfully fetched', data: data });
            }
        } catch (err) {
            console.log(err);
            return reject({ message: 'Lỗi', error: err });
        }
    });
};
// soft delete
export const deleteQuiz = (req: Request) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.params;
            if (!id) return reject({ message: 'Không tìm thấy bài trắc nghiệm' });
            const findQuiz = await Quiz.findById(id);
            if (findQuiz) {
                const deleteInfo: any = await Quiz.delete({ _id: id });
                if (deleteInfo?.matchedCount > 0) {
                    return resolve({ message: 'Bài trắc nghiệm đã xóa thành công', data: { id: findQuiz._id } });
                }
                return reject({ message: 'Xóa không thành công' });
            }
            return reject({ message: 'Không tìm thấy bài trắc nghiệm' });
        } catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    });
};
