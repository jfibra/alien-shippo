import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/alien-shipper-logo.png"
              alt="AlienShipper Logo"
              width={150}
              height={40}
              className="h-auto w-auto"
            />
            <span className="sr-only">AlienShipper</span>
          </Link>
          <p className="text-sm text-stone-300">
            Discounted shipping rates for businesses and individuals with alien technology.
          </p>
          <div className="flex space-x-4">
            {/* Placeholder for social media icons */}
            <Link href="#" className="text-stone-300 hover:text-gold">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link href="#" className="text-stone-300 hover:text-gold">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.417-4.293 4.106 4.106 0 001.27 5.477A4.072 4.072 0 014 9.659v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
            <Link href="#" className="text-stone-300 hover:text-gold">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-stone-300">
            <li>
              <Link href="/features" className="hover:text-gold">
                Features
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-gold">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-gold">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gold">
                Integrations
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gold">
                API
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-stone-300">
            <li>
              <Link href="/support" className="hover:text-gold">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/faqs" className="hover:text-gold">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-stone-300">
            <li>
              <Link href="/about" className="hover:text-gold">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-gold">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="hover:text-gold">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gold">
                Careers
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 text-center text-sm text-stone-400 border-t border-stone-700 pt-8">
        <p>&copy; {new Date().getFullYear()} AlienShipper. All rights reserved.</p>
      </div>
    </footer>
  )
}
