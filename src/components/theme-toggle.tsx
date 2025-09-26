"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-24 transform rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 md:w-32 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}


