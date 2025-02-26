"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";


export default function Header() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="bg-black text-white border-b border-yellow-400">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
            <Image
              src="/ieee cs.png"
              alt="IEEE-CS Logo"
              width={120}
              height={40}
              className="mr-4"
            />
            </div>

          <div className="text-2xl font-bold tracking-wider text-yellow-400">ADMIN PORTAL</div>

          <nav className="flex items-center space-x-4">
            <Link href="/" className="text-white hover:text-yellow-400 transition-colors">
              HOME
            </Link>
            <Link href="/questions" className="text-white hover:text-yellow-400 transition-colors">
              QUESTIONS
            </Link>
            <Link href="/domains" className="text-white hover:text-yellow-400 transition-colors">
              DOMAINS
            </Link>
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500" onClick={handleLogout}>
              Signout
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
