import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { resumeService } from '@/services/resumeService';
import { Resume } from '@/lib/supabase';
import { generatePDF } from '@/utils/resumeGenerator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, FileText, Calendar, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyResumes: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadResumes();
    }
  }, [user]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const userResumes = await resumeService.getUserResumes(user!.id);
      setResumes(userResumes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load resumes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resume: Resume) => {
    try {
      const resumeData = {
        personal: resume.personal_info,
        experience: resume.experience,
        skills: resume.skills,
        education: resume.education,
      };
      generatePDF(resumeData);
      toast({
        title: "Success",
        description: "Resume downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download resume.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await resumeService.deleteResume(resumeId);
      setResumes(resumes.filter(r => r.id !== resumeId));
      toast({
        title: "Success",
        description: "Resume deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resume.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white">Loading your resumes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Resumes</h1>
            <p className="text-blue-200">Manage and download your saved resumes</p>
          </div>
          <Link to="/">
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              Create New Resume
            </Button>
          </Link>
        </div>

        {resumes.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No resumes yet</h3>
              <p className="text-blue-200 mb-4">Create your first resume to get started</p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  Create Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-300" />
                    {resume.title}
                  </CardTitle>
                  <CardDescription className="text-blue-200 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created {formatDate(resume.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-blue-200 text-sm">
                      <span className="font-medium">Name:</span> {resume.personal_info.name}
                    </p>
                    <p className="text-blue-200 text-sm">
                      <span className="font-medium">Experience:</span> {resume.experience.length} job(s)
                    </p>
                    <p className="text-blue-200 text-sm">
                      <span className="font-medium">Skills:</span> {resume.skills.length} skill(s)
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleDownload(resume)}
                      size="sm"
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      onClick={() => handleDelete(resume.id)}
                      size="sm"
                      variant="destructive"
                      className="px-3"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};