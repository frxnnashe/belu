// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDmVaGz7g13uGjxv40lB3_vWwXTbKd-kxo",
  authDomain: "belen-a.firebaseapp.com",
  projectId: "belen-a",
  storageBucket: "belen-a.firebasestorage.app",
  messagingSenderId: "938930241891",
  appId: "1:938930241891:web:f816886be099158f6a9356"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);