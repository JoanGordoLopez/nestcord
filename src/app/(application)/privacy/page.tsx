"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowLeft, Moon, Sun } from "lucide-react"

export default function PrivacyPolicy() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem("ApplicationTheme") as "light" | "dark" | null
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    setTheme(savedTheme || (systemPrefersDark ? "dark" : "light"))

    // Apply theme class to document
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("ApplicationTheme", newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/nestcord-logo.webp" alt="Nestcord" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold hidden sm:inline dark:text-white">Nestcord</span>
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
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-indigo-500 hover:underline gap-1 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400">Last Updated: May 05, 2025</p>
        </div>

        <div className="prose prose-blue max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300">
          <section className="mb-8">
            <h2 className="font-bold">1. Introduction</h2>
            <p>
              This Privacy Policy explains how Nestcord Inc. (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, uses, and discloses
              information about you when you use our services, including our website at nestcord.com and our mobile
              application (collectively, the &quot;Services&quot;).
            </p>
            <p className="mt-2">
              By using our Services, you agree to the collection, use, and disclosure of your information as described
              in this Privacy Policy. If you do not agree with our policies and practices, do not use our Services. If
              you have any questions about this Privacy Policy, please contact us at privacy@nestcord.vercel.app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">2. Information We Collect</h2>
            <p>We collect several types of information from and about users of our Services, including:</p>
            <h3 className="font-bold">2.1 Information You Provide to Us</h3>
            <ul className="list-disc list-inside">
              <li className="mb-2">
                <strong>Account Information:</strong> When you register for an account, we collect your name, email
                address, username, password, and profile information.
              </li>
              <li className="mb-2">
                <strong>User Content:</strong> We collect the content, communications, and other information you provide
                when you use our Services, including when you sign up for an account, create or share content, and
                message or communicate with others.
              </li>
              <li className="mb-2">
                <strong>Payment Information:</strong> If you make purchases through our Services, we collect payment
                information, including your credit card number, billing address, and other payment details. We use
                third-party payment processors who collect and process this information on our behalf.
              </li>
              <li className="mb-2">
                <strong>Communications:</strong> We collect information when you contact us for customer support or
                otherwise communicate with us.
              </li>
            </ul>

            <h3 className="font-bold">2.2 Information We Collect Automatically</h3>
            <ul className="list-disc list-inside">
              <li className="mb-2">
                <strong>Usage Information:</strong> We collect information about your activity on our Services, such as
                the content you view, the features you use, the actions you take, and the time, frequency, and duration
                of your activities.
              </li>
              <li className="mb-2">
                <strong>Device Information:</strong> We collect information about the device you use to access our
                Services, including the hardware model, operating system and version, unique device identifiers, and
                mobile network information.
              </li>
              <li className="mb-2">
                <strong>Location Information:</strong> We may collect information about your location, including precise
                location data if you allow us to do so through your device settings. We may also infer your approximate
                location from your IP address.
              </li>
              <li className="mb-2">
                <strong>Log Information:</strong> We collect log information when you use our Services, including your
                IP address, browser type, access times, pages viewed, and the page you visited before navigating to our
                Services.
              </li>
              <li className="mb-2">
                <strong>Cookies and Similar Technologies:</strong> We use cookies and similar technologies to collect
                information about your browsing behavior and preferences. For more information about our use of these
                technologies, see Section 5 below.
              </li>
            </ul>

            <h3 className="font-bold">2.3 Information We Collect from Third Parties</h3>
            <ul className="list-disc list-inside">
              <li className="mb-2">
                <strong>Social Media Platforms:</strong> If you choose to link our Services to a social media platform
                or log in to our Services using your social media account, we may collect information from that social
                media platform, including your profile information and friends list, in accordance with the
                authorization procedures determined by the social media platform.
              </li>
              <li className="mb-2">
                <strong>Third-Party Services:</strong> We may receive information about you from third-party services,
                such as analytics providers and advertising partners.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including to:</p>
            <ul className="list-disc list-inside">
              <li className="mb-2">Provide, maintain, and improve our Services;</li>
              <li className="mb-2">
                Process transactions and send related information, including confirmations, receipts, and user
                experience surveys;
              </li>
              <li className="mb-2">Send you technical notices, updates, security alerts, and support and administrative messages;</li>
              <li className="mb-2">Respond to your comments, questions, and requests, and provide customer service;</li>
              <li className="mb-2">
                Communicate with you about products, services, offers, promotions, and events, and provide other news or
                information about us and our partners;
              </li>
              <li className="mb-2">Monitor and analyze trends, usage, and activities in connection with our Services;</li>
              <li className="mb-2">
                Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the
                rights and property of Nestcord Inc. and others;
              </li>
              <li className="mb-2">
                Personalize and improve the Services and provide content, features, or advertisements that match your
                interests and preferences;
              </li>
              <li className="mb-2">Facilitate contests, sweepstakes, and promotions and process and deliver entries and rewards;</li>
              <li className="mb-2">Carry out any other purpose described to you at the time the information was collected.</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 md:px-6 py-8 border-t border-gray-200 dark:border-gray-800">
        <nav className="flex flex-wrap gap-x-6 gap-y-3 justify-center text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/home" className="hover:underline">
            Appplicatioon
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="/policy" className="hover:underline">
            Privacy Policy
          </Link>
          <span>© 2024 Nestcord.</span>
        </nav>
      </footer>
    </main>
  )
}