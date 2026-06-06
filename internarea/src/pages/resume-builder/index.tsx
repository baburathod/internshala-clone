import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';
import { useSelector } from 'react-redux';
import { selectuser } from '@/Feature/Userslice';
import { toast } from 'react-toastify';
import { FileText, CheckCircle, CreditCard, Download, Mail } from 'lucide-react';
import ProtectedRoute from '@/Components/ProtectedRoute';
import ResumeTemplate, { ResumeData } from '@/Components/ResumeTemplate';
import html2canvas from 'html2canvas';
import { loadRazorpay } from '@/utils/loadRazorpay';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';

const initialData: ResumeData = {
  personalDetails: { fullName: '', email: '', phone: '', linkedin: '', address: '', photo: '', profileSummary: '' },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  template: 'modern'
};

const ResumeBuilder: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector(selectuser);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ResumeData>(initialData);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);



  // --- Step 1: Form Handlers ---
  const handleNextToOTP = async () => {
    if (!user) return toast.error("Please login");
    if (!data.personalDetails.fullName || !data.personalDetails.email) {
      return toast.error("Name and Email are required");
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/resume/draft`, {
        uid: user.uid,
        ...data
      });
      setResumeId(res.data.resumeId);
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const addEducation = () => setData(prev => ({ ...prev, education: [...prev.education, { degree: '', institution: '', year: '' }] }));
  const addExperience = () => setData(prev => ({ ...prev, experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }] }));
  const addProject = () => setData(prev => ({ ...prev, projects: [...prev.projects, { title: '', description: '', link: '' }] }));
  const addCertification = () => setData(prev => ({ ...prev, certifications: [...prev.certifications, { name: '', issuer: '', year: '' }] }));
  const addSkill = (skill: string) => { if(skill) setData(prev => ({ ...prev, skills: [...prev.skills, skill] })) };

  // --- Step 2: OTP Handlers ---
  const handleVerifyOTP = async () => {
    if (!otp) return toast.error("Enter OTP");
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/resume/verify-otp`, { resumeId, otpCode: otp });
      toast.success("Email verified successfully");
      setStep(3);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // --- Step 3: Payment Handlers (Razorpay Test) ---
  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await loadRazorpay();
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you offline?");
        return;
      }
      
      const { data: orderData } = await axios.post(`${API_BASE_URL}/api/resume/create-order`, { resumeId });
      
      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: "INR",
        name: "Internshala Clone",
        description: "Resume Builder Pro",
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            await axios.post(`${API_BASE_URL}/api/resume/verify-payment`, {
              ...response,
              resumeId
            });
            toast.success("Payment successful!");
            setStep(4);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: data.personalDetails.fullName,
          email: data.personalDetails.email,
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  // --- Step 4: PDF & Upload ---
  const generateAndAttach = async () => {
    if (!pdfRef.current) return;
    setLoading(true);
    toast.info("Generating PDF... Please wait.");
    try {
      // 1. Generate PDF via html2canvas & jsPDF
      const canvas = await html2canvas(pdfRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Save locally
      pdf.save(`${data.personalDetails.fullName.replace(/\s+/g, '_')}_Resume.pdf`);

      // 2. Upload to Cloudinary (Mock via uploadService, but since Cloudinary needs File/Blob, we convert)
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], "resume.pdf", { type: "application/pdf" });
      
      const formData = new FormData();
      formData.append("file", file);
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dvwgixrbs";
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "internshala_clone";
      formData.append("upload_preset", uploadPreset); 
      
      let secureUrl = "https://example.com/mock-resume.pdf"; // Fallback
      try {
        if (cloudName !== "PLACEHOLDER") {
          const cloudRes = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData);
          secureUrl = cloudRes.data.secure_url;
        }
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed (using mock URL):", cloudErr);
      }

      // 3. Attach to Profile
      await axios.put(`${API_BASE_URL}/api/resume/attach`, { resumeId, resumeUrl: secureUrl });
      toast.success("Resume saved to your profile!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to process resume");
    } finally {
      setLoading(false);
    }
  };

  const downloadDocx = () => {
    if (!pdfRef.current) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + pdfRef.current.innerHTML + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${data.personalDetails.fullName.replace(/\s+/g, '_')}_Resume.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
    toast.success("DOCX generated successfully!");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Stepper */}
          <div className="flex justify-between items-center mb-8">
            {['Details', 'Verify Email', 'Payment', 'Download'].map((lbl, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step > idx + 1 ? <CheckCircle size={20} /> : idx + 1}
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase">{lbl}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            
            {/* STEP 1: Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center"><FileText className="mr-2 text-blue-600"/> {t('resume.title')}</h2>
                
                <div className="mb-6 border-b pb-4">
                  <h3 className="font-semibold text-lg mb-3">Select Template</h3>
                  <div className="flex space-x-4">
                    {['modern', 'corporate', 'ats'].map(tpl => (
                      <button
                        key={tpl}
                        onClick={() => setData({ ...data, template: tpl })}
                        className={`px-4 py-2 rounded-lg font-medium border-2 transition ${data.template === tpl ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        {tpl.charAt(0).toUpperCase() + tpl.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name *" className="border p-3 rounded" value={data.personalDetails.fullName} onChange={e => setData({...data, personalDetails: {...data.personalDetails, fullName: e.target.value}})} />
                  <input type="email" placeholder="Email Address *" className="border p-3 rounded" value={data.personalDetails.email} onChange={e => setData({...data, personalDetails: {...data.personalDetails, email: e.target.value}})} />
                  <input type="text" placeholder="Phone Number" className="border p-3 rounded" value={data.personalDetails.phone} onChange={e => setData({...data, personalDetails: {...data.personalDetails, phone: e.target.value}})} />
                  <input type="text" placeholder="LinkedIn URL" className="border p-3 rounded" value={data.personalDetails.linkedin} onChange={e => setData({...data, personalDetails: {...data.personalDetails, linkedin: e.target.value}})} />
                  <input type="text" placeholder="Address" className="border p-3 rounded col-span-1 md:col-span-2" value={data.personalDetails.address} onChange={e => setData({...data, personalDetails: {...data.personalDetails, address: e.target.value}})} />
                  <input type="text" placeholder="Photo URL" className="border p-3 rounded" value={data.personalDetails.photo} onChange={e => setData({...data, personalDetails: {...data.personalDetails, photo: e.target.value}})} />
                </div>
                <textarea placeholder="Profile Summary" rows={3} className="border p-3 rounded w-full" value={data.personalDetails.profileSummary} onChange={e => setData({...data, personalDetails: {...data.personalDetails, profileSummary: e.target.value}})} />

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{t('resume.education')}</h3>
                    <button onClick={addEducation} className="text-sm text-blue-600 font-medium">+ Add</button>
                  </div>
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                      <input type="text" placeholder="Degree" className="border p-2 rounded text-sm" value={edu.degree} onChange={e => { const newEdu = [...data.education]; newEdu[idx].degree = e.target.value; setData({...data, education: newEdu}) }} />
                      <input type="text" placeholder="Institution" className="border p-2 rounded text-sm" value={edu.institution} onChange={e => { const newEdu = [...data.education]; newEdu[idx].institution = e.target.value; setData({...data, education: newEdu}) }} />
                      <input type="text" placeholder="Year" className="border p-2 rounded text-sm" value={edu.year} onChange={e => { const newEdu = [...data.education]; newEdu[idx].year = e.target.value; setData({...data, education: newEdu}) }} />
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{t('resume.experience')}</h3>
                    <button onClick={addExperience} className="text-sm text-blue-600 font-medium">+ Add</button>
                  </div>
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
                      <input type="text" placeholder="Job Title" className="border p-2 rounded text-sm" value={exp.title} onChange={e => { const newExp = [...data.experience]; newExp[idx].title = e.target.value; setData({...data, experience: newExp}) }} />
                      <input type="text" placeholder="Company" className="border p-2 rounded text-sm" value={exp.company} onChange={e => { const newExp = [...data.experience]; newExp[idx].company = e.target.value; setData({...data, experience: newExp}) }} />
                      <input type="text" placeholder="Duration (e.g. 2020-2022)" className="border p-2 rounded text-sm col-span-2 md:col-span-1" value={exp.duration} onChange={e => { const newExp = [...data.experience]; newExp[idx].duration = e.target.value; setData({...data, experience: newExp}) }} />
                      <input type="text" placeholder="Short description" className="border p-2 rounded text-sm col-span-2 md:col-span-1" value={exp.description} onChange={e => { const newExp = [...data.experience]; newExp[idx].description = e.target.value; setData({...data, experience: newExp}) }} />
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">Projects</h3>
                    <button onClick={addProject} className="text-sm text-blue-600 font-medium">+ Add</button>
                  </div>
                  {data.projects.map((proj, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
                      <input type="text" placeholder="Project Title" className="border p-2 rounded text-sm" value={proj.title} onChange={e => { const newProj = [...data.projects]; newProj[idx].title = e.target.value; setData({...data, projects: newProj}) }} />
                      <input type="text" placeholder="Project Link" className="border p-2 rounded text-sm" value={proj.link} onChange={e => { const newProj = [...data.projects]; newProj[idx].link = e.target.value; setData({...data, projects: newProj}) }} />
                      <input type="text" placeholder="Description" className="border p-2 rounded text-sm col-span-2" value={proj.description} onChange={e => { const newProj = [...data.projects]; newProj[idx].description = e.target.value; setData({...data, projects: newProj}) }} />
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">Certifications</h3>
                    <button onClick={addCertification} className="text-sm text-blue-600 font-medium">+ Add</button>
                  </div>
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                      <input type="text" placeholder="Certification Name" className="border p-2 rounded text-sm" value={cert.name} onChange={e => { const newCert = [...data.certifications]; newCert[idx].name = e.target.value; setData({...data, certifications: newCert}) }} />
                      <input type="text" placeholder="Issuer" className="border p-2 rounded text-sm" value={cert.issuer} onChange={e => { const newCert = [...data.certifications]; newCert[idx].issuer = e.target.value; setData({...data, certifications: newCert}) }} />
                      <input type="text" placeholder="Year" className="border p-2 rounded text-sm" value={cert.year} onChange={e => { const newCert = [...data.certifications]; newCert[idx].year = e.target.value; setData({...data, certifications: newCert}) }} />
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 pb-4">
                  <h3 className="font-semibold text-lg mb-2">{t('resume.skills')}</h3>
                  <div className="flex space-x-2">
                    <input type="text" id="skillInput" placeholder="Add a skill" className="border p-2 rounded flex-1" onKeyDown={(e) => { if(e.key === 'Enter') { addSkill(e.currentTarget.value); e.currentTarget.value = ''; } }} />
                    <button onClick={() => { const input = document.getElementById('skillInput') as HTMLInputElement; addSkill(input.value); input.value = ''; }} className="bg-gray-200 px-4 py-2 rounded font-medium">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {data.skills.map((s, i) => <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{s}</span>)}
                  </div>
                </div>

                <button onClick={handleNextToOTP} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
                  {loading ? "Saving..." : t('resume.save')}
                </button>
              </div>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 2 && (
              <div className="text-center py-10">
                <Mail className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
                <p className="text-gray-600 mb-6">We've sent a 6-digit code to {data.personalDetails.email}</p>
                <input type="text" maxLength={6} placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} className="border-2 border-gray-300 p-3 rounded-lg text-center text-2xl tracking-widest w-64 mb-6 focus:border-blue-500 focus:outline-none" />
                <button onClick={handleVerifyOTP} disabled={loading} className="block w-full max-w-xs mx-auto bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div className="text-center py-10">
                <CreditCard className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Premium Resume Unlock</h2>
                <p className="text-gray-600 mb-6">Pay a one-time fee of ₹50 to download and attach your resume.</p>
                <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-8 max-w-sm mx-auto border border-green-200">
                  <p className="font-semibold">Razorpay Test Mode</p>
                  <p className="text-sm">Use test credentials. No real money will be charged.</p>
                </div>
                <button onClick={handlePayment} disabled={loading} className="w-full max-w-xs mx-auto bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 flex items-center justify-center">
                  {loading ? "Processing..." : t('resume.pay')}
                </button>
              </div>
            )}

            {/* STEP 4: Success & Download */}
            {step === 4 && (
              <div className="text-center py-10">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-8">Your resume is ready. Download it as a PDF and attach it to your profile.</p>
                
                {/* Hidden container for PDF generation */}
                <div className="overflow-hidden h-0 w-0 absolute opacity-0 left-[-9999px]">
                  <div ref={pdfRef}>
                    <ResumeTemplate data={data} />
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <button onClick={generateAndAttach} disabled={loading} className="w-full max-w-xs mx-auto bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                    {loading ? "Processing..." : <><Download size={20} /> <span>{t('resume.download')} PDF</span></>}
                  </button>
                  <button onClick={downloadDocx} disabled={loading} className="w-full max-w-xs mx-auto bg-white text-blue-600 border border-blue-600 font-bold py-3 rounded-lg hover:bg-blue-50 flex items-center justify-center space-x-2">
                    <Download size={20} /> <span>Download DOCX</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ResumeBuilder;
