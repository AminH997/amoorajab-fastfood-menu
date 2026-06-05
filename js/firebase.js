import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCZTqAzdlW2ViOKFkVSCmhr-VsySJGYKU0",
  authDomain: "amoorajab-menu.firebaseapp.com",
  projectId: "amoorajab-menu",
  storageBucket: "amoorajab-menu.firebasestorage.app",
  messagingSenderId: "264207900733",
  appId: "1:264207900733:web:aac268a39c0d6fae940a54"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);