import { Request } from 'express';
import News from '../models/news.model';

export const getNews = async () => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        return { message: 'Lấy tin tức thành công', data: news };
    } catch (error) {
        console.error(error);
        return { message: 'Lỗi', error };
    }
};
export const createNews = async (req: Request) => {
    try {
        const user = req.userInfo;
        const { title, content } = req.body;
        if (!content) return { message: 'Thiếu dữ liệu', status: 400 };
        const news = await News.create({
            title,
            content,
            createBy: user.id,
        });
        return { message: 'Tạo tin tức thành công', data: news };
    } catch (error) {
        console.error(error);
        return { message: 'Lỗi', error };
    }
};

export const updateNews = async (req: Request) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        if (!content) return { message: 'Thiếu dữ liệu', status: 400 };
        const news = await News.findById(id);
        if (!news) return { message: 'Tin tức không tồn tại', status: 404 };
        if (news.createBy.toString() !== req.userInfo.id)
            return { message: 'Bạn không có quyền sửa tin tức này', status: 403 };
        news.title = title;
        news.content = content;
        await news.save();
        return { message: 'Cập nhật tin tức thành công', data: news };
    } catch (error) {
        console.error(error);
        return { message: 'Lỗi', error };
    }
};
export const deleteNews = async (req: Request) => {
    try {
        const { id } = req.params;
        console.log(id);
        const news = await News.delete({ _id: id });
        console.log(news);
        return { message: 'Xóa tin tức thành công' };
    } catch (error) {
        console.error(error);
        return { message: 'Lỗi', error };
    }
};
