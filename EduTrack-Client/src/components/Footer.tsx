"use client";

import Link from "next/link";
import { FaGraduationCap, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaGithub } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const FOOTER_LINKS = {
  Platform: [
    { name: "Assignments", path: "/assignments" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Get Started", path: "/signup" },
    { name: "Sign In", path: "/signin" },
  ],
  Company: [
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
    { name: "Support", path: "/support" },
  ],
  Legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ],
};

const SOCIALS = [
  { icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
  { icon: FaTwitter, label: "Twitter", href: "https://twitter.com" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { icon: FaGithub, label: "GitHub", href: "https://github.com" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <FaGraduationCap className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl text-white tracking-tight">EduTrack</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed max-w-sm">
              Empowering educational institutions with a modern platform to manage students, teachers, and
              assignments from a single dashboard.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <FiMail className="text-blue-500" />
                <a href="mailto:hello@edutrack.com" className="hover:text-white transition-colors">hello@edutrack.com</a>
              </p>
              <p className="flex items-center gap-2">
                <FiPhone className="text-blue-500" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">+1 (234) 567-890</a>
              </p>
              <p className="flex items-center gap-2">
                <FiMapPin className="text-blue-500" />
                123 Education St, Knowledge City
              </p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{heading}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.path} className="hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} EduTrack. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}