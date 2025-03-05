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
    active: boolean;
    quizzes: Types.ObjectId[]; // Lưu �� dùng Types.ObjectId thay vì mongoose.Schema.Types.ObjectId
    myClassrooms: Types.ObjectId[];
    enrolledClassrooms: Types.ObjectId[]; // Lưu �� dùng Types.ObjectId thay vì mongoose.Schema.Types.ObjectId
    quizAccessHis: Types.ObjectId[];
}
const UserSchema = new Schema<IUser>(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
        phone: { type: String, required: true, unique: true },
        avatar: { type: String },
        address: { type: String },
        access_token: { type: String },
        refresh_token: { type: String },
        active: { type: Boolean, default: true },
        quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'quiz', default: [] }],
        myClassrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'classroom', default: [] }],
        enrolledClassrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'classroom', default: [] }],
        quizAccessHis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'quiz', default: [] }],
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
