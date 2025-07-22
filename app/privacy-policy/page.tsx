import Link from "next/link"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Privacy Policy | AlienShipper",
  description: "AlienShipper's Privacy Policy details how we collect, use, and protect your data.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 prose prose-lg max-w-3xl text-gray-700">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6">Privacy Policy</h1>
          <p className="text-lg">Last updated: July 21, 2025</p>

          <p>AlienShipper ("us", "we", or "our") operates the alienshipper.com website (the "Service").</p>
          <p>
            This page informs you of our policies regarding the collection, use, and disclosure of personal data when
            you use our Service and the choices you have associated with that data.
          </p>
          <p>
            We use your data to provide and improve the Service. By using the Service, you agree to the collection and
            use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms
            used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from
            alienshipper.com.
          </p>

          <h2 className="text-3xl font-bold text-navy mt-10 mb-4">Information Collection And Use</h2>
          <p>
            We collect several different types of information for various purposes to provide and improve our Service to
            you.
          </p>

          <h3 className="text-2xl font-bold text-navy mt-8 mb-3">Types of Data Collected</h3>

          <h4 className="text-xl font-semibold text-navy mt-6 mb-2">Personal Data</h4>
          <p>
            While using our Service, we may ask you to provide us with certain personally identifiable information that
            can be used to contact or identify you ("Personal Data"). Personally identifiable information may include,
            but is not limited to:
          </p>
          <ul>
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Address, State, Province, ZIP/Postal code, City</li>
            <li>Cookies and Usage Data</li>
          </ul>

          <h4 className="text-xl font-semibold text-navy mt-6 mb-2">Usage Data</h4>
          <p>
            We may also collect information how the Service is accessed and used ("Usage Data"). This Usage Data may
            include information such as your computer's Internet Protocol address (e.g. IP address), browser type,
            browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on
            those pages, unique device identifiers and other diagnostic data.
          </p>

          <h4 className="text-xl font-semibold text-navy mt-6 mb-2">Tracking & Cookies Data</h4>
          <p>
            We use cookies and similar tracking technologies to track the activity on our Service and hold certain
            information.
          </p>
          <p>
            Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are
            sent to your browser from a website and stored on your device. Tracking technologies also used are beacons,
            tags, and scripts to collect and track information and to improve and analyze our Service.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if
            you do not accept cookies, you may not be able to use some portions of our Service.
          </p>

          <h2 className="text-3xl font-bold text-navy mt-10 mb-4">Use of Data</h2>
          <p>AlienShipper uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>

          <h2 className="text-3xl font-bold text-navy mt-10 mb-4">Disclosure Of Data</h2>
          <p>We may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
          <ul>
            <li>To comply with a legal obligation</li>
            <li>To protect and defend the rights or property of AlienShipper</li>
            <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>To protect the personal safety of users of the Service or the public</li>
            <li>To protect against legal liability</li>
          </ul>

          <h2 className="text-3xl font-bold text-navy mt-10 mb-4">Security Of Data</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet,
            or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to
            protect your Personal Data, we cannot guarantee its absolute security.
          </p>

          <h2 className="text-3xl font-bold text-navy mt-10 mb-4">Service Providers</h2>
          <p>
            We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to
            provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our
            Service is used.
          </p>
          <p>
            These third parties have access to your Personal Data only to perform these tasks on our behalf and are
            obligated not to disclose or use it for any other purpose.
          </p>

          <h2 className="text-3xl font-bold text-navy mt-10 mb-4">Links To Other Sites</h2>
          <p>
            Our Service may contain links to other sites that are not operated by us. If you click on a third party
            link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy
            of every site you visit.
          </p>
          <p>
            We have no control over and assume no responsibility for the content, privacy policies or practices of any
            third party sites or services.
          </p>

          <h2 className="text-3xl font-bold text-navy mt-10 mb-4">Children's Privacy</h2>
          <p>Our Service does not address anyone under the age of 18 ("Children").</p>
          <p>
            We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are
            a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact
            us. If we become aware that we have collected Personal Data from children without verification of parental
            consent, we take steps to remove that information from our servers.
          </p>

          <h2 className="text-3xl font-bold text-navy mt-10 mb-4">Changes To This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page.
          </p>
          <p>
            We will let you know via email and/or a prominent notice on our Service, prior to the change becoming
            effective and update the "last updated" date at the top of this Privacy Policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
            are effective when they are posted on this page.
          </p>

          <h2 className="text-3xl font-bold text-navy mt-10 mb-4">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li>By email: support@alienshipper.com</li>
            <li>
              By visiting this page on our website:{" "}
              <Link href="/contact" className="text-gold hover:underline">
                alienshipper.com/contact
              </Link>
            </li>
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
