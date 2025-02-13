"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "./components/header"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <section id="hero" className="min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <h1 className="shine-title mb-12 p-6 bg-black rounded-lg text-8xl sm:text-9xl border-gradient">IEEE CS</h1>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/questions">
              <Button className="bg-[#f4b41a] text-black hover:bg-[#e8b974] text-xl px-8 py-6">Manage Questions</Button>
            </Link>
            <Link href="/domains">
              <Button className="bg-[#f4b41a] text-black hover:bg-[#e8b974] text-xl px-8 py-6">Manage Domains</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

