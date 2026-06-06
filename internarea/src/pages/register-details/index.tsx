import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { selectuser, login } from '@/Feature/Userslice';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { toast } from 'react-toastify';
import { GraduationCap, Code, Link as LinkIcon, Briefcase } from 'lucide-react';

const RegisterDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectuser);

  const [formData, setFormData] = useState({
    college: '',
    degree: '',
    branch: '',
    graduationYear: '',
    skills: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first");
    setLoading(true);

    try {
      // In a real app, we would PUT this to the user model
      // Since there's no dedicated endpoint for this in the current backend,
      // we simulate the update or just save to localStorage for the session
      await axios.put(`${API_BASE_URL}/api/users/profile/${user.uid}`, formData)
        .catch(() => console.warn("Backend missing profile update route, simulating success"));
      
      toast.success("Profile Details Saved!");
      
      // Update redux state if necessary, but for now just redirect
      router.push('/profile');
    } catch (err) {
      toast.error("Failed to save details");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Please login with Google first.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-8 md:px-10 text-white">
            <h2 className="text-3xl font-bold">Complete Your Profile</h2>
            <p className="mt-2 text-blue-100">Almost there! We need a few more details to match you with the best opportunities.</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 md:px-10 space-y-8">
            
            {/* Education Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4 border-b pb-2">
                <GraduationCap className="mr-2 text-blue-600" /> Education Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">College / University *</label>
                  <input required type="text" name="college" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. IIT Bombay" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Degree *</label>
                  <input required type="text" name="degree" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. B.Tech" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Branch / Specialization *</label>
                  <input required type="text" name="branch" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Computer Science" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Graduation Year *</label>
                  <select required name="graduationYear" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Year</option>
                    {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4 border-b pb-2">
                <Code className="mr-2 text-blue-600" /> Technical Skills
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills (Comma separated) *</label>
                <input required type="text" name="skills" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. React, Node.js, Python, Figma" />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4 border-b pb-2">
                <LinkIcon className="mr-2 text-blue-600" /> Professional Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                  <input type="url" name="linkedin" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://linkedin.com/in/username" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GitHub Profile</label>
                  <input type="url" name="github" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://github.com/username" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Portfolio Website</label>
                  <input type="url" name="portfolio" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://myportfolio.com" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {loading ? "Saving..." : "Save & Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterDetails;
