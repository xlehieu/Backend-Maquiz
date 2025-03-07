import mongoose, { Document, Types } from 'mongoose';

const Schema = mongoose.Schema;

// interface IPathsIndex {
//     questionsIndex: [number]
// }
interface IQuizHistory extends Document {
    user: Types.ObjectId;
    quiz: Types.ObjectId;
    score: number;
    answerChoices: any;
    mode: string;
    // IPathIndex :IPathsIndex[]
}
const examHistorySchema = new Schema<IQuizHistory>({
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'quiz', required: true },
    score: { type: Number, required: true },
    mode: { type: String, default: 'Ôn thi' },
    answerChoices: { type: [Schema.Types.Mixed] }, //phải tạo 1 schema dành cho AnswerPart không thì sẽ lỗi
});
const ExamHistory = mongoose.model('examHistory', examHistorySchema);
export default ExamHistory;
