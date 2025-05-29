import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9v26Blc5TPy2lfQHauBhZSTvc-DRc14E",
  authDomain: "desafio003-7ef80.firebaseapp.com",
  projectId: "desafio003-7ef80",
  storageBucket: "desafio003-7ef80.firebasestorage.app",
  messagingSenderId: "554996971363",
  appId: "1:554996971363:web:b9afaf015eb21771934556",
  measurementId: "G-1P2H8PLKG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 