"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/database/client";
import { Button } from "@/components/ui/button";
import {
  Apple,
  ChartNoAxesColumn,
  Heart,
  MessageCircle,
  Moon,
  Sun,
} from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    setTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

    // Apply theme class to document
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSession = () => {
    const db = createClient();
    db.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/nestcord-logo.webp"
              alt="Nestcord"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span className="text-xl font-bold hidden sm:inline dark:text-white">
              Nestcord
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="h-5 w-5 text-gray-300" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16 gap-12">
        {/* Left Column - Hero Image/Illustration */}
        <div className="flex-1 flex items-center justify-center lg:justify-start">
          <div className="relative w-full max-w-md aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 w-full max-w-sm">
                {/* Header del post */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Image
                      src="/images/nestcord-logo.webp"
                      alt="Profile"
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      Nestcord
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      @nestcord • Less than a minute ago
                    </div>
                  </div>
                </div>

                {/* Contenido del post */}
                <div className="space-y-4">
                  <p className="text-gray-800 dark:text-gray-200">
                    Who else loves views like this? 👀{" "}
                    <span className="text-blue-500 dark:text-blue-300">
                      #NaturePhotography
                    </span>
                  </p>

                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                    <Image
                      src="/images/status-attachment.png"
                      alt="Post Image"
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Reacciones y respuestas */}
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-500 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">
                        <Heart className="h-4 w-4 " />
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                      102 Likes
                    </div>
                  </div>

                  {/* Botones de interacción */}
                  <div className="flex gap-4 text-gray-500 dark:text-gray-400 text-sm">
                    <button className="flex items-center gap-1 hover:text-blue-500">
                      <MessageCircle className="h-4 w-4" /> <span>69</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-red-500">
                      <Heart className="h-4 w-4 " /> <span>102</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500">
                      <ChartNoAxesColumn className="h-4 w-4" /> <span>391</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sign Up Form */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-md space-y-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                What&apos;s happening now?
              </h1>
              <p className="mt-3 text-xl text-gray-600 dark:text-gray-300">
                Join Nestcord today.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleSession}
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 hover:cursor-pointer border border-gray-300 text-gray-800 font-medium flex items-center justify-center gap-3 py-6 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path
                    fill="#4285F4"
                    d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
                  />
                </svg>
                Sign up with Google
              </Button>

              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-medium flex items-center justify-center gap-3 py-6 text-base dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 transition-colors"
                disabled={true}
              >
                <Apple className="w-5 h-5" />
                Sign up with Apple
              </Button>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  or
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>

              <Button
                variant="outline"
                disabled={true}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-6 text-base transition-colors"
              >
                Create account
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                By signing up, you agree to the{" "}
                <Link href="/terms" className="text-indigo-400 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/policy"
                  className="text-indigo-400 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="pt-4">
              <p className="text-base dark:text-white">
                Already have an account?
                <Button
                  onClick={handleSession}
                  variant="link"
                  className="text-indigo-500 hover:underline font-medium"
                >
                  Log In
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 md:px-6 py-8 border-t border-gray-200 dark:border-gray-800">
        <nav className="flex flex-wrap gap-x-6 gap-y-3 justify-center text-sm text-gray-500 dark:text-gray-400">
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <span>© 2025 Nestcord.</span>
        </nav>
      </footer>
    </main>
  );
}
