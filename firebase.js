// ==== Firebase config ====
const firebaseConfig = {
  apiKey: "AIzaSyChgVIPxsSrmsKo8cL2gpMMf9bUioLKgd4",
  authDomain: "seen-it-d5731.firebaseapp.com",
  projectId: "seen-it-d5731",
  storageBucket: "seen-it-d5731.firebasestorage.app",
  messagingSenderId: "539164904581",
  appId: "1:539164904581:web:b17edd8d48c333be61edec",
  measurementId: "G-YEJBLCXM0G"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
