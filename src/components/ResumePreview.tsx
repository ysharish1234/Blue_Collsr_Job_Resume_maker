import { FileText, Download } from "lucide-react";
import { Button } from "./ui/button";

interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  languages: string[];
}

interface Experience {
  type: string;
  title: string;
  company: string;
  duration: string;
  duties: string;
  tools: string;
}

interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  skills: string[];
  education: string[];
}

interface ResumePreviewProps {
  resumeData: ResumeData;
  onDownload: () => void;
  canDownload: boolean;
}

export const ResumePreview = ({ resumeData, onDownload, canDownload }: ResumePreviewProps) => {
  const renderPreview = () => {
    let hasContent = false;
    
    return (
      <div className="bg-card rounded-lg p-4 text-gray-800 text-sm min-h-48 max-h-64 overflow-y-auto">
        {/* Header */}
        {resumeData.personal.name && (
          <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{resumeData.personal.name}</h1>
            
            {(() => {
              const contactInfo = [];
              if (resumeData.personal.phone) contactInfo.push(resumeData.personal.phone);
              if (resumeData.personal.email) contactInfo.push(resumeData.personal.email);
              if (resumeData.personal.address) contactInfo.push(resumeData.personal.address);
              
              hasContent = true;
              
              return contactInfo.length > 0 ? (
                <p className="text-gray-600 mt-2">{contactInfo.join(' | ')}</p>
              ) : null;
            })()}
            
            {resumeData.personal.languages.length > 0 && (
              <p className="text-gray-600 mt-1">
                <strong>Languages:</strong> {resumeData.personal.languages.join(', ')}
              </p>
            )}
          </div>
        )}
        
        {/* Work Experience */}
        {resumeData.experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 mb-2">WORK EXPERIENCE</h2>
            {resumeData.experience.map((job, index) => {
              if (job.title || job.company) {
                hasContent = true;
                return (
                  <div key={index} className="mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        {job.title && <h3 className="font-semibold text-gray-800">{job.title}</h3>}
                        {job.company && <p className="text-gray-600">{job.company}</p>}
                      </div>
                      {job.duration && <span className="text-gray-500 text-sm">{job.duration}</span>}
                    </div>
                    
                    {job.duties && (
                      <p className="text-gray-700 mt-1">• {job.duties}</p>
                    )}
                    {job.tools && (
                      <p className="text-gray-700 mt-1">• Tools & Equipment: {job.tools}</p>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
        
        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 mb-2">SKILLS</h2>
            <div className="grid grid-cols-2 gap-1">
              {resumeData.skills.map((skill, index) => {
                hasContent = true;
                return (
                  <p key={index} className="text-gray-700">• {skill}</p>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Education */}
        {resumeData.education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 mb-2">EDUCATION</h2>
            {resumeData.education.map((edu, index) => {
              hasContent = true;
              return (
                <p key={index} className="text-gray-700">• {edu}</p>
              );
            })}
          </div>
        )}
        
        {!hasContent && (
          <div className="text-center text-gray-400 py-8">
            <FileText className="w-16 h-16 mx-auto mb-2" />
            <p>Your resume will appear here as we build it together</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-card-foreground font-semibold mb-4 flex items-center">
        <FileText className="mr-2 text-success w-5 h-5" />
        Resume Preview
      </h3>
      
      {renderPreview()}
      
      <Button
        onClick={onDownload}
        disabled={!canDownload}
        className="w-full mt-4 gradient-secondary rounded-lg font-semibold"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Resume (PDF)
      </Button>
    </div>
  );
};