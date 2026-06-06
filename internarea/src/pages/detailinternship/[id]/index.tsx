import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  X,
  Briefcase,
  Building,
  Users,
  Info,
  CheckCircle,
  Share2,
  Bookmark
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../firebase/firebase";
// export const internships = [
//   {
//     _id: "1",
//     title: "Frontend Developer Intern",
//     company: "Tech Innovators",
//     location: "Remote",
//     stipend: "$500/month",
//     Duration: "3 Months",
//     StartDate: "March 15, 2025",
//     aboutCompany:
//       "Tech Innovators is a leading software development company specializing in modern web applications.",
//     aboutJob:
//       "As a Frontend Developer Intern, you will work on real-world projects using React.js and Tailwind CSS.",
//     Whocanapply:
//       "Students and fresh graduates with knowledge of HTML, CSS, JavaScript, and React.js.",
//     perks: "Certificate, Letter of Recommendation, Flexible Work Hours",
//     AdditionalInfo: "This is a remote internship with flexible working hours.",
//     numberOfopning: "2",
//   },
//   {
//     _id: "2",
//     title: "Backend Developer Intern",
//     company: "Cloud Systems",
//     location: "San Francisco",
//     stipend: "$800/month",
//     Duration: "4 Months",
//     StartDate: "April 1, 2025",
//     aboutCompany:
//       "Cloud Systems focuses on scalable backend solutions and cloud-based applications.",
//     aboutJob:
//       "As a Backend Developer Intern, you will work with Node.js, Express, and MongoDB.",
//     Whocanapply:
//       "Students with experience in backend technologies and databases.",
//     perks: "Certificate, Networking Opportunities, Paid Internship",
//     AdditionalInfo: "A strong foundation in databases is required.",
//     numberOfopning: "3",
//   },
//   {
//     _id: "3",
//     title: "UI/UX Designer Intern",
//     company: "Creative Minds",
//     location: "New York",
//     stipend: "$600/month",
//     Duration: "6 Months",
//     StartDate: "May 10, 2025",
//     aboutCompany:
//       "Creative Minds is a design agency focused on user experience and interface design.",
//     aboutJob:
//       "As a UI/UX Designer Intern, you will work with Figma, Adobe XD, and design systems.",
//     Whocanapply:
//       "Students passionate about designing intuitive user experiences.",
//     perks: "Mentorship, Hands-on Projects, Letter of Recommendation",
//     AdditionalInfo: "A portfolio is required for application.",
//     numberOfopning: "1",
//   },
// ];

