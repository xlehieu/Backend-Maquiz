import mongoose, { Schema } from 'mongoose';

interface IPost extends Document {
    classroomId: mongoose.Types.ObjectId;
    content: string;
    quizzes: mongoose.Types.ObjectId[];
    createdBy?: mongoose.Types.ObjectId;
    createdAt?: Date;
}

const PostSchema = new Schema<IPost>(
    {
        classroomId: { type: Schema.Types.ObjectId, ref: 'class', required: true },
        content: { type: String, required: true },
        quizzes: [{ type: Schema.Types.ObjectId, ref: 'quiz', default: [] }],
        createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    },
    { timestamps: true },
);
const Post = mongoose.model<IPost>('post', PostSchema);
export default Post;
