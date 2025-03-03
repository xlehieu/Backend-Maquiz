import mongoose, { Document,  Schema } from 'mongoose';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

interface IPost extends Document {
    classroomId: mongoose.Types.ObjectId;
    content: string;
    quizzes: mongoose.Types.ObjectId[];
    createdBy?: mongoose.Types.ObjectId;
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
PostSchema.plugin(MongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
})
const Post = mongoose.model<IPost,SoftDeleteModel<IPost>>('post', PostSchema);
export default Post;
