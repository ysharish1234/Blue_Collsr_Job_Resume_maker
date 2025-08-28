export interface QuestionStep {
  question: string;
  next: string;
  category: 'personal' | 'work' | 'skills' | 'education';
}

export const questionFlow: Record<string, QuestionStep> = {
  name: {
    question: "What's your full name?",
    next: 'phone',
    category: 'personal'
  },
  phone: {
    question: "What's your phone number?",
    next: 'email',
    category: 'personal'
  },
  email: {
    question: "What's your email address? If you don't have one, just say 'no email'.",
    next: 'address',
    category: 'personal'
  },
  address: {
    question: "What's your address or which area do you live in?",
    next: 'languages',
    category: 'personal'
  },
  languages: {
    question: "What languages do you speak? For example: English, Spanish, Hindi, etc.",
    next: 'work_intro',
    category: 'personal'
  },
  work_intro: {
    question: "Now let's talk about your work experience. What kind of work do you do or have you done? For example: construction, delivery, factory work, etc.",
    next: 'work_details',
    category: 'work'
  },
  work_details: {
    question: "Tell me more about your most recent job. What was your job title and where did you work?",
    next: 'work_duration',
    category: 'work'
  },
  work_duration: {
    question: "How long did you work there? From when to when?",
    next: 'work_duties',
    category: 'work'
  },
  work_duties: {
    question: "What were your main duties and responsibilities in this job?",
    next: 'work_tools',
    category: 'work'
  },
  work_tools: {
    question: "What tools, machines, or equipment did you use in this job?",
    next: 'more_jobs',
    category: 'work'
  },
  more_jobs: {
    question: "Do you have any other previous jobs you'd like to add to your resume? Say 'yes' to add another job or 'no' to continue.",
    next: 'skills_intro',
    category: 'work'
  },
  skills_intro: {
    question: "Great! Now let's talk about your skills. What are you good at? This could be technical skills, soft skills, or certifications.",
    next: 'technical_skills',
    category: 'skills'
  },
  technical_skills: {
    question: "What technical skills do you have? For example: operating machinery, electrical work, plumbing, driving different vehicles, etc.",
    next: 'soft_skills',
    category: 'skills'
  },
  soft_skills: {
    question: "What soft skills do you have? For example: teamwork, leadership, problem-solving, communication, etc.",
    next: 'certifications',
    category: 'skills'
  },
  certifications: {
    question: "Do you have any certifications, licenses, or training? For example: driver's license, safety training, trade certifications, etc.",
    next: 'education',
    category: 'skills'
  },
  education: {
    question: "What's your education background? High school, trade school, college, or any other training?",
    next: 'complete',
    category: 'education'
  }
};