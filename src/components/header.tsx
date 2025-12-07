import { BACKEND_URL } from "@/app/dashboard/page";
import sitelogo from "@/logo.png";
import Image from "next/image";
import Link from "next/link";

export const FRONTEND_URL = `http://localhost:3000`;

export const Header = () => {
  return (
    <nav className="flex w-full items-center justify-between bg-black border-t border-b border-neutral-200 px-6 py-4 dark:border-neutral-800 backdrop-blur-md">
      {/* Logo Section */}
      <Link href={`${FRONTEND_URL}/`}>
      <div className="flex items-center gap-3">
        <Image 
          src={sitelogo} 
          alt="Vertex AI Logo" 
          width={40} 
          height={40}
          className="object-contain"
        />
        <h1 className="text-lg font-bold md:text-2xl text-white">Vertex AI</h1>
      </div>
      </Link>

      {/* Nav Links */}
      <div className="flex gap-10">
        <Link href={`${FRONTEND_URL}/watchlist`} className="text-white hover:text-violet-400 transition">
          Watchlist
        </Link>
        <Link href={`${FRONTEND_URL}/dashboard`} className="text-white hover:text-violet-400 transition">
          AI Chat
        </Link>
        <Link href={`${FRONTEND_URL}/marketoverview`} className="text-white hover:text-violet-400 transition">
          Market
        </Link>
        <Link href={`${FRONTEND_URL}/stock`} className="text-white hover:text-violet-400 transition">
          Stock
        </Link>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
          AV
        </div>
        <span className="text-white font-medium">Aryan</span>
      </div>
    </nav>
  );
};