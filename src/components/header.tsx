import { BACKEND_URL } from "@/app/dashboard/page";

import Link from "next/link";

export const FRONTEND_URL = `http://localhost:3000`

export const Header = () => {
  return (
    <nav className="flex w-full items-center justify-between bg-black border-t border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-lg font-bold md:text-2xl text-white">Vertex AI</h1>
      </div>

      {/* Nav Links */}
      <div className="flex gap-6">
        <Link href={`${FRONTEND_URL}/watchlist`} className="text-white hover:text-violet-400 transition">Watchlist</Link>
        <Link href={`${FRONTEND_URL}/dashboard`} className="text-white hover:text-violet-400 transition">AI Chat</Link>
        <Link href={`${FRONTEND_URL}/marketoverview`} className="text-white hover:text-violet-400 transition">Market</Link>
        <Link href={`${FRONTEND_URL}/stock`} className="text-white hover:text-violet-400 transition">Stock</Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        

        {/* Auth Buttons */}
        <button className="w-24 rounded-lg bg-violet-600 px-6 py-2 font-medium text-white transition-all duration-300 hover:bg-violet-700 md:w-28">
          Signup
        </button>
        <button className="w-24 rounded-lg border border-white px-6 py-2 font-medium text-white transition-all duration-300 hover:bg-white hover:text-black md:w-28">
          Signin
        </button>
      </div>
    </nav>
  );
};
