import React, { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { AutomationTrigger, SubTrigger } from "@/types/automation";
import Header from "@/components/Header";
import VoiceControl from "@/components/VoiceControl";
import AutomationTriggers from "@/components/AutomationTriggers";
import EnhancedAutomationCard from "@/components/EnhancedAutomationCard";
import ActivityFeed, {
  addGlobalActivity,
  updateGlobalActivity,
} from "@/components/ActivityFeed";
import AnimatedBackground from "@/components/AnimatedBackground";
import StatusFooter from "@/components/StatusFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  triggerWorkoutAutomation,
  triggerStudioAutomation,
  triggerGenericAutomation,
} from "@/services/api";

const Index = () => {
  const [runningAutomations, setRunningAutomations] = useState<Set<string>>(
    new Set()
  );
  const [automationProgress, setAutomationProgress] = useState<
    Record<string, number>
  >({});

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

  const simulateAutomationProgress = (activityId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // Random progress between 5-20%

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Update activity to completed
        updateGlobalActivity(activityId, {
          status: "completed",
          duration: Math.random() * 3000 + 1000, // Random duration 1-4 seconds
        });

        // Remove from running automations
        setRunningAutomations((prev) => {
          const newSet = new Set(prev);
          newSet.delete(activityId);
          return newSet;
        });
      }

      setAutomationProgress((prev) => ({
        ...prev,
        [activityId]: progress,
      }));

      // Update activity progress
      updateGlobalActivity(activityId, {
        status: progress >= 100 ? "completed" : "running",
      });
    }, 300);

    return interval;
  };

  const triggerAutomation = async (
    trigger: AutomationTrigger,
    subTrigger?: SubTrigger
  ) => {
    const triggerName = subTrigger
      ? `${trigger.name} - ${subTrigger.name}`
      : trigger.name;

    const activityId = `${trigger.id}-${Date.now()}`;
    console.log(`Triggering automation: ${triggerName}`);

    // Add to running automations
    setRunningAutomations((prev) => new Set(prev).add(activityId));
    setAutomationProgress((prev) => ({ ...prev, [activityId]: 0 }));

    // Add activity to feed
    addGlobalActivity({
      type: "automation",
      title: `${triggerName} Started`,
      description: `Executing ${trigger.description}`,
      status: "running",
      automationType: trigger.id,
    });

    // Show initial toast
    toast({
      title: "🎻 Orchestra Activated",
      description: `${triggerName} automation triggered!`,
    });

    // Simulate progress
    simulateAutomationProgress(activityId);

    try {
      // Handle gym notes (workout automations)
      if (trigger.id === "gym-notes" && subTrigger) {
        const workoutType = subTrigger.id as
          | "running"
          | "cycling"
          | "mobility"
          | "gym";
        await triggerWorkoutAutomation(workoutType);

        toast({
          title: "✅ Workout Automation Complete",
          description: `${subTrigger.name} note created successfully!`,
          variant: "default",
        });
        return;
      }

      // Handle studio mode
      if (trigger.id === "studio-mode") {
        await triggerStudioAutomation("open_session");

        toast({
          title: "🎵 Studio Mode Activated",
          description: "FL Studio session opened successfully!",
          variant: "default",
        });
        return;
      }

      // Handle other automations as generic voice commands
      const commandMap: Record<string, string> = {
        "ritual-mode": "launch ritual mode",
        "explorer-mode": "start explorer mode",
        "focus-mode": "activate focus mode",
        "archive-mission": "archive mission",
      };

      const command = commandMap[trigger.id];
      if (command) {
        await triggerGenericAutomation(trigger.id, triggerName, command);

        toast({
          title: "🤖 Command Processed",
          description: `${triggerName} command sent to AI orchestrator!`,
          variant: "default",
        });
      } else {
        // Fallback for unmapped triggers
        await triggerGenericAutomation(trigger.id, triggerName);

        toast({
          title: "🎯 Generic Trigger",
          description: `${triggerName} processed as voice command!`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Backend automation error:", error);

      // Update activity to failed
      updateGlobalActivity(activityId, {
        status: "failed",
        description: "Automation failed - backend connection error",
      });

      // Remove from running automations
      setRunningAutomations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(activityId);
        return newSet;
      });

      toast({
        title: "❌ Automation Failed",
        description: `Failed to trigger ${triggerName}. Check backend connection.`,
        variant: "destructive",
      });
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
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <AnimatedBackground
        isVoiceActive={isListening}
        intensity={isListening ? 1.5 : 1}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <Header />

        <VoiceControl
          isListening={isListening}
          transcript={transcript}
          lastCommand={lastCommand}
          recognition={recognition}
          setIsListening={setIsListening}
          setTranscript={setTranscript}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Automation Triggers - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card className="bg-black/30 border-purple-500/25 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-2">
                  🎛️ Manual Automation Triggers
                  {runningAutomations.size > 0 && (
                    <span className="text-sm bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full animate-pulse">
                      {runningAutomations.size} Running
                    </span>
                  )}
                </CardTitle>
                <div className="text-center text-gray-300">
                  Click to manually trigger your orchestrated workflows
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {automationTriggers.map((trigger, index) => (
                    <EnhancedAutomationCard
                      key={trigger.id}
                      trigger={trigger}
                      onTriggerAutomation={triggerAutomation}
                      index={index}
                      isRunning={Array.from(runningAutomations).some((id) =>
                        id.startsWith(trigger.id)
                      )}
                      progress={Math.max(
                        ...Object.entries(automationProgress)
                          .filter(([id]) => id.startsWith(trigger.id))
                          .map(([, progress]) => progress),
                        0
                      )}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed - Takes up 1 column on large screens */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>

        <StatusFooter isListening={isListening} />
      </div>
    </div>
  );
};

export default Index;
