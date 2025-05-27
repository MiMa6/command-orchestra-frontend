import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Music, Play } from "lucide-react";
import { AutomationTrigger, SubTrigger } from "@/types/automation";

interface AutomationTriggersProps {
  automationTriggers: AutomationTrigger[];
  onTriggerAutomation: (
    trigger: AutomationTrigger,
    subTrigger?: SubTrigger
  ) => void;
}

const AutomationTriggers: React.FC<AutomationTriggersProps> = ({
  automationTriggers,
  onTriggerAutomation,
}) => {
  const getBackgroundImage = (triggerId: string) => {
    console.log("Getting background for:", triggerId); // Debug log
    switch (triggerId) {
      case "gym-notes":
        console.log("Returning cat-dumbbells image"); // Debug log
        return "/assets/images/cat-dumbbells.jpg";
      case "studio-mode":
        console.log("Returning studio-headphones image"); // Debug log
        return "/assets/images/studio-headphones.jpg";
      default:
        console.log("No background image for:", triggerId); // Debug log
        return "";
    }
  };

  return (
    <Card className="bg-black/40 border-purple-500/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-white">
          🎛️ Manual Automation Triggers
        </CardTitle>
        <CardDescription className="text-center text-gray-300">
          Click to manually trigger your orchestrated workflows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {automationTriggers.map((trigger) => (
            <Card
              key={trigger.id}
              className="relative overflow-hidden bg-black/60 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              {/* Background Image */}
              {getBackgroundImage(trigger.id) && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-90"
                  style={{
                    backgroundImage: `url('${getBackgroundImage(trigger.id)}')`,
                  }}
                ></div>
              )}

              {/* Content Overlay */}
              <div className="relative z-10 bg-black/45 h-full">
                <CardHeader className="pb-2">
                  <div
                    className={`w-full h-2 rounded-full bg-gradient-to-r ${trigger.color} mb-3`}
                  ></div>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    {trigger.id === "gym-notes" && (
                      <Dumbbell className="w-5 h-5" />
                    )}
                    {trigger.id === "studio-mode" && (
                      <Music className="w-5 h-5" />
                    )}
                    {trigger.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-400">
                    {trigger.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  {/* Sub-triggers for GYM Notes */}
                  {trigger.id === "gym-notes" && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-gray-400 mb-2">
                        Workout Types:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {trigger.subTriggers?.map((subTrigger) => (
                          <Button
                            key={subTrigger.id}
                            size="sm"
                            className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTriggerAutomation(trigger, subTrigger);
                            }}
                          >
                            {subTrigger.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {trigger.id !== "gym-notes" && (
                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerAutomation(trigger);
                      }}
                    >
                      Start
                    </Button>
                  )}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationTriggers;
