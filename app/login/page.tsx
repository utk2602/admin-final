"use client";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@/hooks/useNavigation";

const allowedEmails = new Set([
  "ansh.mehta2022@vitstudent.ac.in",
  "ram.krishna2022@vitstudent.ac.in",
  "medhansh.jain2022a@vitstudent.ac.in",
  "krish.krunalbhai2022@vitstudent.ac.in",
  "arjun.bector2022@vitstudent.ac.in",
  "anubhav.batra2022@vitstudent.ac.in",
  "akshit.anand2022@vitstudent.ac.in",
  "parthsunil.jadhav2022@vitstudent.ac.in",
  "dhriti.sharma2022@vitstudent.ac.in",
  "gouri.kanade2022@vitstudent.ac.in",
  "adityakumar.verma2022@vitstudent.ac.in",
  "aryasadanand.patil2022@vitstudent.ac.in",
  "varun.satish2022@vitstudent.ac.in",
  "utkarsh.2023@vitstudent.ac.in",
  "aryaman.ghai2023@vitstudent.ac.in",
  "aksh.agrawal2023@vitstudent.ac.in",
  "Sanjhana.a2023@vitstudent.ac.in",
  "shreya.singhal2023@vitstudent.ac.in",
  "anisha.saha2023a@vitstudent.ac.in",
  "neel.ladani2023@vitstudent.ac.in",
  "aditi.gkrishnan2023@vitstudent.ac.in",
  "kriti.maheshwari2023@vitstudent.ac.in",
  "karishma.rahaman2023@vitstudent.ac.in",
  "shubham.prasad2023@vitstudent.ac.in",
  "medha.s2023@vitstudent.ac.in",
  "vaishvi.verma2023@vitstudent.ac.in",

  "sanjhana.a2023@vitstudent.ac.in",


]);




export default function Home() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { navigate } = useNavigation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !allowedEmails.has(user.email)) {
      setError("Unauthorized email. Access denied.");
      handleSignOut();
    }
  }, [user]);

  const handleSignIn = async () => {
    setError(null);
    try {
      const userCredential = await signInWithGoogle();
      if (userCredential && userCredential.user) {
        const idToken = await userCredential.user.getIdToken();
        Cookies.set("authToken", idToken, {
          expires:1/24 ,
        });
      }
    } catch (err) {
      setError("");
    }
  };
  const handleSignOut = async () => {
    setError(null);
    await signOut();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section id="hero" className="min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <h1 className="shine-title mb-12 p-6 bg-black rounded-lg text-8xl sm:text-9xl border-gradient">IEEE CS</h1>
          {loading ? (
            <p>Loading...</p>
          ) : user ? (
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                className="bg-[#f4b41a] text-black hover:bg-[#e8b974] text-xl px-8 py-6"
                onClick={() => navigate("/questions")}
              >
                Questions
              </Button>
              <Button
                className="bg-[#f4b41a] text-black hover:bg-[#e8b974] text-xl px-8 py-6"
                onClick={() => navigate("/domains")}
              >
                Domains
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-800 text-xl px-8 py-6"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              className="bg-[#f4b41a] text-black hover:bg-[#e8b974] text-xl px-8 py-6"
              onClick={handleSignIn}
            >
              Sign In with Google
            </Button>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </motion.div>
      </section>
    </div>
  );
}
