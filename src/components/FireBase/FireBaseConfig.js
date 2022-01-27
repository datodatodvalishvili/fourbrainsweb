import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCpD4Yw4rmH3okTP2ocAq5Tge3H7Qrm9lA",
  authDomain: "gepardy.firebaseapp.com",
  databaseURL: "https://gepardy-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gepardy",
  storageBucket: "gepardy.appspot.com",
  messagingSenderId: "536272414756",
  appId: "1:536272414756:web:a1c80a86c24521f61590b1",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;
