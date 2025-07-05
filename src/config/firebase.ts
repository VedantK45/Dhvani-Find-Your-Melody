import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBx64kJTqddxMSlKjJx4nQ5wU462DNRa8A",
  authDomain: "dhvani-find-your-melody.firebaseapp.com",
  projectId: "dhvani-find-your-melody",
  storageBucket: "dhvani-find-your-melody.firebasestorage.app",
  messagingSenderId: "199889761043",
  appId: "1:199889761043:web:96099d7e2af34c0ef4a0e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;