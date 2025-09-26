import { BACKEND_URL } from "@/app/dashboard/page";
import ThemeToggle from "@/components/theme-toggle";
import { ArrowBigRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export const FRONTEND_URL = `http://localhost:3000`

export const Header = () => {
  return (
    <nav className="flex w-full items-center justify-between bg-black border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">Aceternity UI</h1>
      </div>
      <div>
        <button><Link href={`${FRONTEND_URL}/watchlist`}>Watchlist</Link></button>
        <button><Link href={`${FRONTEND_URL}/dashboard`}>Dashboard</Link></button>
        <button><Link href={`${FRONTEND_URL}/marketoverview`}>Market</Link></button>
        <button><Link href={`${FRONTEND_URL}/stock`}>Stock</Link></button>
        <button></button>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
          Signup
        </button>
        <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
          Signin
        </button>
      </div>
    </nav>
  );
};