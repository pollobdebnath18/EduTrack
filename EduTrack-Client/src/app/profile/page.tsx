"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaUserCircle, FaEnvelope, FaIdBadge, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="bg-black min-h-screen text-white pt-24 flex justify-center items-center">
        <p className="text-gray-400">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-gray-400 hover:text-white flex items-center transition font-medium">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>

        <div className="bg-black rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800"></div>
          
          <div className="px-8 pb-8 relative">
            {/* Avatar Profile */}
            <div className="absolute -top-16 bg-black p-2 rounded-full border border-gray-800">
              <FaUserCircle className="w-28 h-28 text-gray-500" />
            </div>
            
            {/* Action buttons area (placeholder for future edit capability) */}
            <div className="flex justify-end pt-4 mb-4">
              <button className="px-5 py-2 border border-gray-700 text-gray-300 rounded-full hover:bg-gray-900 hover:text-white transition font-medium text-sm">
                Edit Profile
              </button>
            </div>

            {/* Profile Info */}
            <div className="mt-2">
              <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
              <p className="text-gray-400 flex items-center mb-8">
                <FaIdBadge className="mr-2" />
                <span className="capitalize">{user.role?.toLowerCase() || "Student"}</span> Account
              </p>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">Account Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-950 border border-gray-900 p-5 rounded-xl">
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                      <FaEnvelope className="mr-2" /> Email Address
                    </p>
                    <p className="text-lg font-medium text-white break-all">{user.email}</p>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-900 p-5 rounded-xl">
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                      <FaIdBadge className="mr-2" /> User ID
                    </p>
                    <p className="text-lg font-mono text-gray-300">{user.id || "N/A"}</p>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-900 p-5 rounded-xl md:col-span-2">
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-1 flex items-center">
                      <FaCalendarAlt className="mr-2" /> Member Since
                    </p>
                    <p className="text-lg font-medium text-white">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric'
                      }) : "Recently Joined"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
