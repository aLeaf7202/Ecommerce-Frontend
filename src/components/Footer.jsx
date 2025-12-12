import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-indigo-400">Kenakata.com</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted online marketplace for quality products, seamless shopping, and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/" className="hover:text-indigo-400 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-indigo-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-indigo-400 transition">
                  Products
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-indigo-400 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-indigo-400 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/help" className="hover:text-indigo-400 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-indigo-400 transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="/shipping" className="hover:text-indigo-400 transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-indigo-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-indigo-400 transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="w-4 h-4 text-indigo-400" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="w-4 h-4 text-indigo-400" />
                <span>+880 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="w-4 h-4 text-indigo-400" />
                <span>support@kenakata.com</span>
              </li>
            </ul>
          </div>
        </div>

        
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Kenakata.com. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Made with <span className="text-red-500">heart</span> for seamless shopping
          </p>
        </div>
      </div>
    </footer>
  );
}