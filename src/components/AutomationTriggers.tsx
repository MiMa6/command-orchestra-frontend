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
import { AutomationTrigger } from "@/types/automation";

interface AutomationTriggersProps {
  automationTriggers: AutomationTrigger[];
  onTriggerAutomation: (trigger: AutomationTrigger, subTrigger?: any) => void;
}

const AutomationTriggers: React.FC<AutomationTriggersProps> = ({
  automationTriggers,
  onTriggerAutomation,
}) => {
  return (
    <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
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
              className="bg-black/60 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
            >
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
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Voice triggers:</p>
                  <div className="flex flex-wrap gap-1">
                    {trigger.keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sub-triggers for GYM Notes */}
                {trigger.id === "gym-notes" && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-400 mb-2">Workout Types:</p>
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
                    <Play className="w-4 h-4 mr-2" />
                    Trigger
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationTriggers;
