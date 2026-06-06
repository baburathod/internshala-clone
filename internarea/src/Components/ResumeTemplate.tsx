import React from 'react';

export interface ResumeData {
  personalDetails: { fullName: string; email: string; phone: string; linkedin: string; address: string; photo: string; profileSummary: string };
  education: { degree: string; institution: string; year: string }[];
  experience: { title: string; company: string; duration: string; description: string }[];
  skills: string[];
  projects: { title: string; description: string; link: string }[];
  certifications: { name: string; issuer: string; year: string }[];
}

interface ResumeTemplateProps {
  data: ResumeData;
}

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ data }) => {
  return (
    <div id="resume-template" className="bg-white text-black p-10 w-[800px] mx-auto font-sans" style={{ minHeight: '1120px' }}>
      {/* Header */}
      <div className="flex items-center border-b-2 border-gray-800 pb-4 mb-6">
        {data.personalDetails.photo && (
          <img src={data.personalDetails.photo} alt="Profile" className="w-24 h-24 rounded-full mr-6 object-cover border-2 border-gray-300" />
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase">{data.personalDetails.fullName || "Your Name"}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            {data.personalDetails.email && <span>{data.personalDetails.email}</span>}
            {data.personalDetails.phone && <span>• {data.personalDetails.phone}</span>}
            {data.personalDetails.address && <span>• {data.personalDetails.address}</span>}
            {data.personalDetails.linkedin && <span>• {data.personalDetails.linkedin}</span>}
          </div>
        </div>
      </div>

      {/* Profile Summary */}
      {data.personalDetails.profileSummary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 uppercase border-b border-gray-300 pb-1 mb-2">Profile Summary</h2>
          <p className="text-sm text-gray-700">{data.personalDetails.profileSummary}</p>
        </div>
      )}

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase border-b border-gray-300 pb-1 mb-4">Experience</h2>
        {data.experience.length > 0 ? data.experience.map((exp, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
              <span className="text-sm font-medium text-gray-500">{exp.duration}</span>
            </div>
            <div className="text-md font-medium text-blue-600 mb-1">{exp.company}</div>
            <p className="text-sm text-gray-700">{exp.description}</p>
          </div>
        )) : (
          <p className="text-gray-400 italic">No experience added.</p>
        )}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase border-b border-gray-300 pb-1 mb-4">Education</h2>
        {data.education.length > 0 ? data.education.map((edu, idx) => (
          <div key={idx} className="mb-3">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
              <span className="text-sm font-medium text-gray-500">{edu.year}</span>
            </div>
            <div className="text-md text-gray-700">{edu.institution}</div>
          </div>
        )) : (
          <p className="text-gray-400 italic">No education added.</p>
        )}
      </div>

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 uppercase border-b border-gray-300 pb-1 mb-4">Projects</h2>
          {data.projects.map((proj, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{proj.title}</h3>
                {proj.link && <a href={proj.link} className="text-sm font-medium text-blue-500">View Project</a>}
              </div>
              <p className="text-sm text-gray-700">{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 uppercase border-b border-gray-300 pb-1 mb-4">Certifications</h2>
          {data.certifications.map((cert, idx) => (
            <div key={idx} className="mb-2 flex justify-between items-baseline">
              <div>
                <span className="font-semibold text-gray-900">{cert.name}</span>
                <span className="text-gray-600 ml-2">— {cert.issuer}</span>
              </div>
              <span className="text-sm text-gray-500">{cert.year}</span>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase border-b border-gray-300 pb-1 mb-4">Skills</h2>
        {data.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm font-medium border border-gray-200">
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No skills added.</p>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplate;
