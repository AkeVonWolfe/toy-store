// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5ZGyM22ofqrbKen8a--kX5j4E2u43mh4",
  authDomain: "toy-store-2e612.firebaseapp.com",
  projectId: "toy-store-2e612",
  storageBucket: "toy-store-2e612.firebasestorage.app",
  messagingSenderId: "355325783885",
  appId: "1:355325783885:web:047e7b38fe103b64fa9104"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default db