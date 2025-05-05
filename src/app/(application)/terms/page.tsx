"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowLeft, Moon, Sun } from "lucide-react"

export default function TermsOfService() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
          <p className="text-gray-500 dark:text-gray-400">Last Updated: May 05, 2025</p>
        </div>

        <div className="prose prose-blue max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300">
          <section className="mb-8">
            <h2 className="font-bold">1. Introduction</h2>
            <p>
              Welcome to Nestcord (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;). These Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) govern your use of our web pages located at
              nestcord.vercel.app and our mobile application Nestcord (together or individually &quot;Service&quot;) operated by Nestcord
              Inc.
            </p>
            <p className="mt-2">
              Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and
              disclose information that results from your use of our web pages. Please read it here:{" "}
              <Link href="/policy" className="text-indigo-500 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="mt-2">
              Your agreement with us includes these Terms and our Privacy Policy (&quot;Agreements&quot;). You acknowledge that
              you have read and understood Agreements, and agree to be bound by them.
            </p>
            <p className="mt-2">
              If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please
              let us know by emailing at support@nestcord.vercel.app so we can try to find a solution. These Terms apply to all
              visitors, users and others who wish to access or use Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">2. Communications</h2>
            <p>
              By creating an Account on our Service, you agree to subscribe to newsletters, marketing or promotional
              materials and other information we may send. However, you may opt out of receiving any, or all, of these
              communications from us by following the unsubscribe link or by emailing support@nestcord.vercel.app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">3. Purchases</h2>
            <p>
              If you wish to purchase any product or service made available through Service (&quot;Purchase&quot;), you may be
              asked to supply certain information relevant to your Purchase including, without limitation, your credit
              card number, the expiration date of your credit card, your billing address, and your shipping information.
            </p>
            <p>
              You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment
              method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct
              and complete.
            </p>
            <p>
              We reserve the right to refuse or cancel your order at any time for reasons including but not limited to:
              product or service availability, errors in the description or price of the product or service, error in
              your order or other reasons.
            </p>
            <p>
              We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is
              suspected.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">4. Subscriptions</h2>
            <p>
              Some parts of Service are billed on a subscription basis (&quot;Subscription(s)&quot;). You will be billed in
              advance on a recurring and periodic basis (&quot;Billing Cycle&quot;). Billing cycles are set either on a monthly or
              annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
            </p>
            <p>
              At the end of each Billing Cycle, your Subscription will automatically renew under the exact same
              conditions unless you cancel it or Nestcord Inc. cancels it. You may cancel your Subscription renewal
              either through your online account management page or by contacting Nestcord Inc. customer support team.
            </p>
            <p>
              A valid payment method, including credit card or PayPal, is required to process the payment for your
              subscription. You shall provide Nestcord Inc. with accurate and complete billing information including
              full name, address, state, zip code, telephone number, and a valid payment method information. By
              submitting such payment information, you automatically authorize Nestcord Inc. to charge all Subscription
              fees incurred through your account to any such payment instruments.
            </p>
            <p>
              Should automatic billing fail to occur for any reason, Nestcord Inc. will issue an electronic invoice
              indicating that you must proceed manually, within a certain deadline date, with the full payment
              corresponding to the billing period as indicated on the invoice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">5. Content</h2>
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, text,
              graphics, videos, or other material (&quot;Content&quot;). You are responsible for Content that you post on or
              through Service, including its legality, reliability, and appropriateness.
            </p>
            <p className="mt-2">
              By posting Content on or through Service, You represent and warrant that: (i) Content is yours (you own
              it) and/or you have the right to use it and the right to grant us the rights and license as provided in
              these Terms, and (ii) that the posting of your Content on or through Service does not violate the privacy
              rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We
              reserve the right to terminate the account of anyone found to be infringing on a copyright.
            </p>
            <p className="mt-2">
              You retain any and all of your rights to any Content you submit, post or display on or through Service and
              you are responsible for protecting those rights. We take no responsibility and assume no liability for
              Content you or any third party posts on or through Service. However, by posting Content using Service you
              grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and
              distribute such Content on and through Service. You agree that this license includes the right for us to
              make your Content available to other users of Service, who may also use your Content subject to these
              Terms.
            </p>
            <p className="mt-2">Nestcord Inc. has the right but not the obligation to monitor and edit all Content provided by users.</p>
            <p className="mt-2">
              In addition, Content found on or through this Service are the property of Nestcord Inc. or used with
              permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content,
              whether in whole or in part, for commercial purposes or for personal gain, without express advance written
              permission from us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">6. Prohibited Uses</h2>
            <p>
              You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:
            </p>
            <ol className="list-decimal list-inside">
              <li className="mb-2">In any way that violates any applicable national or international law or regulation.</li>
              <li className="mb-2">
                For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing
                them to inappropriate content or otherwise.
              </li>
              <li className="mb-2">
                To transmit, or procure the sending of, any advertising or promotional material, including any &quot;junk
                mail&quot;, &quot;chain letter&quot;, &quot;spam&quot;, or any other similar solicitation.
              </li>
              <li className="mb-2">
                To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person
                or entity.
              </li>
              <li className="mb-2">
                In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent,
                or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.
              </li>
              <li className="mb-2">
                To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of Service, or
                which, as determined by us, may harm or offend Company or users of Service or expose them to liability.
              </li>
            </ol>
            <p>Additionally, you agree not to:</p>
            <ol>
              <li className="mb-2">
                Use Service in any manner that could disable, overburden, damage, or impair Service or interfere with
                any other party&apos;s use of Service, including their ability to engage in real time activities through
                Service.
              </li>
              <li className="mb-2">
                Use any robot, spider, or other automatic device, process, or means to access Service for any purpose,
                including monitoring or copying any of the material on Service.
              </li>
              <li className="mb-2">
                Use any manual process to monitor or copy any of the material on Service or for any other unauthorized
                purpose without our prior written consent.
              </li>
              <li className="mb-2">Use any device, software, or routine that interferes with the proper working of Service.</li>
              <li className="mb-2">
                Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or
                technologically harmful.
              </li>
              <li className="mb-2">
                Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of Service, the
                server on which Service is stored, or any server, computer, or database connected to Service.
              </li>
              <li className="mb-2">Attack Service via a denial-of-service attack or a distributed denial-of-service attack.</li>
              <li className="mb-2">Take any action that may damage or falsify Company rating.</li>
              <li className="mb-2">Otherwise attempt to interfere with the proper working of Service.</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">7. Analytics</h2>
            <p>We may use third-party Service Providers to monitor and analyze the use of our Service.</p>
            <p className="mt-2">
              <strong>Vercel Analytics</strong>
            </p>
            <p className="mt-1">
              Vercel Analytics is a web analytics service offered by Vercel that tracks and reports website traffic.
              Vercel uses the data collected to track and monitor the use of our Service. This data is shared with other
              Vercel services. Vercel may use the collected data to contextualize and personalize the ads of its own
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">8. Intellectual Property</h2>
            <p>
              Service and its original content (excluding Content provided by users), features and functionality are and
              will remain the exclusive property of Nestcord Inc. and its licensors. Service is protected by copyright,
              trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress
              may not be used in connection with any product or service without the prior written consent of Nestcord
              Inc.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">9. Copyright Policy</h2>
            <p>
              We respect the intellectual property rights of others. It is our policy to respond to any claim that
              Content posted on Service infringes on the copyright or other intellectual property rights
              (&apos;Infringement&apos;) of any person or entity.
            </p>
            <p className="mt-2">
              If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work
              has been copied in a way that constitutes copyright infringement, please submit your claim via email to
              dmca@nestcord.com, with the subject line: &apos;Copyright Infringement&apos; and include in your claim a detailed
              description of the alleged Infringement as detailed below, under &apos;DMCA Notice and Procedure for Copyright
              Infringement Claims&apos;
            </p>
            <p className="mt-2">
              You may be held accountable for damages (including costs and attorneys&quot; fees) for misrepresentation or
              bad-faith claims on the infringement of any Content found on and/or through Service on your copyright.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="font-bold">10. Error Reporting and Feedback</h2>
            <p>
              You may provide us either directly at support@nestcord.com or via third party sites and tools with
              information and feedback concerning errors, suggestions for improvements, ideas, problems, complaints, and
              other matters related to our Service (&apos;Feedback&apos;). You acknowledge and agree that: (i) you shall not
              retain, acquire or assert any intellectual property right or other right, title or interest in or to the
              Feedback; (ii) Company may have development ideas similar to the Feedback; (iii) Feedback does not contain
              confidential information or proprietary information from you or any third party; and (iv) Company is not
              under any obligation of confidentiality with respect to the Feedback. In the event the transfer of the
              ownership to the Feedback is not possible due to applicable mandatory laws, you grant Company and its
              affiliates an exclusive, transferable, irrevocable, free-of-charge, sub-licensable, unlimited and
              perpetual right to use (including copy, modify, create derivative works, publish, distribute and
              commercialize) Feedback in any manner and for any purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">11. Links To Other Web Sites</h2>
            <p>
              Our Service may contain links to third party web sites or services that are not owned or controlled by
              Nestcord Inc.
            </p>
            <p className="mt-2">
              Nestcord Inc. has no control over, and assumes no responsibility for the content, privacy policies, or
              practices of any third party web sites or services. We do not warrant the offerings of any of these
              entities/individuals or their websites.
            </p>
            <p className="mt-2">
              YOU ACKNOWLEDGE AND AGREE THAT NESTCORD INC. SHALL NOT BE RESPONSIBLE OR LIABLE, DIRECTLY OR INDIRECTLY,
              FOR ANY DAMAGE OR LOSS CAUSED OR ALLEGED TO BE CAUSED BY OR IN CONNECTION WITH USE OF OR RELIANCE ON ANY
              SUCH CONTENT, GOODS OR SERVICES AVAILABLE ON OR THROUGH ANY SUCH THIRD PARTY WEB SITES OR SERVICES.
            </p>
            <p className="mt-2">
              WE STRONGLY ADVISE YOU TO READ THE TERMS OF SERVICE AND PRIVACY POLICIES OF ANY THIRD PARTY WEB SITES OR
              SERVICES THAT YOU VISIT.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">12. Disclaimer Of Warranty</h2>
            <p>
              THESE SERVICES ARE PROVIDED BY COMPANY ON AN &apos;AS IS&apos; AND &apos;AS AVAILABLE&apos; BASIS. COMPANY MAKES NO
              REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THEIR SERVICES, OR
              THE INFORMATION, CONTENT OR MATERIALS INCLUDED THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THESE
              SERVICES, THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM US IS AT YOUR SOLE RISK.
            </p>
            <p className="mt-2">
              NEITHER COMPANY NOR ANY PERSON ASSOCIATED WITH COMPANY MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT
              TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICES. WITHOUT
              LIMITING THE FOREGOING, NEITHER COMPANY NOR ANYONE ASSOCIATED WITH COMPANY REPRESENTS OR WARRANTS THAT THE
              SERVICES, THEIR CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL BE ACCURATE,
              RELIABLE, ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT THE SERVICES OR THE SERVER
              THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE SERVICES OR ANY
              SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
            </p>
            <p className="mt-2">
              COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE,
              INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR
              PARTICULAR PURPOSE.
            </p>
            <p className="mt-2">
              THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">13. Limitation Of Liability</h2>
            <p>
              EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS HARMLESS
              FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGE, HOWEVER IT ARISES (INCLUDING
              ATTORNEYS&quot; FEES AND ALL RELATED COSTS AND EXPENSES OF LITIGATION AND ARBITRATION, OR AT TRIAL OR ON
              APPEAL, IF ANY, WHETHER OR NOT LITIGATION OR ARBITRATION IS INSTITUTED), WHETHER IN AN ACTION OF CONTRACT,
              NEGLIGENCE, OR OTHER TORTIOUS ACTION, OR ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, INCLUDING
              WITHOUT LIMITATION ANY CLAIM FOR PERSONAL INJURY OR PROPERTY DAMAGE, ARISING FROM THIS AGREEMENT AND ANY
              VIOLATION BY YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS, STATUTES, RULES, OR REGULATIONS, EVEN IF COMPANY
              HAS BEEN PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE IS
              LIABILITY FOUND ON THE PART OF COMPANY, IT WILL BE LIMITED TO THE AMOUNT PAID FOR THE PRODUCTS AND/OR
              SERVICES, AND UNDER NO CIRCUMSTANCES WILL THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES. SOME STATES DO NOT
              ALLOW THE EXCLUSION OR LIMITATION OF PUNITIVE, INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE PRIOR
              LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold">14. Acknowledgement</h2>
            <p>
              BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF
              SERVICE AND AGREE TO BE BOUND BY THEM.
            </p>
          </section>

          <section>
            <h2 className="font-bold">15. Contact Us</h2>
            <p>Please send your feedback, comments, requests for technical support by email: support@nestcord.vercel.app.</p>
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
            Application
          </Link>
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
  )
}

