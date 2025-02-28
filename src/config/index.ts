import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.DATABASE_URI;

export async function connect() {
    try {
        await mongoose.connect(String(uri));
        console.log('Successfully connect');
    } catch (err) {}
}
