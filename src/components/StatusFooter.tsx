import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  Activity,
  Clock,
  Cpu,
  MemoryStick,
  Volume2,
  Mic,
  Brain,
  Zap,
  Heart,
} from "lucide-react";

interface StatusFooterProps {
  isListening: boolean;
}

const StatusFooter: React.FC<StatusFooterProps> = ({ isListening }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStats, setSystemStats] = useState({
    uptime: "0h 0m",
    sessionsToday: 0,
    automationsRun: 0,
    responseTime: "0ms",
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate system stats updates
  useEffect(() => {
    const updateStats = () => {
      setSystemStats((prev) => ({
        uptime: `${Math.floor(Date.now() / 1000 / 60 / 60)}h ${Math.floor(
          (Date.now() / 1000 / 60) % 60
        )}m`,
        sessionsToday: Math.floor(Math.random() * 15) + 5,
        automationsRun: prev.automationsRun + (Math.random() > 0.7 ? 1 : 0),
        responseTime: `${Math.floor(Math.random() * 50) + 10}ms`,
      }));
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <footer className="mt-16 relative">
      {/* Animated gradient line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mb-8"></div>

      <div className="bg-black/25 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6 relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-pink-900/10 animate-pulse"></div>

        {/* Floating particles */}
        <div
          className="absolute top-2 left-8 w-1 h-1 bg-purple-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-4 right-12 w-1 h-1 bg-pink-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-3 left-16 w-1 h-1 bg-cyan-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Voice Status */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              {isListening ? (
                <Mic className="w-5 h-5 text-green-400 animate-pulse" />
              ) : (
                <Volume2 className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm font-medium text-white">
                Voice Status
              </span>
            </div>
            <Badge
              className={`
                transition-all duration-300 transform
                ${
                  isListening
                    ? "bg-green-500/20 text-green-400 border-green-500/30 animate-pulse scale-105"
                    : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                }
              `}
            >
              {isListening ? "🎧 Listening" : "🔇 Standby"}
            </Badge>
          </div>

          {/* System Status */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-sm font-medium text-white">
                System Health
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs text-purple-300">
                <Cpu className="w-3 h-3" />
                <span>CPU: Normal</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-purple-300">
                <MemoryStick className="w-3 h-3" />
                <span>Memory: OK</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-purple-300">
                <Wifi className="w-3 h-3" />
                <span>Network: {systemStats.responseTime}</span>
              </div>
            </div>
          </div>

          {/* Session Stats */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-pink-400 animate-pulse" />
              <span className="text-sm font-medium text-white">
                Session Stats
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-pink-300">
                Uptime: {systemStats.uptime}
              </div>
              <div className="text-xs text-pink-300">
                Sessions: {systemStats.sessionsToday}
              </div>
              <div className="text-xs text-pink-300">
                Automations: {systemStats.automationsRun}
              </div>
            </div>
          </div>

          {/* Time & Date */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium text-white">
                Current Time
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-mono text-cyan-300 font-bold">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-cyan-300/70">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="mt-6 pt-4 border-t border-purple-500/20">
          <div className="flex items-center justify-between text-xs text-purple-300/80">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-400 animate-pulse" />
                <span>Orchestra v1.0.0</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All Systems Online</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>Powered by AI</span>
              </div>
              <div className="text-purple-400/60">© 2024 Command Orchestra</div>
            </div>
          </div>
        </div>

        {/* Pulse effect when listening */}
        {isListening && (
          <div className="absolute inset-0 border-2 border-green-400/30 rounded-2xl animate-pulse"></div>
        )}
      </div>
    </footer>
  );
};

export default StatusFooter;
