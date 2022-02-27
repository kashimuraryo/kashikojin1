// import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
// import firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  apiKey: "AIzaSyD_2Tle81VBP2GTMuQlV5myxP5-aQuk4Sc",
  authDomain: "kashikojin1-2.firebaseapp.com",
  projectId: "kashikojin1-2",
  storageBucket: "kashikojin1-2.appspot.com",
  messagingSenderId: "1085738202692",
  appId: "1:1085738202692:web:267055af4cc650348d6e11",
  measurementId: "G-LSVYB9F1WQ"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore();
export const storage = getStorage();

export default app;