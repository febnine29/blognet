import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP9eVdEOJ9SnaWbsOumKT3vJzGk-k6Z9U",
  authDomain: "invisocial-d4fd9.firebaseapp.com",
  databaseURL: "gs://invisocial-d4fd9.appspot.com",
  projectId: "invisocial-d4fd9",
  storageBucket: "invisocial-d4fd9.appspot.com",
  messagingSenderId: "65798213660",
  appId: "1:65798213660:web:58042a50fc7998ed724fd9",
  measurementId: "G-YB4N38L8WV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 
export const storage = getStorage()