import { TrendingUp } from "lucide-react";

interface ProgressData {
  personal: number;
  work: number;
  skills: number;
  overall: number;
}

interface ProgressCardProps {
  progress: ProgressData;
}

export const ProgressCard = ({ progress }: ProgressCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-card-foreground font-semibold mb-4 flex items-center">
        <TrendingUp className="mr-2 text-primary w-5 h-5" />
        Progress
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Personal Info</span>
          <span className="text-card-foreground">{progress.personal}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="gradient-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress.personal}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Work Experience</span>
          <span className="text-card-foreground">{progress.work}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="gradient-secondary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress.work}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Skills</span>
          <span className="text-card-foreground">{progress.skills}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="gradient-accent h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress.skills}%` }}
          />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-card-border">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Overall Progress</span>
          <span className="text-card-foreground font-semibold">{progress.overall}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-3 mt-2">
          <div 
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress.overall}%` }}
          />
        </div>
      </div>
    </div>
  );
};