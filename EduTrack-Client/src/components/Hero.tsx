"use client";

import Link from "next/link";
import { FiArrowRight, FiBookOpen, FiCheckCircle, FiClipboard, FiTrendingUp } from "react-icons/fi";

const STATS = [
  { value: "2,500+", label: "Active Students" },
  { value: "180+", label: "Courses" },
  { value: "95%", label: "Satisfaction Rate" },
  { value: "120+", label: "Expert Teachers" },
];

const FEATURES = [
  {
    icon: FiClipboard,
    title: "Smart Assignments",
    description: "Create, distribute, and grade assignments digitally with automatic progress tracking and deadlines.",
  },
  {
    icon: FiBookOpen,
    title: "Learning Library",
    description: "Access a rich library of lessons, resources, and study materials curated by subject experts.",
  },
  {
    icon: FiTrendingUp,
    title: "Progress Analytics",
    description: "Monitor student performance in real time with insightful dashboards, charts, and reports.",
  },
];

export default function Hero() {
  return (
    <>
      {/* ===== Banner / Hero ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 40%, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium">
              <FiCheckCircle className="h-4 w-4" />
              Streamline your institute with EduTrack
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              The all-in-one platform for modern education
            </h1>
            <p className="mt-6 text-lg text-blue-100 leading-relaxed max-w-2xl">
              Manage students, teachers, assignments, and results in one beautiful place. EduTrack gives your
              institution everything it needs to connect, collaborate, and succeed.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Get Started Free
                <FiArrowRight />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/15 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <dl className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/15">
              {STATS.map((stat) => (
                <div key={stat.label} className="py-8 text-center">
                  <dt className="text-sm text-blue-100">{stat.label}</dt>
                  <dd className="mt-1 text-3xl font-bold text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ===== Feature sections ===== */}
      <section className="bg-white py-20 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Everything your institute needs
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Powerful tools designed to simplify teaching, learning, and administration.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-shadow"
              >
                <feature.icon className="h-10 w-10 text-blue-600" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}