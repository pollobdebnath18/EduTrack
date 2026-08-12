import Link from "next/link";
import { FaGraduationCap, FaTasks, FaCheckCircle, FaLaptopCode, FaChartLine } from "react-icons/fa";

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-white pt-16">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Simplify Your Academic Workflow
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
            EduTrack provides a seamless platform for managing assignments and tracking progress. Built for modern education.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/assignments" className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition shadow-lg">
              View Assignments
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Extra Section 1 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-900 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
            <div className="py-6">
              <p className="text-4xl font-black text-white mb-2">10k+</p>
              <p className="text-gray-400 font-medium tracking-wide uppercase">Active Users</p>
            </div>
            <div className="py-6">
              <p className="text-4xl font-black text-white mb-2">50k+</p>
              <p className="text-gray-400 font-medium tracking-wide uppercase">Assignments Managed</p>
            </div>
            <div className="py-6">
              <p className="text-4xl font-black text-white mb-2">99.9%</p>
              <p className="text-gray-400 font-medium tracking-wide uppercase">Uptime Reliability</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black border-b border-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">How EduTrack Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center p-8 rounded-2xl bg-gray-950 border border-gray-800 hover:border-white transition group">
              <div className="bg-gray-900 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 group-hover:bg-white transition">
                <FaTasks className="h-8 w-8 text-white group-hover:text-black transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">1. Create Assignments</h3>
              <p className="text-gray-400 leading-relaxed">Easily publish new assignments with titles, descriptions, due dates, and dynamically linked subjects.</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gray-950 border border-gray-800 hover:border-white transition group">
              <div className="bg-gray-900 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 group-hover:bg-white transition">
                <FaLaptopCode className="h-8 w-8 text-white group-hover:text-black transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">2. Complete Work</h3>
              <p className="text-gray-400 leading-relaxed">Access assignments instantly on any device and keep track of impending deadlines and required materials.</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gray-950 border border-gray-800 hover:border-white transition group">
              <div className="bg-gray-900 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 group-hover:bg-white transition">
                <FaChartLine className="h-8 w-8 text-white group-hover:text-black transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">3. Track Progress</h3>
              <p className="text-gray-400 leading-relaxed">Review overall performance, assign grades, and provide constructive feedback to accelerate learning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-gray-400 mb-10">Join EduTrack today and streamline your assignment management.</p>
          <Link href="/signup" className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition shadow-2xl">
            Join For Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-black pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center text-white mb-4">
              <FaGraduationCap className="h-8 w-8 mr-2" />
              <span className="font-bold text-2xl tracking-tight">EduTrack</span>
            </Link>
            <p className="text-gray-500 max-w-sm">
              The premier platform for managing academic workflows, assignments, and structural progress in the modern educational era.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/assignments" className="text-gray-500 hover:text-white transition">Assignments</Link></li>
              <li><Link href="/pricing" className="text-gray-500 hover:text-white transition">Pricing</Link></li>
              <li><Link href="/features" className="text-gray-500 hover:text-white transition">Features</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-500 hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-900 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} EduTrack Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 text-gray-600">
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">GitHub</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
