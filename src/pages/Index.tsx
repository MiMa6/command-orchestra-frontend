import React from "react";
import { toast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { AutomationTrigger, SubTrigger } from "@/types/automation";
import Header from "@/components/Header";
import VoiceControl from "@/components/VoiceControl";
import AutomationTriggers from "@/components/AutomationTriggers";
import StatusFooter from "@/components/StatusFooter";

const Index = () => {
  // Predefined automation triggers
  const automationTriggers: AutomationTrigger[] = [
    {
      id: "gym-notes",
      name: "GYM Notes",
      description: "Fitness tracking and workout logging",
      color: "from-red-500 to-orange-500",
      keywords: ["gym notes", "workout", "fitness tracking"],
      subTriggers: [
        { id: "running", name: "Running", icon: "run" },
        { id: "cycling", name: "Cycling", icon: "bike" },
        { id: "mobility", name: "Mobility", icon: "stretch" },
        { id: "gym", name: "Gym", icon: "dumbbell" },
      ],
    },
    {
      id: "studio-mode",
      name: "Studio Mode",
      description:
        "Launch Drum session - Opens FL Studio, EZD3 & configures audio settings",
      color: "from-indigo-500 to-purple-500",
      keywords: ["studio mode", "fl studio", "music production"],
    },
    {
      id: "ritual-mode",
      name: "Launch Ritual Mode",
      description: "Opens Obsidian, Cursor, activates AI agents",
      color: "from-purple-500 to-pink-500",
      keywords: ["launch ritual mode", "ritual mode", "start ritual"],
    },
    {
      id: "explorer-mode",
      name: "Explorer Mode",
      description: "Browser research tabs, voice logging setup",
      color: "from-blue-500 to-cyan-500",
      keywords: ["explorer mode", "start explorer", "research mode"],
    },
    {
      id: "focus-mode",
      name: "Focus Mode",
      description: "DND mode, deep focus playlist, minimal setup",
      color: "from-green-500 to-emerald-500",
      keywords: ["focus mode", "deep focus", "concentration"],
    },
    {
      id: "archive-mission",
      name: "Archive Mission",
      description: "Backup notes, close apps, reset workspace",
      color: "from-orange-500 to-red-500",
      keywords: ["archive mission", "end session", "backup and close"],
    },
  ];

  const triggerAutomation = async (
    trigger: AutomationTrigger,
    subTrigger?: SubTrigger
  ) => {
    const triggerName = subTrigger
      ? `${trigger.name} - ${subTrigger.name}`
      : trigger.name;
    console.log(`Triggering automation: ${triggerName}`);

    toast({
      title: "🎻 Orchestra Activated",
      description: `${triggerName} automation triggered!`,
    });

    try {
      await fetch("/api/trigger-automation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          triggerId: subTrigger ? `${trigger.id}-${subTrigger.id}` : trigger.id,
          triggerName: triggerName,
          timestamp: new Date().toISOString(),
          command: "manual trigger",
        }),
      });
    } catch (error) {
      console.log("Backend trigger simulation:", triggerName);
    }
  };

  const {
    isListening,
    setIsListening,
    transcript,
    setTranscript,
    lastCommand,
    recognition,
  } = useSpeechRecognition(automationTriggers, triggerAutomation);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <VoiceControl
          isListening={isListening}
          transcript={transcript}
          lastCommand={lastCommand}
          recognition={recognition}
          setIsListening={setIsListening}
          setTranscript={setTranscript}
        />

        <AutomationTriggers
          automationTriggers={automationTriggers}
          onTriggerAutomation={triggerAutomation}
        />

        <StatusFooter isListening={isListening} />
      </div>
    </div>
  );
};

export default Index;
