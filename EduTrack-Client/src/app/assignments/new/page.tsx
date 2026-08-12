"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function CreateAssignment() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    startDate: "",
    deadline: "",
    maxMarks: 100,
    status: "Draft",
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        if (res.data.success) {
          setSubjects(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching subjects", err);
      }
    };
    fetchSubjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxMarks" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let finalSubjectId = formData.subjectId;

      // Check if user entered an existing subject name or ID
      const existingSubject = subjects.find(
        (s) => s.id === finalSubjectId || s.name.toLowerCase() === formData.subjectId.toLowerCase()
      );

      if (existingSubject) {
        finalSubjectId = existingSubject.id;
      } else {
        // Create new subject automatically
        const subjectRes = await api.post("/subjects", { 
          name: formData.subjectId, 
          description: "Auto-created subject" 
        });
        
        if (subjectRes.data.success) {
          finalSubjectId = subjectRes.data.data.id;
        } else {
          throw new Error("Failed to create the new subject.");
        }
      }

      const payload = {
        ...formData,
        subjectId: finalSubjectId,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      };

      const res = await api.post("/assignments", payload);
      if (res.data.success) {
        router.push("/assignments");
      }
    } catch (err: any) {
      console.error("Error creating assignment", err);
      setError(err?.response?.data?.message || err.message || "Failed to create assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white pt-10 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/assignments" className="text-gray-300 hover:text-white flex items-center transition">
            <FaArrowLeft className="mr-2" /> Back to Assignments
          </Link>
        </div>

        <div className="bg-black rounded-xl border border-white overflow-hidden">
          <div className="px-6 py-5 border-b border-white">
            <h1 className="text-2xl font-bold text-white">Create New Assignment</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-900 text-white p-4 rounded-md border border-white">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition placeholder-gray-500"
                  placeholder="e.g., Midterm Essay"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition placeholder-gray-500"
                  placeholder="Detailed instructions..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="subjectId" className="block text-sm font-medium text-white mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subjectId"
                    name="subjectId"
                    required
                    value={formData.subjectId}
                    onChange={handleChange}
                    list="subjectsList"
                    className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition placeholder-gray-500"
                    placeholder="Type or select a subject"
                  />
                  <datalist id="subjectsList">
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.name} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-white mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-white mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition"
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-white mb-1">
                    Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition"
                    style={{ colorScheme: "dark" }}
                  />
                </div>

                <div>
                  <label htmlFor="maxMarks" className="block text-sm font-medium text-white mb-1">
                    Max Marks *
                  </label>
                  <input
                    type="number"
                    id="maxMarks"
                    name="maxMarks"
                    required
                    min="1"
                    value={formData.maxMarks}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white flex justify-end">
              <Link
                href="/assignments"
                className="mr-3 px-6 py-2 border border-white rounded-md text-white bg-black hover:bg-gray-900 transition font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-white text-black border border-white rounded-md hover:bg-gray-200 transition flex items-center font-bold disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Assignment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
