import mongoose, { Types } from 'mongoose';
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';
const Schema = mongoose.Schema;

interface IUser extends SoftDeleteDocument {
    name: string;
    email: string;
    password: string;
    phone: string;
    isAdmin: boolean;
    avatar: string;
    address: string;
    access_token: string;
    refresh_token: string;
    isActive: boolean;
    quizzes: Types.ObjectId[]; // Lưu �� dùng Types.ObjectId thay vì mongoose.Schema.Types.ObjectId
    myClassrooms: Types.ObjectId[];
    enrolledClassrooms: Types.ObjectId[]; // Lưu �� dùng Types.ObjectId thay vì mongoose.Schema.Types.ObjectId
    quizAccessHistory: Types.ObjectId[];
    examHistory: Types.ObjectId[];
    favoriteQuiz: Types.ObjectId[];
    resetPasswordToken: String;
    resetPasswordExpires: Number;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        isAdmin: { type: Boolean, default: false, required: true },
        phone: { type: String, unique: true },
        avatar: { type: String },
        address: { type: String },
        access_token: { type: String },
        refresh_token: { type: String },
        isActive: { type: Boolean, default: true },
        quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'quiz', default: [] }],
        myClassrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'classroom', default: [] }],
        enrolledClassrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'classroom', default: [] }],
        quizAccessHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'quiz', default: [] }],
        examHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'examHistory', default: [] }],
        favoriteQuiz: [{ type: mongoose.Schema.Types.ObjectId, ref: 'quiz', default: [] }],
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Number },
    },
    {
        timestamps: true,
    },
);
UserSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});
const User: SoftDeleteModel<IUser> = mongoose.model<IUser, SoftDeleteModel<IUser>>('user', UserSchema);

export default User;
