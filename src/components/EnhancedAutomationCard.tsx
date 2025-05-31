import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dumbbell,
  Music,
  Brain,
  Search,
  Focus,
  Archive,
  Play,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { AutomationTrigger, SubTrigger } from "@/types/automation";

interface EnhancedAutomationCardProps {
  trigger: AutomationTrigger;
  onTriggerAutomation: (
    trigger: AutomationTrigger,
    subTrigger?: SubTrigger
  ) => void;
  index: number;
  isRunning?: boolean;
  progress?: number;
}

const EnhancedAutomationCard: React.FC<EnhancedAutomationCardProps> = ({
  trigger,
  onTriggerAutomation,
  index,
  isRunning = false,
  progress = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Staggered entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  // Create ripple effect on click
  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  const getBackgroundImage = (triggerId: string) => {
    switch (triggerId) {
      case "gym-notes":
        return "/assets/images/cat-dumbbells.jpg";
      case "studio-mode":
        return "/assets/images/studio-headphones.jpg";
      default:
        return "";
    }
  };

  const getIcon = (triggerId: string, className: string = "w-5 h-5") => {
    const iconClass = `${className} transition-all duration-300 ${
      isHovered ? "scale-110" : ""
    }`;

    switch (triggerId) {
      case "gym-notes":
        return <Dumbbell className={`${iconClass} text-red-400`} />;
      case "studio-mode":
        return <Music className={`${iconClass} text-purple-400`} />;
      case "ritual-mode":
        return <Brain className={`${iconClass} text-pink-400`} />;
      case "explorer-mode":
        return <Search className={`${iconClass} text-blue-400`} />;
      case "focus-mode":
        return <Focus className={`${iconClass} text-green-400`} />;
      case "archive-mission":
        return <Archive className={`${iconClass} text-orange-400`} />;
      default:
        return <Sparkles className={`${iconClass} text-purple-400`} />;
    }
  };

  const getStatusIcon = () => {
    if (isRunning) {
      return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />;
    }
    if (progress === 100) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    return null;
  };

  const handleTriggerClick = (subTrigger?: SubTrigger) => {
    onTriggerAutomation(trigger, subTrigger);
  };

  return (
    <div
      className={`
        transform transition-all duration-700 ease-out
        ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }
      `}
      style={{
        animationDelay: `${index * 150}ms`,
        transitionDelay: `${index * 50}ms`,
      }}
    >
      <Card
        ref={cardRef}
        className={`
          relative overflow-hidden group cursor-pointer
          transition-all duration-500 ease-out
          ${
            isHovered
              ? "scale-105 shadow-2xl shadow-purple-500/25 border-purple-400/60"
              : "scale-100 shadow-lg border-gray-700 hover:border-purple-500/50"
          }
          ${isRunning ? "ring-2 ring-yellow-400/50 animate-pulse" : ""}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={createRipple}
      >
        {/* Ripple Effects */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute pointer-events-none rounded-full bg-white/20"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: "0px",
              height: "0px",
              animation: "ripple 0.6s ease-out forwards",
            }}
          />
        ))}

        {/* Background Image with Parallax Effect */}
        {getBackgroundImage(trigger.id) && (
          <div
            className={`
              absolute inset-0 bg-cover bg-center transition-transform duration-700
              ${isHovered ? "scale-110" : "scale-100"}
            `}
            style={{
              backgroundImage: `url('${getBackgroundImage(trigger.id)}')`,
              filter: isHovered
                ? "brightness(0.8) saturate(1.2)"
                : "brightness(0.6)",
            }}
          />
        )}

        {/* Animated Gradient Overlay */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60
          transition-all duration-500
          ${isHovered ? "from-purple-900/40 via-black/30 to-pink-900/40" : ""}
        `}
        />

        {/* Floating Particles Effect on Hover */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-400/60 rounded-full animate-bounce"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + Math.sin(i) * 30}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${2 + i * 0.3}s`,
                }}
              />
            ))}
          </>
        )}

        {/* Content */}
        <div className="relative z-10 h-full bg-black/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            {/* Status and Progress Bar */}
            {(isRunning || progress > 0) && (
              <div className="mb-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    <span className="text-xs text-yellow-400 font-medium">
                      {isRunning
                        ? "Running..."
                        : progress === 100
                        ? "Completed"
                        : "Ready"}
                    </span>
                  </div>
                  {progress > 0 && (
                    <span className="text-xs text-gray-400">{progress}%</span>
                  )}
                </div>
                {progress > 0 && (
                  <Progress value={progress} className="h-1 bg-gray-700" />
                )}
              </div>
            )}

            {/* Color Bar with Animation */}
            <div
              className={`
                w-full h-2 rounded-full bg-gradient-to-r ${trigger.color} mb-3
                transition-all duration-500
                ${isHovered ? "h-3 shadow-lg" : ""}
              `}
              style={{
                boxShadow: isHovered
                  ? `0 0 15px ${
                      trigger.color.includes("purple") ? "#8b5cf6" : "#ec4899"
                    }`
                  : "none",
              }}
            />

            {/* Title with Icon */}
            <CardTitle
              className={`
              text-lg text-white flex items-center gap-2
              transition-all duration-300
              ${isHovered ? "text-purple-200" : ""}
            `}
            >
              {getIcon(trigger.id)}
              {trigger.name}
              {isRunning && (
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 animate-pulse ml-auto">
                  Running
                </Badge>
              )}
            </CardTitle>

            <CardDescription
              className={`
              text-sm transition-colors duration-300
              ${isHovered ? "text-gray-300" : "text-gray-400"}
            `}
            >
              {trigger.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            {/* Sub-triggers for GYM Notes */}
            {trigger.id === "gym-notes" && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Workout Types:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {trigger.subTriggers?.map((subTrigger, i) => (
                    <Button
                      key={subTrigger.id}
                      size="sm"
                      disabled={isRunning}
                      className={`
                        text-xs bg-gradient-to-r from-purple-600 to-pink-600 
                        hover:from-purple-500 hover:to-pink-500 text-white border-none
                        transition-all duration-300 transform
                        ${isHovered ? "scale-105" : ""}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                      style={{
                        animationDelay: `${i * 100}ms`,
                        animation: isVisible
                          ? "slideInUp 0.4s ease-out forwards"
                          : "none",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerClick(subTrigger);
                      }}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {subTrigger.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Main trigger button for other automations */}
            {trigger.id !== "gym-notes" && (
              <Button
                className={`
                  w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 
                  hover:from-purple-500 hover:to-pink-500
                  transition-all duration-300 transform relative overflow-hidden
                  ${isHovered ? "scale-105 shadow-lg" : ""}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                disabled={isRunning}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTriggerClick();
                }}
              >
                {/* Button Background Animation */}
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
                  transform transition-transform duration-1000
                  ${isHovered ? "translate-x-full" : "-translate-x-full"}
                `}
                />

                <div className="relative flex items-center justify-center gap-2">
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isRunning ? "Running..." : "Start"}
                </div>
              </Button>
            )}
          </CardContent>
        </div>

        {/* Glow effect on hover */}
        <div
          className={`
          absolute inset-0 opacity-0 transition-opacity duration-500
          bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10
          ${isHovered ? "opacity-100" : ""}
        `}
        />
      </Card>
    </div>
  );
};

export default EnhancedAutomationCard;
