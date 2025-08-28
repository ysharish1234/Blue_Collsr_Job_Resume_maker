import { supabase, Resume } from '@/lib/supabase';

export interface ResumeData {
  personal: {
    name: string;
    phone: string;
    email: string;
    address: string;
    languages: string[];
  };
  experience: Array<{
    type: string;
    title: string;
    company: string;
    duration: string;
    duties: string;
    tools: string;
  }>;
  skills: string[];
  education: string[];
}

export const resumeService = {
  // Save a new resume
  async saveResume(userId: string, title: string, resumeData: ResumeData) {
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        title,
        personal_info: resumeData.personal,
        experience: resumeData.experience,
        skills: resumeData.skills,
        education: resumeData.education,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all resumes for a user
  async getUserResumes(userId: string): Promise<Resume[]> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a specific resume
  async getResume(resumeId: string): Promise<Resume | null> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update a resume
  async updateResume(resumeId: string, updates: Partial<Omit<Resume, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('resumes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', resumeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a resume
  async deleteResume(resumeId: string) {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId);

    if (error) throw error;
  },
};