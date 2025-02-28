import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.DATABASE_URI;

export async function connect() {
    try {
        await mongoose.connect(String(uri), {
            connectTimeoutMS: 60000, //timeout khi kết nối
            serverSelectionTimeoutMS: 60000, // Tăng thời gian chờ chọn server lên 30 giây
            socketTimeoutMS: 60000, // Tăng thời gian chờ socket
        });
        console.log('Successfully connect');
    } catch (err) {}
}
