import { useState, useCallback, useRef } from 'react';

interface TextToSpeechHook {
  isSpeaking: boolean;
  speak: (text: string) => void;
  stop: () => void;
  isEnabled: boolean;
  toggleEnabled: () => void;
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const synthesisRef = useRef(window.speechSynthesis);

  const speak = useCallback((text: string) => {
    if (!isEnabled || isSpeaking || !text.trim()) return;

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthesisRef.current.speak(utterance);
  }, [isEnabled, isSpeaking]);

  const stop = useCallback(() => {
    synthesisRef.current.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleEnabled = useCallback(() => {
    if (isEnabled && isSpeaking) {
      stop();
    }
    setIsEnabled(!isEnabled);
  }, [isEnabled, isSpeaking, stop]);

  return {
    isSpeaking,
    speak,
    stop,
    isEnabled,
    toggleEnabled,
  };
};