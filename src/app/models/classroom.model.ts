import mongoose, { Document, Types, Schema } from 'mongoose';
import { imageClassThumbnailDefault } from '../../constants';
import { generateUniqueRandomString } from '../../utils';

export interface IClassroom extends Document {
    name: string;
    subject: string;
    students: Types.ObjectId[];
    teacher: Types.ObjectId;
    post: Types.ObjectId[];
    classCode: string;
    thumb: string;
}
const classroomSchema = new Schema<IClassroom>(
    {
        classCode: { type: String, required: true },
        name: { type: String, required: true },
        subject: { type: String, required: true },
        teacher: { type: Schema.Types.ObjectId, ref: 'user', required: true },
        students: [{ type: Schema.Types.ObjectId, ref: 'user', default: [] }],
        post: [{ type: Schema.Types.ObjectId, ref: 'post', default: [] }],
        thumb: { type: String },
    },
    { timestamps: true },
);
// classroomSchema.pre('init', async function (next) {
//     let classCode = generateUniqueRandomString(6);
//     console.log(classCode);
//     let classCodeExists = await mongoose.models.classroom.exists({ classCode });
//     while (classCodeExists) {
//         classCode = generateUniqueRandomString(6);
//         classCodeExists = await mongoose.models.classroom.exists({ classCode });
//     }
//     this.thumb = imageClassThumbnailDefault[Math.floor(Math.random() * imageClassThumbnailDefault.length)];
//     this.classCode = classCode;
//     next();
// });
const Classroom = mongoose.model<IClassroom>('classroom', classroomSchema);
export default Classroom;
