import { Lightbulb } from "lucide-react";

export const TipsCard = () => {
  const tips = [
    "Click the microphone to speak your answers",
    "Be specific about your job duties",
    "Mention tools and equipment you've used",
    "Include any certifications or training"
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-card-foreground font-semibold mb-3 flex items-center">
        <Lightbulb className="mr-2 text-warning w-5 h-5" />
        Tips
      </h3>
      <div className="space-y-2 text-muted-foreground text-sm">
        {tips.map((tip, index) => (
          <p key={index}>• {tip}</p>
        ))}
      </div>
    </div>
  );
};