const index = () => {
  const router = useRouter();
  const { id } = router.query;
  const [internshipData,setinternship]=useState<any>([])
  useEffect(()=>{
    const fetchdata=async()=>{
      try {
        const res=await axios.get( `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/internship/${id}`)     
        setinternship(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchdata()
  },[id])
  const [availability, setAvailability] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const user=useSelector(selectuser)
  if (!internshipData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const handlesubmitapplication=async()=>{
    if(!coverLetter.trim()){
      toast.error("please write a cover letter")
      return
    }
    if(!availability){
      toast.error("please select your availability")
      return
    }
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }
      
      const applicationdata={
        category:internshipData.category,
        company:internshipData.company,
        coverLetter:coverLetter,
        user:user,
        Application:id,
        availability
      }
      await axios.post(
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/application",
        applicationdata,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Application submit successfully");
      router.push("/userapplication");
    } catch (error) {
      console.error(error)
      toast.error("Failed to submit application")
    }
  }

  const handleAuthRedirect = async () => {
    try {
      await signInWithPopup(auth, provider);
      setIsAuthModalOpen(false);
      toast.success("Successfully authenticated. You can now apply!");
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b bg-gradient-to-r from-blue-50 to-white">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2 text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
              <ArrowUpRight className="h-4 w-4" />
              <span>Actively Hiring</span>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => user ? toast.success("Internship saved!") : setIsAuthModalOpen(true)} className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition">
                <Bookmark className="h-5 w-5" />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button onClick={() => user ? toast.success("Link copied to clipboard!") : setIsAuthModalOpen(true)} className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition">
                <Share2 className="h-5 w-5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 mb-6">
            <div className="h-20 w-20 bg-white rounded-lg shadow-sm border flex items-center justify-center text-3xl font-bold text-blue-600">
              {internshipData.company?.charAt(0) || 'C'}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                {internshipData.title}
              </h1>
              <p className="text-xl text-gray-700 font-medium">{internshipData.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <DollarSign className="h-4 w-4 mr-1" /> Stipend
              </div>
              <span className="font-semibold text-gray-900">{internshipData.stipend}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" /> Duration
              </div>
              <span className="font-semibold text-gray-900">{internshipData.duration || "3 Months"}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <Briefcase className="h-4 w-4 mr-1" /> Work Mode
              </div>
              <span className="font-semibold text-gray-900">{internshipData.location?.toLowerCase().includes("remote") ? "Remote" : "In-Office"}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="h-4 w-4 mr-1" /> Location
              </div>
              <span className="font-semibold text-gray-900">{internshipData.location}</span>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> Start Date: <span className="ml-1 font-medium">{internshipData.startDate}</span>
            </div>
            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Apply By: <span className="ml-1 font-medium">Within 30 Days</span>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center">
              <Users className="h-4 w-4 mr-1" /> Openings: <span className="ml-1 font-medium">{internshipData.numberOfOpening || 1}</span>
            </div>
            <div className="text-gray-500 px-3 py-1 flex items-center">
              Posted: {internshipData.createdAt?.split('T')[0] || "Recently"}
            </div>
          </div>
        </div>

        {/* Company Section */}
        <div className="p-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Building className="h-6 w-6 mr-2 text-blue-600" /> About {internshipData.company}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-500 uppercase font-semibold">Industry</p>
              <p className="font-medium text-gray-900">Technology / IT</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-500 uppercase font-semibold">Company Size</p>
              <p className="font-medium text-gray-900">50-200 Employees</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-500 uppercase font-semibold">Headquarters</p>
              <p className="font-medium text-gray-900">{internshipData.location}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-500 uppercase font-semibold">Founded</p>
              <p className="font-medium text-gray-900">2015</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">{internshipData.aboutCompany}</p>
          <a href="#" className="inline-flex items-center space-x-1 text-blue-600 font-medium hover:text-blue-800 transition">
            <span>Visit Company Website</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Internship Details Section */}
        <div className="p-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Info className="h-6 w-6 mr-2 text-blue-600" /> Internship Details
          </h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Overview & Responsibilities</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{internshipData.aboutInternship}</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Assist the senior development team with daily operational tasks.</li>
              <li>Collaborate closely with product managers and designers.</li>
              <li>Write clean, maintainable, and well-documented code.</li>
              <li>Participate in regular code reviews and agile sprints.</li>
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Eligibility & Qualifications</h3>
            <p className="text-gray-700 mb-4">{internshipData.whoCanApply}</p>
            <div className="flex flex-wrap gap-2">
              {['B.Tech / B.E.', 'Computer Science', 'Pre-final Year Students', 'Recent Graduates'].map(skill => (
                <span key={skill} className="bg-gray-100 border text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['Communication', 'Problem Solving', 'Teamwork', 'Analytical Thinking'].map(skill => (
                <span key={skill} className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Benefits & Perks</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Certificate of Completion', 
                'Letter of Recommendation', 
                'Flexible Work Hours', 
                'Pre-Placement Offer (PPO)', 
                '1-on-1 Mentorship', 
                'Global Networking'
              ].map(perk => (
                <div key={perk} className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{perk}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500 italic">Additional: {internshipData.perks}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Selection Process</h3>
            <div className="flex flex-col md:flex-row gap-4">
              {['Resume Screening', 'Online Assessment', 'Technical Interview', 'HR Discussion', 'Final Selection'].map((step, index) => (
                <div key={index} className="flex-1 flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-2 shadow-md">
                    {index + 1}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Content / Similar Internships */}
        <div className="p-8 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
          <p className="text-gray-700 mb-4">{internshipData.additionalInfo || "No additional information provided."}</p>
        </div>

        {/* Apply Button */}
        <div className="p-8 flex justify-center bg-white">
          <button
            onClick={() => {
              if (!user) {
                setIsAuthModalOpen(true);
              } else {
                setIsModalOpen(true);
              }
            }}
            className="bg-blue-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg transition duration-200"
          >
            Apply Now
          </button>
        </div>
      </div>
      
      {/* Auth Modal (Frontend Protection) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Authentication Required</h2>
            <p className="text-gray-600 mb-8 text-center leading-relaxed">
              Please login or register as a Candidate to apply for internships, save jobs, and access community features.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleAuthRedirect}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-bold shadow-md transition"
              >
                Login / Register
              </button>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 font-bold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Apply Modal */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Apply to {internshipData.company}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Resume Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Resume
                </h3>
                <p className="text-gray-600">
                  Your current resume will be submitted with the application
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cover Letter
                </h3>
                <p className="text-gray-600 mb-2">
                  Why should you be selected for this internship?
                </p>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Write your cover letter here..."
                ></textarea>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Availability
                </h3>
                <div className="space-y-3">
                  {[
                    "Yes, I am available to join immediately",
                    "No, I am currently on notice period",
                    "No, I will have to serve notice period",
                    "Other",
                  ].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name=""
                        id=""
                        value={option}
                        checked={availability === option}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                {user ? (
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700" onClick={handlesubmitapplication}>
                    Submit Application
                  </button>
                ) : (
                  <Link
                    href={`/`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Sign up to apply
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;
