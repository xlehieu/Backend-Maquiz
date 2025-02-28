import { imageDB } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export function generateUniqueRandomString(length: number): string {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
//Chuyển đổi ảnh copy chat GPT: khi lưu ảnh vào firebase thì cần phải chuyển thành dạng blob (Binary Large Object)
function dataURItoBlob(base64Image: any): Blob {
    var byteString = atob(base64Image.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}
export const uploadAndGetLink = async (imageData: string, folderName: string): Promise<string | null | undefined> => {
    try {
        if (!folderName || imageData.length <= 0) {
            return undefined;
        }
        if (imageData.startsWith('http')) return imageData;
        const blob = dataURItoBlob(imageData);
        const storageRef = ref(imageDB, `${folderName}/${generateUniqueRandomString(19)}`);
        const data = await uploadBytesResumable(storageRef, blob);
        const url = await getDownloadURL(data.ref);
        return url;
    } catch (err) {
        return null;
    }
};
export const validateEmail = (email: string) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
