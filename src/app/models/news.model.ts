import mongoose, { Document, Schema, Types } from 'mongoose';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
import slugify from 'slugify';

interface INews extends Document {
    title: string;
    content: string;
    slug: string;
    createBy: mongoose.Types.ObjectId;
}

const newsSchema = new Schema(
    {
        title: { type: String },
        content: { type: String, required: true },
        slug: { type: String },
        createBy: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    },
    { timestamps: true },
);
newsSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true });
newsSchema.pre<INews>('validate', async function (next) {
    if (this?.isModified('title')) {
        // kiểm tra xem có thay đổi so với trước đó hay không? nếu là lần đầu thêm thì isModified luôn trả về true
        let newSlug = slugify(this?.title, {
            lower: true, // Chuyển slug thành chữ thường
            strict: true, // Loại bỏ ký tự đặc biệt
            locale: 'vi', // Hỗ trợ tiếng Việt
        });
        // Kiểm tra slug đã tồn tại - slugExist này sẽ trả về objectId
        let slugExists = await mongoose.models.quiz.exists({ slug: newSlug });
        let counter = 1;
        // Nếu slug đã tồn tại, thêm hậu tố để tạo slug mới
        while (slugExists) {
            newSlug = `${slugify(this.title, {
                lower: true,
                strict: true,
                locale: 'vi',
            })}-${counter}`;
            slugExists = await mongoose.models.quiz.exists({ slug: newSlug });
            counter++;
        }
        this.slug = newSlug;
    }
    next();
});
const News = mongoose.model<INews, SoftDeleteModel<INews>>('news', newsSchema, 'news');
export default News;
