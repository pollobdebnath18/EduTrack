"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

export default function AssignmentDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    startDate: "",
    deadline: "",
    maxMarks: 100,
    status: "Draft",
  });

  // Deleting state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchAssignment = async () => {
      try {
        const res = await api.get(`/assignments/${id}`);
        if (res.data.success) {
          setAssignment(res.data.data);
          
          // Pre-fill form data for editing
          const data = res.data.data;
          setFormData({
            title: data.title || "",
            description: data.description || "",
            subjectId: data.subject?.name || data.subjectId || "",
            startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : "",
            deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : "",
            maxMarks: data.maxMarks || 100,
            status: data.status || "Draft",
          });
        } else {
          setError("Assignment not found");
        }
      } catch (err: any) {
        console.error("Error fetching assignment", err);
        setError(err?.response?.data?.message || "Failed to load assignment details.");
      } finally {
        setLoading(false);
      }
    };
    
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

    fetchAssignment();
    fetchSubjects();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await api.delete(`/assignments/${id}`);
      if (res.data.success) {
        router.push("/assignments");
      }
    } catch (err: any) {
      console.error("Error deleting assignment", err);
      setError(err?.response?.data?.message || "Failed to delete assignment.");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxMarks" ? parseInt(value) || 0 : value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
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

      const res = await api.patch(`/assignments/${id}`, payload);
      if (res.data.success) {
        setAssignment(res.data.data); // Update the view with new data
        setIsEditing(false); // Switch back to view mode
        
        // Update local subject object just for view state if it changed
        if (existingSubject) {
          setAssignment((prev: any) => ({ ...prev, subject: existingSubject }));
        }
      }
    } catch (err: any) {
      console.error("Error updating assignment", err);
      setError(err?.response?.data?.message || err.message || "Failed to update assignment.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex justify-center items-center py-20">
        <p className="text-white text-lg animate-pulse">Loading assignment details...</p>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="bg-black min-h-screen pt-10 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/assignments" className="text-gray-400 hover:text-white flex items-center transition mb-8">
            <FaArrowLeft className="mr-2" /> Back to Assignments
          </Link>
          <div className="bg-red-900 border border-red-500 rounded-xl p-8 text-center">
            <FaExclamationCircle className="mx-auto text-5xl text-red-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading Assignment</h2>
            <p className="text-red-200">{error || "The assignment could not be found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white pt-10 pb-20 relative">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-4">
          <div className="bg-black border border-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-bold text-white">{assignment.title}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-white rounded-md hover:bg-gray-900 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition disabled:opacity-70"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/assignments" className="text-gray-400 hover:text-white flex items-center transition font-medium">
            <FaArrowLeft className="mr-2" /> Back to Assignments
          </Link>
          
          {!isEditing && (
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 border border-white rounded-md hover:bg-gray-900 transition font-medium"
              >
                <FaEdit className="mr-2" /> Update
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center px-4 py-2 bg-red-900 border border-red-700 text-red-200 rounded-md hover:bg-red-800 transition font-medium"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          )}
        </div>

        {error && isEditing && (
          <div className="bg-red-900 text-white p-4 rounded-md border border-red-500 mb-6">
            {error}
          </div>
        )}

        <div className="bg-black rounded-xl border border-white overflow-hidden shadow-2xl">
          
          {isEditing ? (
            /* ================= EDIT MODE ================= */
            <>
              <div className="px-6 py-5 border-b border-white">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <FaEdit className="mr-3" /> Edit Assignment
                </h1>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-white mb-1">Title *</label>
                    <input type="text" id="title" name="title" required value={formData.title} onChange={handleEditChange} className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition placeholder-gray-500" />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-white mb-1">Description</label>
                    <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleEditChange} className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition placeholder-gray-500" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="subjectId" className="block text-sm font-medium text-white mb-1">Subject *</label>
                      <input type="text" id="subjectId" name="subjectId" required value={formData.subjectId} onChange={handleEditChange} list="subjectsList" className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition placeholder-gray-500" />
                      <datalist id="subjectsList">
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.name} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-white mb-1">Status</label>
                      <select id="status" name="status" value={formData.status} onChange={handleEditChange} className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition">
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-white mb-1">Start Date</label>
                      <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleEditChange} className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition" style={{ colorScheme: "dark" }} />
                    </div>
                    <div>
                      <label htmlFor="deadline" className="block text-sm font-medium text-white mb-1">Deadline</label>
                      <input type="date" id="deadline" name="deadline" value={formData.deadline} onChange={handleEditChange} className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition" style={{ colorScheme: "dark" }} />
                    </div>
                    <div>
                      <label htmlFor="maxMarks" className="block text-sm font-medium text-white mb-1">Max Marks *</label>
                      <input type="number" id="maxMarks" name="maxMarks" required min="1" value={formData.maxMarks} onChange={handleEditChange} className="w-full px-4 py-2 bg-black border border-white rounded-md text-white focus:ring-1 focus:ring-white focus:outline-none transition" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white flex justify-end">
                  <button type="button" onClick={() => setIsEditing(false)} className="mr-3 px-6 py-2 border border-white rounded-md text-white hover:bg-gray-900 transition font-medium flex items-center">
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2 bg-white text-black border border-white rounded-md hover:bg-gray-200 transition flex items-center font-bold disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSaving ? "Saving..." : <><FaSave className="mr-2" /> Save Changes</>}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* ================= VIEW MODE ================= */
            <>
              {/* Header */}
              <div className="px-8 py-8 border-b border-white bg-gradient-to-b from-gray-900 to-black">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{assignment.title}</h1>
                    <div className="flex flex-wrap gap-3">
                      {assignment.subject && (
                        <span className="px-3 py-1 bg-gray-800 text-gray-200 text-sm font-semibold rounded-md border border-gray-700">
                          {assignment.subject.name}
                        </span>
                      )}
                      <span className={`px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-md border 
                        ${assignment.status === 'Published' ? 'bg-green-900 text-green-300 border-green-700' : 
                          assignment.status === 'Closed' ? 'bg-red-900 text-red-300 border-red-700' : 
                          'bg-yellow-900 text-yellow-300 border-yellow-700'}`}>
                        {assignment.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg flex flex-col items-center justify-center min-w-[120px]">
                    <span className="text-gray-400 text-sm uppercase tracking-widest mb-1">Max Marks</span>
                    <span className="text-3xl font-black text-white">{assignment.maxMarks}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Left Column (Main Content) */}
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">Description</h3>
                      <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
                        {assignment.description || "No detailed description provided for this assignment."}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Sidebar) */}
                  <div className="space-y-6">
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-5">
                      <h3 className="text-lg font-semibold text-white mb-4">Dates & Deadlines</h3>
                      
                      <div className="space-y-4">
                        {assignment.startDate && (
                          <div>
                            <span className="block text-sm text-gray-500 mb-1">Available From</span>
                            <div className="flex items-center text-gray-300">
                              <FaCalendarAlt className="mr-2 text-gray-400" />
                              {new Date(assignment.startDate).toLocaleString()}
                            </div>
                          </div>
                        )}
                        
                        {assignment.deadline ? (
                          <div>
                            <span className="block text-sm text-gray-500 mb-1">Due Date</span>
                            <div className="flex items-center text-gray-300 font-semibold">
                              <FaCalendarAlt className="mr-2 text-red-400" />
                              {new Date(assignment.deadline).toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 italic">No deadline set</span>
                        )}
                      </div>
                    </div>

                    {/* Simulated Action Area for future features */}
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-5">
                      <h3 className="text-lg font-semibold text-white mb-4">Your Submission</h3>
                      <div className="text-center py-6 border-2 border-dashed border-gray-700 rounded-lg mb-4">
                        <p className="text-gray-400 text-sm">You haven't submitted anything yet.</p>
                      </div>
                      <button className="w-full py-2.5 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors flex justify-center items-center">
                        <FaCheckCircle className="mr-2" /> Start Submission
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
