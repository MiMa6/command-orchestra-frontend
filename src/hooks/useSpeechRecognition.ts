import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { AutomationTrigger } from "@/types/automation";
import { processVoiceCommand } from "@/services/api";

export const useSpeechRecognition = (
  automationTriggers: AutomationTrigger[],
  onTriggerAutomation: (trigger: AutomationTrigger, subTrigger?: any) => void
) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [lastCommand, setLastCommand] = useState("");
  const [recognition, setRecognition] = useState<any>(null);

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
    };
  }, []);

  const processCommand = async (command: string) => {
    console.log("Processing command:", command);
    setLastCommand(command);

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
  };

  return {
    isListening,
    setIsListening,
    transcript,
    setTranscript,
    lastCommand,
    recognition,
  };
};
