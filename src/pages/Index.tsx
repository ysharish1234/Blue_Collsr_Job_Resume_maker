import { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ChatInterface } from '@/components/ChatInterface';
import { ProgressCard } from '@/components/ProgressCard';
import { ResumePreview } from '@/components/ResumePreview';
import { TipsCard } from '@/components/TipsCard';
import { HelpModal } from '@/components/HelpModal';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { generatePDF } from '@/utils/resumeGenerator';
import { questionFlow } from '@/data/questionFlow';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { resumeService } from '@/services/resumeService';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

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

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState('name');
  const [showHelp, setShowHelp] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      name: '',
      phone: '',
      email: '',
      address: '',
      languages: []
    },
    experience: [],
    skills: [],
    education: []
  });

  const { speak, isEnabled: voiceEnabled, toggleEnabled: toggleVoice } = useTextToSpeech();
  
  const handleSpeechResult = useCallback((transcript: string) => {
    handleSendMessage(transcript);
  }, []);

  const { isListening, startListening, isSupported } = useSpeechRecognition(
    handleSpeechResult,
    (error) => {
      toast({
        title: "Speech Recognition Error",
        description: error,
        variant: "destructive"
      });
    }
  );

  // Calculate progress
  const calculateProgress = () => {
    let personalProgress = 0;
    let workProgress = 0;
    let skillsProgress = 0;

    // Personal info progress
    if (resumeData.personal.name) personalProgress += 20;
    if (resumeData.personal.phone) personalProgress += 20;
    if (resumeData.personal.email !== undefined) personalProgress += 20;
    if (resumeData.personal.address) personalProgress += 20;
    if (resumeData.personal.languages.length > 0) personalProgress += 20;

    // Work experience progress
    if (resumeData.experience.length > 0) {
      const job = resumeData.experience[0];
      if (job.type) workProgress += 20;
      if (job.title) workProgress += 20;
      if (job.duration) workProgress += 20;
      if (job.duties) workProgress += 20;
      if (job.tools) workProgress += 20;
    }

    // Skills progress
    skillsProgress = Math.min(100, (resumeData.skills.length / 5) * 100);

    const overall = Math.round((personalProgress + workProgress + skillsProgress) / 3);

    return {
      personal: personalProgress,
      work: workProgress,
      skills: Math.round(skillsProgress),
      overall
    };
  };

  const addMessage = (text: string, isUser = false) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);

    // Speak AI messages
    if (!isUser && voiceEnabled) {
      setTimeout(() => speak(text), 500);
    }
  };

  const processResponse = (response: string) => {
    const currentQuestion = questionFlow[currentStep];

    // Store the response based on current step
    switch (currentStep) {
      case 'name':
        setResumeData(prev => ({
          ...prev,
          personal: { ...prev.personal, name: response }
        }));
        break;
      case 'phone':
        setResumeData(prev => ({
          ...prev,
          personal: { ...prev.personal, phone: response }
        }));
        break;
      case 'email':
        setResumeData(prev => ({
          ...prev,
          personal: { 
            ...prev.personal, 
            email: response.toLowerCase() === 'no email' ? '' : response 
          }
        }));
        break;
      case 'address':
        setResumeData(prev => ({
          ...prev,
          personal: { ...prev.personal, address: response }
        }));
        break;
      case 'languages':
        setResumeData(prev => ({
          ...prev,
          personal: { 
            ...prev.personal, 
            languages: response.split(',').map(lang => lang.trim()) 
          }
        }));
        break;
      case 'work_intro':
        setResumeData(prev => ({
          ...prev,
          experience: [...prev.experience, {
            type: response,
            title: '',
            company: '',
            duration: '',
            duties: '',
            tools: ''
          }]
        }));
        break;
      case 'work_details':
        setResumeData(prev => {
          const newExperience = [...prev.experience];
          const currentJob = newExperience[newExperience.length - 1];
          const parts = response.split(' at ');
          if (parts.length > 1) {
            currentJob.title = parts[0].trim();
            currentJob.company = parts[1].trim();
          } else {
            currentJob.title = response;
          }
          return { ...prev, experience: newExperience };
        });
        break;
      case 'work_duration':
        setResumeData(prev => {
          const newExperience = [...prev.experience];
          newExperience[newExperience.length - 1].duration = response;
          return { ...prev, experience: newExperience };
        });
        break;
      case 'work_duties':
        setResumeData(prev => {
          const newExperience = [...prev.experience];
          newExperience[newExperience.length - 1].duties = response;
          return { ...prev, experience: newExperience };
        });
        break;
      case 'work_tools':
        setResumeData(prev => {
          const newExperience = [...prev.experience];
          newExperience[newExperience.length - 1].tools = response;
          return { ...prev, experience: newExperience };
        });
        break;
      case 'more_jobs':
        if (response.toLowerCase().includes('yes')) {
          setCurrentStep('work_intro');
          addMessage("Great! Let's add another job. " + questionFlow.work_intro.question);
          return;
        }
        break;
      case 'technical_skills':
        setResumeData(prev => ({
          ...prev,
          skills: [
            ...prev.skills,
            ...response.split(',').map(skill => skill.trim()).filter(skill => skill)
          ]
        }));
        break;
      case 'soft_skills':
        setResumeData(prev => ({
          ...prev,
          skills: [
            ...prev.skills,
            ...response.split(',').map(skill => skill.trim()).filter(skill => skill)
          ]
        }));
        break;
      case 'certifications':
        if (response.toLowerCase() !== 'no' && response.toLowerCase() !== 'none') {
          setResumeData(prev => ({
            ...prev,
            skills: [
              ...prev.skills,
              ...response.split(',').map(cert => cert.trim()).filter(cert => cert)
            ]
          }));
        }
        break;
      case 'education':
        setResumeData(prev => ({
          ...prev,
          education: [...prev.education, response]
        }));
        break;
    }

    // Move to next step
    const nextStep = currentQuestion.next;
    if (nextStep === 'complete') {
      addMessage("🎉 Excellent! I have all the information I need to create your professional resume. You can now download it as a PDF using the button on the right. Your resume looks great!");
      return;
    }

    setCurrentStep(nextStep);
    const nextQuestion = questionFlow[nextStep];
    addMessage(nextQuestion.question);
  };

  function handleSendMessage(message: string) {
    addMessage(message, true);
    setTimeout(() => {
      processResponse(message);
    }, 1000);
  }

  const handleDownload = async () => {
    if (!user) return;

    try {
      // Save to database first
      const title = `${resumeData.personal.name || 'Untitled'} Resume - ${new Date().toLocaleDateString()}`;
      await resumeService.saveResume(user.id, title, resumeData);
      
      // Then generate PDF
      generatePDF(resumeData);
      
      toast({
        title: "Success!",
        description: "Resume saved and downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resume. PDF will still download.",
        variant: "destructive",
      });
      // Still generate PDF even if save fails
      generatePDF(resumeData);
    }
  };

  const handleLanguageClick = () => {
    toast({
      title: "Coming Soon",
      description: "Language switching feature will be available soon!",
    });
  };

  // Check authentication and initialize conversation
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (messages.length === 0) {
      addMessage("👋 Hi! I'm here to help you create a professional resume. Let's start with your name - what should I call you?");
    }
  }, [user, navigate, messages.length]);

  const progress = calculateProgress();
  const canDownload = currentStep === 'complete' || progress.overall > 50;

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen">
      <Header onLanguageClick={handleLanguageClick} onHelpClick={() => setShowHelp(true)} />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isListening={isListening}
              onToggleListening={startListening}
              voiceEnabled={voiceEnabled}
              onToggleVoice={toggleVoice}
            />
          </div>

          {/* Progress & Preview */}
          <div className="space-y-6">
            <ProgressCard progress={progress} />
            <ResumePreview
              resumeData={resumeData}
              onDownload={handleDownload}
              canDownload={canDownload}
            />
            <TipsCard />
          </div>
        </div>
      </div>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default Index;
