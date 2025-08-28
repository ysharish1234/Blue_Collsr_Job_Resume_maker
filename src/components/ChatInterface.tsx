import { useState, useRef, useEffect } from "react";
import { Bot, User, VolumeX, Volume2, Mic, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const ChatInterface = ({
  messages,
  onSendMessage,
  isListening,
  onToggleListening,
  voiceEnabled,
  onToggleVoice,
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-card rounded-2xl shadow-glass">
      {/* Chat Header */}
      <div className="p-4 border-b border-card-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
              <Bot className="text-primary-foreground w-5 h-5" />
            </div>
            <div>
              <h3 className="text-card-foreground font-semibold">AI Assistant</h3>
              <p className="text-muted-foreground text-sm">Ready to help build your resume</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={voiceEnabled ? "success" : "secondary"}
              size="icon"
              onClick={onToggleVoice}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
            <span className={`text-xs ${voiceEnabled ? 'text-success' : 'text-muted-foreground'}`}>
              Voice {voiceEnabled ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="h-96 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble flex items-start space-x-3 ${
              message.isUser ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.isUser 
                ? 'gradient-secondary' 
                : 'gradient-primary'
            }`}>
              {message.isUser ? (
                <User className="text-primary-foreground w-4 h-4" />
              ) : (
                <Bot className="text-primary-foreground w-4 h-4" />
              )}
            </div>
            <div className={`rounded-2xl p-4 max-w-md ${
              message.isUser
                ? 'gradient-secondary rounded-tr-sm'
                : 'glass-card rounded-tl-sm'
            }`}>
              <p className="text-card-foreground">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-card-border">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Type your answer or use voice..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="glass-input rounded-xl"
            />
          </div>
          <Button
            variant="voice"
            size="icon"
            onClick={onToggleListening}
            className={`rounded-xl ${isListening ? 'recording' : ''}`}
          >
            <Mic className="w-4 h-4" />
            {isListening && (
              <div className="absolute inset-0 rounded-xl pulse-ring bg-destructive opacity-30" />
            )}
          </Button>
          <Button
            variant="gradient"
            size="icon"
            onClick={handleSend}
            className="rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {isListening && (
          <div className="text-center text-muted-foreground text-sm mt-2">
            🎤 Listening... Speak now
          </div>
        )}
      </div>
    </div>
  );
};