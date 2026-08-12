import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduTrack - Assignment & Submission Management",
  description: "A simple platform for managing assignments and submissions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <footer className="bg-white border-t py-8 text-center text-gray-500 text-sm mt-auto">
          <p>&copy; {new Date().getFullYear()} EduTrack. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
