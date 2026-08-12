import Link from "next/link";
import { FiArrowRight, FiTarget, FiEye, FiUsers } from "react-icons/fi";

export const metadata = {
  title: "About | EduTrack",
  description: "Learn more about EduTrack",
};

const VALUES = [
  { icon: FiTarget, title: "Our Mission", text: "Make education management simple, accessible, and effective for every institution." },
  { icon: FiEye, title: "Our Vision", text: "Connect students, teachers, and administrators on one seamless platform." },
  { icon: FiUsers, title: "Our Community", text: "Thousands of educators and learners growing together every day." },
];

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-950">
      <section className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">About EduTrack</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            EduTrack is an all-in-one learning management platform built to help schools and universities
            manage assignments, track progress, and keep everyone on the same page.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <value.icon className="h-10 w-10 text-blue-600" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{value.title}</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{value.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-lg bg-gray-50 dark:bg-gray-900 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Want to learn more?</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Get in touch with our team today.</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Us
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}