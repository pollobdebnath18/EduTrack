"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBookOpen, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{name: string} | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Assignments", href: "/assignments" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="bg-black border-b border-white fixed w-full z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-white">
              <FaBookOpen className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl tracking-tight text-white">EduTrack</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`${pathname === link.href ? "text-white font-bold border-b-2 border-white" : "text-gray-300 hover:text-white"} transition duration-150 py-2`}
              >
                {link.name}
              </Link>
            ))}

            {!isAuthenticated ? (
              <div className="flex space-x-4 ml-4">
                <Link href="/signin" className="text-gray-300 hover:text-white px-3 py-2 font-medium border border-transparent hover:border-white rounded-md transition">Sign In</Link>
                <Link href="/signup" className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-md font-bold transition">Get Started</Link>
              </div>
            ) : (
              <div className="relative ml-4">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
                >
                  <FaUserCircle className="h-8 w-8 text-gray-400" />
                  <span className="font-medium text-white">{user?.name}</span>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 border border-white">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-900">Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-900">Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
              {menuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.href ? "bg-gray-900 text-white border border-gray-800" : "text-gray-300 hover:bg-gray-900 hover:text-white"}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-800">
            {!isAuthenticated ? (
              <div className="px-4 flex flex-col space-y-2">
                <Link href="/signin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900">Sign In</Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-black bg-white hover:bg-gray-200 text-center">Get Started</Link>
              </div>
            ) : (
              <div className="px-4">
                <div className="flex items-center px-3 mb-3">
                  <FaUserCircle className="h-8 w-8 text-gray-400 mr-2" />
                  <span className="text-base font-medium text-white">{user?.name}</span>
                </div>
                <div className="space-y-1">
                  <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-900">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-900">Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
