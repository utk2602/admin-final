import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCdr1mlA2V2ahN8SGO5bpBIYTngDz5bMk8",
  authDomain: "enrollments-ieeecs.firebaseapp.com",
  projectId: "enrollments-ieeecs",
  storageBucket: "enrollments-ieeecs.appspot.com",
  messagingSenderId: "488954143497",
  appId: "1:488954143497:web:22efbe95dee7399d8de9d8",
  measurementId: "G-MS525VZN29"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    
    prompt: "select_account",
  });

export const signInWithGoogle = () => signInWithPopup(auth, provider)
export const signOut = () => firebaseSignOut(auth)

