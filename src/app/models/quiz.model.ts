import mongoose, { Document, Types } from 'mongoose';
import slugify from 'slugify';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
import removeAccents from 'remove-accents';

const Schema = mongoose.Schema;
export interface IAnswer {
    content: string;
    isCorrect: boolean;
}

export interface IQuestion {
    questionType: number;
    questionContent: string;
    answers: IAnswer[];
}

export interface IPart {
    partName: string;
    questions: IQuestion[];
    isDisabled: boolean;
}
export interface IQuiz extends Document {
    name: string;
    description: string;
    school: string;
    subject: string;
    thumb: string;
    user: Types.ObjectId; // Lưu ý dùng Types.ObjectId thay vì mongoose.Schema.Types.ObjectId
    quiz: IPart[];
    accessCount: number;
    examCount: number;
    createdAt?: Date; // Optional nếu sử dụng timestamps trong schema
    updatedAt?: Date; // Optional nếu sử dụng timestamps trong schema
    slug?: string;
    topic?: string;
    schoolYear?: number;
    educationLevel?: string[];
    nameNoAccent?: string;
    questionCount?: number;
    isDisabled?: boolean;
}
const QuizSchema = new Schema<IQuiz>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        school: { type: String, required: true },
        subject: { type: String, required: true },
        thumb: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        quiz: [
            {
                partName: { type: String, required: true },
                questions: [
                    {
                        questionType: { type: Number, required: true },
                        questionContent: { type: String, required: true },
                        answers: [
                            {
                                content: { type: String, required: true },
                                isCorrect: { type: Boolean, required: true },
                                _id: false,
                            },
                        ],
                        _id: false,
                    },
                ],
                isDisabled: { type: Boolean, required: true, default: false },
                _id: false,
            },
        ],
        accessCount: { type: Number, required: true, default: 0 },
        examCount: { type: Number, required: true, default: 0 },
        slug: { type: String, required: true, unique: true },
        topic: { type: String },
        schoolYear: { type: Number },
        educationLevel: { type: [String] }, //cách khai báo một mảng các chuỗi
        nameNoAccent: { type: String }, // Tạo thêm một field mới để lưu tên bài trắc nghiệm không dấu
        questionCount: { type: Number, default: 0 },
        isDisabled: { type: Boolean, required: true, default: false },
    },
    { timestamps: true },
);
QuizSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});
QuizSchema.pre<IQuiz>('validate', async function (next) {
    if (this?.isModified('name')) {
        // kiểm tra xem có thay đổi so với trước đó hay không? nếu là lần đầu thêm thì isModified luôn trả về true
        let newSlug = slugify(this?.name, {
            lower: true, // Chuyển slug thành chữ thường
            strict: true, // Loại bỏ ký tự đặc biệt
            locale: 'vi', // Hỗ trợ tiếng Việt
        });
        // Kiểm tra slug đã tồn tại - slugExist này sẽ trả về objectId
        let slugExists = await Quiz.findOneWithDeleted({
            slug: newSlug,
        });
        let counter = 1;
        // Nếu slug đã tồn tại, thêm hậu tố để tạo slug mới
        while (slugExists) {
            newSlug = `${slugify(this.name, {
                lower: true,
                strict: true,
                locale: 'vi',
            })}-${counter}`;
            slugExists = await Quiz.findOneWithDeleted({
                slug: newSlug,
            });
            counter++;
        }
        this.slug = newSlug;
    }
    this.nameNoAccent = removeAccents(this.name.toLowerCase());
    if (this.isModified('quiz')) {
        if (Array.isArray(this.quiz)) {
            this.questionCount = this.quiz.reduce((accumulator, partCurrent) => {
                return accumulator + partCurrent?.questions?.length;
            }, 0);
        }
    }
    next();
});
const Quiz = mongoose.model<IQuiz, SoftDeleteModel<IQuiz>>('quiz', QuizSchema);
export default Quiz;
