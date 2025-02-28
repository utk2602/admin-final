"use client";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "@/hooks/useNavigation";

export default function Home() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { navigate } = useNavigation();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    try {
      const userCredential = await signInWithGoogle();
      if (userCredential && userCredential.user) {
        const idToken = await userCredential.user.getIdToken();
        Cookies.set("authToken", idToken, {
          expires: 1/24,
        });
      }
    } catch (err) {
      setError("Error signing in. Please try again.or try with vit email id ");
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