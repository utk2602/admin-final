import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBsZrUQb8Pl_3AqBVogosyUAwJQNekH778",
  authDomain: "admin-portal-10fb8.firebaseapp.com",
  projectId: "admin-portal-10fb8",
  storageBucket: "admin-portal-10fb8.firebasestorage.app",
  messagingSenderId: "830808741383",
  appId: "1:830808741383:web:414fef7dd5bf8c5ae3fca2",
  measurementId: "G-GTG9ZHTET0"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => signInWithPopup(auth, provider)
export const signOut = () => firebaseSignOut(auth)

