import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; 

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDv6087yLICOF73ZDTyPFBXcL9a5qiW5Gc",
  authDomain: "products-612e7.firebaseapp.com",
  databaseURL: "https://products-612e7-default-rtdb.firebaseio.com",
  projectId: "products-612e7",
  storageBucket: "products-612e7.appspot.com",
  messagingSenderId: "586448488954",
  appId: "1:586448488954:web:504032814c4138efb1bc43",
  measurementId: "G-38FE8WPFNC",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
