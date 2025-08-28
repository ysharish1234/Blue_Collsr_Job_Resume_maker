import jsPDF from 'jspdf';

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

export const generatePDF = (resumeData: ResumeData): void => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text(resumeData.personal.name || 'Your Name', 105, yPosition, { align: 'center' });
  yPosition += 10;

  // Contact info
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const contactInfo = [];
  if (resumeData.personal.phone) contactInfo.push(resumeData.personal.phone);
  if (resumeData.personal.email) contactInfo.push(resumeData.personal.email);
  if (resumeData.personal.address) contactInfo.push(resumeData.personal.address);

  if (contactInfo.length > 0) {
    doc.text(contactInfo.join(' | '), 105, yPosition, { align: 'center' });
    yPosition += 7;
  }

  if (resumeData.personal.languages.length > 0) {
    doc.text(`Languages: ${resumeData.personal.languages.join(', ')}`, 105, yPosition, { align: 'center' });
    yPosition += 10;
  }

  // Line separator
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;

  // Work Experience
  if (resumeData.experience.length > 0) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('WORK EXPERIENCE', 20, yPosition);
    yPosition += 8;

    resumeData.experience.forEach(job => {
      if (job.title || job.company) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        if (job.title) {
          doc.text(job.title, 20, yPosition);
          if (job.duration) {
            doc.text(job.duration, 190, yPosition, { align: 'right' });
          }
          yPosition += 6;
        }

        if (job.company) {
          doc.setFont(undefined, 'normal');
          doc.text(job.company, 20, yPosition);
          yPosition += 6;
        }

        if (job.duties) {
          doc.setFontSize(10);
          const dutiesLines = doc.splitTextToSize(`• ${job.duties}`, 170);
          doc.text(dutiesLines, 20, yPosition);
          yPosition += dutiesLines.length * 4;
        }

        if (job.tools) {
          const toolsLines = doc.splitTextToSize(`• Tools & Equipment: ${job.tools}`, 170);
          doc.text(toolsLines, 20, yPosition);
          yPosition += toolsLines.length * 4;
        }

        yPosition += 5;
      }
    });
  }

  // Skills
  if (resumeData.skills.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('SKILLS', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const skillsText = resumeData.skills.map(skill => `• ${skill}`).join('\n');
    const skillsLines = doc.splitTextToSize(skillsText, 170);
    doc.text(skillsLines, 20, yPosition);
    yPosition += skillsLines.length * 4 + 5;
  }

  // Education
  if (resumeData.education.length > 0) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('EDUCATION', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    resumeData.education.forEach(edu => {
      doc.text(`• ${edu}`, 20, yPosition);
      yPosition += 5;
    });
  }

  // Save the PDF
  const fileName = resumeData.personal.name
    ? `${resumeData.personal.name.replace(/\s+/g, '_')}_Resume.pdf`
    : 'My_Resume.pdf';
  doc.save(fileName);
};