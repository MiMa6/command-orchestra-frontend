import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { AutomationTrigger } from "@/types/automation";
import { processVoiceCommand } from "@/services/api";

interface ConversationMessage {
  type: "user" | "ai";
  text: string;
  timestamp: Date;
}

export const useSpeechRecognition = (
  automationTriggers: AutomationTrigger[],
  onTriggerAutomation: (trigger: AutomationTrigger, subTrigger?: any) => void
) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    ConversationMessage[]
  >([]);

  // Speech synthesis setup
  const speechSynthesis = window.speechSynthesis;
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);

        if (event.results[current].isFinal) {
          processCommand(transcriptResult.toLowerCase());
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      // Stop any ongoing speech
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!speechSynthesis) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      speechRef.current = null;
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      speechRef.current = null;
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const toggleMode = () => {
    setIsConversationMode(!isConversationMode);
    setConversationHistory([]); // Clear history when switching modes

    toast({
      title: !isConversationMode
        ? "💬 Conversation Mode Activated"
        : "🤖 Command Mode Activated",
      description: !isConversationMode
        ? "Ready for natural conversation with AI"
        : "Ready for voice commands and automations",
    });
  };

  const processCommand = async (command: string) => {
    console.log("Processing command:", command);
    setLastCommand(command);

    // Add user message to conversation history
    const userMessage: ConversationMessage = {
      type: "user",
      text: command,
      timestamp: new Date(),
    };
    setConversationHistory((prev) => [...prev, userMessage]);

    if (isConversationMode) {
      // In conversation mode, always send to AI for processing
      try {
        await processVoiceCommand(command, true);

        // Simulate AI response (replace with actual API response when available)
        const aiResponse = `I heard you say: "${command}". I'm processing this request now.`;

        const aiMessage: ConversationMessage = {
          type: "ai",
          text: aiResponse,
          timestamp: new Date(),
        };
        setConversationHistory((prev) => [...prev, aiMessage]);

        // Speak the AI response
        speak(aiResponse);

        toast({
          title: "💬 AI Conversation",
          description: `Processing your message...`,
          variant: "default",
        });
      } catch (error) {
        console.error("Voice command API error:", error);

        const errorMessage =
          "I'm sorry, I couldn't process that request. Please try again.";

        const aiMessage: ConversationMessage = {
          type: "ai",
          text: errorMessage,
          timestamp: new Date(),
        };
        setConversationHistory((prev) => [...prev, aiMessage]);

        speak(errorMessage);

        toast({
          title: "Connection Error",
          description: "Couldn't reach AI service. Check backend connection.",
          variant: "destructive",
        });
      }
    } else {
      // Command mode - existing logic
      const matchedTrigger = automationTriggers.find((trigger) =>
        trigger.keywords.some((keyword) => command.includes(keyword))
      );

      if (matchedTrigger) {
        // Trigger local automation
        onTriggerAutomation(matchedTrigger);
      } else {
        // Send unmatched commands to backend for AI processing
        try {
          await processVoiceCommand(command, true); // Use AI agent for unmatched commands

          toast({
            title: "🤖 Voice Command Processed",
            description: `AI is processing: "${command}"`,
            variant: "default",
          });
        } catch (error) {
          console.error("Voice command API error:", error);

          toast({
            title: "Command Not Recognized",
            description: `Heard: "${command}" - try one of the preset commands or check backend connection`,
            variant: "destructive",
          });
        }
      }
    }
  };

  return {
    isListening,
    setIsListening,
    transcript,
    setTranscript,
    lastCommand,
    recognition,
    isConversationMode,
    toggleMode,
    isSpeaking,
    conversationHistory,
    speak,
  };
};
