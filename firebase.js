
import { getApp, initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5b6SBGuNeGrjgp3NRWeSCQRRq3nr-CIw",
  authDomain: "booking-app-2b105.firebaseapp.com",
  projectId: "booking-app-2b105",
  storageBucket: "booking-app-2b105.appspot.com",
  messagingSenderId: "566291948553",
  appId: "1:566291948553:web:ee5b0d5e6cd482caa6c4d8"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore();

export {auth,db};