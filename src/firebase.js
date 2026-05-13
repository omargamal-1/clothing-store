import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzFYIRvrNFiP2BGwABMT_38yrW-kvQI14",
  authDomain: "clothing-store-d6d36.firebaseapp.com",
  projectId: "clothing-store-d6d36",
  storageBucket: "clothing-store-d6d36.firebasestorage.app",
  messagingSenderId: "887271378862",
  appId: "1:887271378862:web:f286db5c9178480705c23f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);