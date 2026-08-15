import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz8ib_jDjTeUoS1lB-JF34f7rac3MKkXc",
  authDomain: "mailsend-api.firebaseapp.com",
  projectId: "mailsend-api",
  storageBucket: "mailsend-api.firebasestorage.app",
  messagingSenderId: "50545384971",
  appId: "1:50545384971:web:62d0a51e7d34984769710e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
