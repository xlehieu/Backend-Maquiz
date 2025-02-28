import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDkrD2M49xMwQbY_68nqSP3XuwhfnVoipo',
    authDomain: 'mah-auth.firebaseapp.com',
    projectId: 'mah-auth',
    storageBucket: 'mah-auth.appspot.com',
    messagingSenderId: '888851926754',
    appId: '1:888851926754:web:960d40cd4d0cac900e58bb',
    measurementId: 'G-X2FYH40860',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageDB = getStorage(app);
