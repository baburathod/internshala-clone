import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Book,
  Calendar,
  Cat,
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
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../firebase/firebase";
// const filteredJobs = [
//     {
//       _id: "101",
//       title: "Frontend Developer",
//       company: "Amazon",
//       location: "Seattle",
//       CTC: "$100K/year",
//       Experience: "2+ years",
//       category: "Engineering",
//       StartDate: "April 1, 2025",
//       aboutCompany:
//         "Amazon is a global leader in e-commerce and cloud computing, providing cutting-edge technology solutions.",
//       aboutJob:
//         "Seeking a skilled Frontend Developer proficient in React.js, JavaScript, and UI development.",
//       Whocanapply:
//         "Developers with experience in JavaScript, React.js, and modern frontend frameworks.",
//       perks:
//         "Remote work, stock options, health insurance, learning resources.",
//       AdditionalInfo: "This role is hybrid with occasional onsite meetings.",
//       numberOfopning: "3",
//     },
//     {
//       _id: "102",
//       title: "Data Analyst",
//       company: "Microsoft",
//       location: "Remote",
//       CTC: "$90K/year",
//       Experience: "1+ years",
//       category: "Data Science",
//       StartDate: "March 15, 2025",
//       aboutCompany:
//         "Microsoft is a technology company specializing in software development, cloud computing, and AI.",
//       aboutJob:
//         "Looking for a Data Analyst with expertise in SQL, Python, and data visualization tools.",
//       Whocanapply:
//         "Candidates with experience in data analytics, SQL, Python, and Tableau/Power BI.",
//       perks: "Flexible hours, remote work, upskilling programs, bonuses.",
//       AdditionalInfo: "This is a fully remote role.",
//       numberOfopning: "2",
//     },
//     {
//       _id: "103",
//       title: "UX Designer",
//       company: "Apple",
//       location: "California",
//       CTC: "$110K/year",
//       Experience: "3+ years",
//       category: "Design",
//       StartDate: "March 30, 2025",
//       aboutCompany:
//         "Apple is a leader in consumer electronics and software, focusing on design and innovation.",
//       aboutJob:
//         "Seeking a UX Designer to craft intuitive user experiences for our next-generation products.",
//       Whocanapply:
//         "Designers with experience in Figma, Adobe XD, user research, and usability testing.",
//       perks:
//         "Creative environment, free lunches, fitness perks, flexible hours.",
//       AdditionalInfo: "Office-based with occasional remote work options.",
//       numberOfopning: "1",
//     },
//     {
//       _id: "104",
//       title: "Backend Developer",
//       company: "NextGen Solutions",
//       location: "Austin, TX",
//       CTC: "$90,000 - $110,000",
//       Experience: "3-5 years",
//       category: "Engineering",
//       StartDate: "March 20, 2025",
//       aboutCompany:
//         "NextGen Solutions specializes in building scalable backend systems and APIs for high-performance applications.",
//       aboutJob:
//         "Looking for a Backend Developer skilled in Node.js, Express.js, and database management.",
//       Whocanapply:
//         "Developers with experience in server-side programming, databases (SQL, NoSQL), and RESTful APIs.",
//       perks: "Stock options, remote work, gym membership, yearly bonuses.",
//       AdditionalInfo: "Hybrid role with 2 days of in-office meetings per week.",
//       numberOfopning: "3",
//     },
//     {
//       _id: "105",
//       title: "UI/UX Designer",
//       company: "Design Pro",
//       location: "San Francisco, CA",
//       CTC: "$70,000 - $85,000",
//       Experience: "2+ years",
//       category: "Design",
//       StartDate: "March 25, 2025",
//       aboutCompany:
//         "Design Pro is an award-winning UI/UX design agency focusing on innovative user experiences.",
//       aboutJob:
//         "We need a UI/UX Designer who can create user-friendly interfaces and improve the user experience of our applications.",
//       Whocanapply:
//         "Designers with proficiency in Figma, Adobe XD, and user research methodologies.",
//       perks:
//         "Creative workspace, wellness programs, free team lunches, flexible hours.",
//       AdditionalInfo: "Office-based with flexible working hours.",
//       numberOfopning: "1",
//     },
//   ];
const index = () => {
  const user=useSelector(selectuser)
  const router = useRouter();
  const { id } = router.query;
  const [jobdata, setjob] = useState<any>([]);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/job/${id}`);
        setjob(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, [id]);

  const [availability, setAvailability] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  if (!jobdata) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const handlesubmitapplication = async () => {
    if (!coverLetter.trim()) {
      toast.error("please write a cover letter");
      return;
    }
    if (!availability) {
      toast.error("please select your availability");
      return;
    }
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const applicationdata = {
        category: jobdata.category,
        company: jobdata.company,
        coverLetter: coverLetter,
        user: user,
        Application: id,
        availability,
      };
      await axios.post(
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/application",
        applicationdata,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Application submit successfully");
      router.push("/userapplication");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit application");
    }
  };

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
              <button onClick={() => user ? toast.success("Job saved!") : setIsAuthModalOpen(true)} className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition">
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
              {jobdata.company?.charAt(0) || 'C'}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                {jobdata.title}
              </h1>
              <p className="text-xl text-gray-700 font-medium">{jobdata.company}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <DollarSign className="h-4 w-4 mr-1" /> Salary Range
              </div>
              <span className="font-semibold text-gray-900">{jobdata.CTC || "Not Disclosed"}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <Book className="h-4 w-4 mr-1" /> Experience
              </div>
              <span className="font-semibold text-gray-900">{jobdata.Experience || "Entry Level"}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <Briefcase className="h-4 w-4 mr-1" /> Work Mode
              </div>
              <span className="font-semibold text-gray-900">{jobdata.location?.toLowerCase().includes("remote") ? "Remote" : "In-Office"}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="h-4 w-4 mr-1" /> Location
              </div>
              <span className="font-semibold text-gray-900">{jobdata.location}</span>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> Category: <span className="ml-1 font-medium">{jobdata.category}</span>
            </div>
            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center">
              <Clock className="h-4 w-4 mr-1" /> Apply By: <span className="ml-1 font-medium">Within 30 Days</span>
            </div>
            <div className="text-gray-500 px-3 py-1 flex items-center">
              Posted: {jobdata.createAt?.split('T')[0] || "Recently"}
            </div>
          </div>
        </div>

        {/* Company Section */}
        <div className="p-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Building className="h-6 w-6 mr-2 text-blue-600" /> About {jobdata.company}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-500 uppercase font-semibold">Industry</p>
              <p className="font-medium text-gray-900">Technology / IT</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-500 uppercase font-semibold">Company Size</p>
              <p className="font-medium text-gray-900">100-500 Employees</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-500 uppercase font-semibold">Headquarters</p>
              <p className="font-medium text-gray-900">{jobdata.location}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-500 uppercase font-semibold">Founded</p>
              <p className="font-medium text-gray-900">2012</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">{jobdata.aboutCompany || "Leading innovation in our industry."}</p>
          <a href="#" className="inline-flex items-center space-x-1 text-blue-600 font-medium hover:text-blue-800 transition">
            <span>Visit Company Website</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Job Details Section */}
        <div className="p-8 border-b">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Info className="h-6 w-6 mr-2 text-blue-600" /> Job Information
          </h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Job Description & Responsibilities</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{jobdata.aboutJob}</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Design, build, and maintain efficient, reusable, and reliable code.</li>
              <li>Ensure the best possible performance, quality, and responsiveness of applications.</li>
              <li>Identify bottlenecks and bugs, and devise solutions to these problems.</li>
              <li>Help maintain code quality, organization, and automation.</li>
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Education & Experience Requirements</h3>
            <p className="text-gray-700 mb-4">{jobdata.whoCanApply}</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 border text-gray-700 px-3 py-1 rounded-md text-sm font-medium">Bachelor's Degree</span>
              <span className="bg-gray-100 border text-gray-700 px-3 py-1 rounded-md text-sm font-medium">{jobdata.Experience || "1+ Years"} Experience</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['Software Development', 'Problem Solving', 'Agile Methodology', 'Architecture Design'].map(skill => (
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
                'Comprehensive Health Insurance', 
                'Yearly Performance Bonuses', 
                'Flexible Work Schedule', 
                'Learning & Development Budget', 
                'Paid Time Off (PTO)', 
                'Career Growth Opportunities'
              ].map(perk => (
                <div key={perk} className="flex items-center text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{perk}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500 italic">Additional: {jobdata.perks}</p>
          </div>
        </div>

        {/* Additional Content / Similar Jobs */}
        <div className="p-8 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
          <p className="text-gray-700 mb-4">{jobdata.AdditionalInfo || "No additional information provided."}</p>
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
              Please login or register as a Candidate to apply for jobs, save jobs, and access community features.
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
                  Apply to {jobdata.company}
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
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    onClick={handlesubmitapplication}
                  >
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
