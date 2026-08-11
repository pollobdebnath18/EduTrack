/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiChevronDown, FiUser, FiSettings, FiLogOut, FiLayout } from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
// import Logo from "../assets/edutrack.jpg";
// Mock Authentication State (replace with actual auth context when available)
const MOCK_AUTH = {
  isAuthenticated: false, // Set to true to see authenticated state
  user: {
    name: "John Doe",
    role: "Teacher", // Admin, Teacher, Student
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random"
  }
};

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Assignments", path: "/assignments" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);

    setDropdownOpen(false);
  }, [pathname]);

  const getDashboardPath = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '/admin/dashboard';
      case 'teacher': return '/teacher/dashboard';
      case 'student': return '/student/dashboard';
      default: return '/dashboard';
    }
  };

  const handleLogout = () => {
    // Implement actual logout logic here
    console.log("Logged out");
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <FaGraduationCap className="h-8 w-8 text-blue-600 transition-transform group-hover:scale-110" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">EduTrack</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-medium transition-colors ${pathname === link.path
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth/Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {!MOCK_AUTH.isAuthenticated ? (
              <>
                <Link href="/signin" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    className="h-8 w-8 rounded-full border border-gray-200"
                    src={MOCK_AUTH.user.avatar}
                    alt={MOCK_AUTH.user.name}
                  />
                  <span className="text-sm font-medium text-gray-700">{MOCK_AUTH.user.name}</span>
                  <FiChevronDown className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 transition-all">
                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FiUser className="mr-3 h-4 w-4 text-gray-400" />
                      Profile
                    </Link>
                    <Link href={getDashboardPath(MOCK_AUTH.user.role)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FiLayout className="mr-3 h-4 w-4 text-gray-400" />
                      Dashboard
                    </Link>
                    <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FiSettings className="mr-3 h-4 w-4 text-gray-400" />
                      Settings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut className="mr-3 h-4 w-4 text-red-400" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white" ref={mobileMenuRef}>
          <div className="pt-2 pb-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`block pl-4 pr-4 py-2 border-l-4 text-base font-medium ${pathname === link.path
                  ? "bg-blue-50 border-blue-600 text-blue-700"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 pb-3 border-t border-gray-100">
            {!MOCK_AUTH.isAuthenticated ? (
              <div className="flex flex-col space-y-2 px-4">
                <Link
                  href="/signin"
                  className="block text-center w-full px-4 py-2 text-base font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block text-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex items-center px-4 mb-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full border border-gray-200"
                      src={MOCK_AUTH.user.avatar}
                      alt={MOCK_AUTH.user.name}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{MOCK_AUTH.user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{MOCK_AUTH.user.role}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <Link
                    href={getDashboardPath(MOCK_AUTH.user.role)}
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
