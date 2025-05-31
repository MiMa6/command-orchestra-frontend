import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Activity,
  Music,
  Dumbbell,
  Brain,
  Search,
  Focus,
  Archive,
} from "lucide-react";

export interface ActivityItem {
  id: string;
  type: "automation" | "voice_command" | "system";
  title: string;
  description: string;
  status: "running" | "completed" | "failed" | "pending";
  timestamp: Date;
  duration?: number;
  automationType?: string;
}

interface ActivityFeedProps {
  className?: string;
  maxItems?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  className = "",
  maxItems = 10,
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Add new activity to the feed
  const addActivity = (activity: Omit<ActivityItem, "id" | "timestamp">) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setActivities((prev) => [newActivity, ...prev.slice(0, maxItems - 1)]);
  };

  // Update activity status
  const updateActivity = (id: string, updates: Partial<ActivityItem>) => {
    setActivities((prev) =>
      prev.map((activity) =>
        activity.id === id ? { ...activity, ...updates } : activity
      )
    );
  };

  // Simulate some initial activities (remove this in production)
  useEffect(() => {
    const initialActivities: Omit<ActivityItem, "id" | "timestamp">[] = [
      {
        type: "automation",
        title: "Studio Mode Activated",
        description: "FL Studio session opened successfully",
        status: "completed",
        duration: 2340,
        automationType: "studio-mode",
      },
      {
        type: "voice_command",
        title: "Voice Command Processed",
        description: "Gym Notes - Running workout logged",
        status: "completed",
        duration: 1200,
        automationType: "gym-notes",
      },
      {
        type: "system",
        title: "Orchestrator Online",
        description: "AI voice recognition system activated",
        status: "completed",
        duration: 500,
      },
    ];

    initialActivities.forEach((activity, index) => {
      setTimeout(() => addActivity(activity), index * 200);
    });
  }, []);

  const getStatusIcon = (status: ActivityItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "running":
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ActivityItem["status"]) => {
    const variants = {
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      running:
        "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 animate-pulse",
      failed: "bg-red-500/20 text-red-400 border-red-500/30",
      pending: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getAutomationIcon = (automationType?: string) => {
    switch (automationType) {
      case "studio-mode":
        return <Music className="w-4 h-4 text-purple-400" />;
      case "gym-notes":
        return <Dumbbell className="w-4 h-4 text-red-400" />;
      case "ritual-mode":
        return <Brain className="w-4 h-4 text-pink-400" />;
      case "explorer-mode":
        return <Search className="w-4 h-4 text-blue-400" />;
      case "focus-mode":
        return <Focus className="w-4 h-4 text-green-400" />;
      case "archive-mission":
        return <Archive className="w-4 h-4 text-orange-400" />;
      default:
        return <Zap className="w-4 h-4 text-indigo-400" />;
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return "";
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds}s`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Expose functions globally for other components to use
  useEffect(() => {
    (window as any).addActivity = addActivity;
    (window as any).updateActivity = updateActivity;

    return () => {
      delete (window as any).addActivity;
      delete (window as any).updateActivity;
    };
  }, []);

  return (
    <Card
      className={`bg-black/30 border-purple-500/25 backdrop-blur-sm ${className}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
          Live Activity Feed
          {activities.filter((a) => a.status === "running").length > 0 && (
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 animate-pulse">
              {activities.filter((a) => a.status === "running").length} Running
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="p-4 space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Automation events will appear here</p>
              </div>
            ) : (
              activities.map((activity, index) => (
                <div key={activity.id}>
                  <div
                    className={`
                      flex items-start gap-3 p-3 rounded-lg transition-all duration-300 
                      ${
                        activity.status === "running"
                          ? "bg-gradient-to-r from-purple-900/30 to-pink-900/20 border border-purple-500/30"
                          : "bg-slate-800/30 hover:bg-slate-800/50"
                      }
                      ${
                        index === 0
                          ? "ring-1 ring-purple-500/30 shadow-lg shadow-purple-500/10"
                          : ""
                      }
                    `}
                    style={{
                      animation:
                        index === 0 ? "slideInFromRight 0.3s ease-out" : "none",
                    }}
                  >
                    {/* Status and Type Icons */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      {getStatusIcon(activity.status)}
                      {activity.automationType &&
                        getAutomationIcon(activity.automationType)}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-white truncate">
                          {activity.title}
                        </h4>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{formatTime(activity.timestamp)}</span>
                        {activity.duration && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(activity.duration)}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="capitalize">
                          {activity.type.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Progress indicator for running activities */}
                    {activity.status === "running" && (
                      <div className="w-2 h-12 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full animate-pulse">
                        <div className="w-full h-full bg-gradient-to-b from-purple-400 to-pink-400 rounded-full animate-bounce"></div>
                      </div>
                    )}
                  </div>

                  {index < activities.length - 1 && (
                    <Separator className="my-2 bg-gray-700/50" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;

// Utility function to add activity from anywhere in the app
export const addGlobalActivity = (
  activity: Omit<ActivityItem, "id" | "timestamp">
) => {
  if ((window as any).addActivity) {
    (window as any).addActivity(activity);
  }
};

export const updateGlobalActivity = (
  id: string,
  updates: Partial<ActivityItem>
) => {
  if ((window as any).updateActivity) {
    (window as any).updateActivity(id, updates);
  }
};
