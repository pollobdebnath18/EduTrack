"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { FaPlus, FaCalendarAlt, FaBookOpen } from "react-icons/fa";

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/assignments");
        if (res.data.success) {
          setAssignments(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching assignments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Assignments</h1>
            <p className="text-gray-400 text-sm">Manage and review your course assignments.</p>
          </div>
          <Link href="/assignments/new" className="bg-white text-black px-5 py-2.5 rounded-md flex items-center hover:bg-gray-200 transition font-bold text-sm">
            <FaPlus className="mr-2" /> Create Assignment
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400 text-lg animate-pulse">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-20 border border-gray-800 rounded-xl bg-gray-900 bg-opacity-50">
            <FaBookOpen className="mx-auto text-4xl text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Assignments Found</h3>
            <p className="text-gray-400">Get started by creating your first assignment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map(assignment => (
              <div key={assignment.id} className="bg-black rounded-xl border border-white overflow-hidden hover:border-gray-300 transition-colors group flex flex-col h-full">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white line-clamp-2 pr-2">{assignment.title}</h3>
                    <span className={`flex-shrink-0 px-2.5 py-1 text-xs rounded-full font-bold uppercase tracking-wider
                      ${assignment.status === 'Published' ? 'bg-green-900 text-green-300 border border-green-700' : 
                        assignment.status === 'Closed' ? 'bg-red-900 text-red-300 border border-red-700' : 
                        'bg-yellow-900 text-yellow-300 border border-yellow-700'}`}>
                      {assignment.status}
                    </span>
                  </div>
                  
                  {assignment.subject && (
                    <div className="inline-block px-3 py-1 bg-gray-900 text-gray-300 text-xs font-semibold rounded-md mb-4 border border-gray-800">
                      {assignment.subject.name}
                    </div>
                  )}

                  <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                    {assignment.description || "No description provided."}
                  </p>
                  
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="font-semibold text-gray-300 w-24">Max Marks:</span>
                      <span>{assignment.maxMarks}</span>
                    </div>
                    {assignment.deadline && (
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="font-semibold text-gray-300 w-24">Due:</span>
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1.5 opacity-70" /> 
                          {new Date(assignment.deadline).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-800 bg-gray-950 mt-auto">
                  <Link href={`/assignments/${assignment.id}`} className="block w-full text-center bg-transparent hover:bg-white hover:text-black text-white font-medium py-2.5 rounded-md border border-white transition-all duration-200">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
