import { X } from "lucide-react";
import { Button } from "./ui/button";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-2xl p-6 max-w-md mx-4 glass-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-card-foreground">How to Use</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong>Voice Input:</strong> Click the red microphone button and speak your answer clearly.
          </p>
          <p>
            <strong>Text Input:</strong> Type your response in the text box and press Enter or click send.
          </p>
          <p>
            <strong>Navigation:</strong> Answer questions one by one. The AI will ask follow-up questions to get complete information.
          </p>
          <p>
            <strong>Download:</strong> Once enough information is collected, you can download your professional resume as a PDF.
          </p>
        </div>
      </div>
    </div>
  );
};