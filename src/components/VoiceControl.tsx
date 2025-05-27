import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Mic, MicOff, Brain, Zap } from "lucide-react";
import { useAudioVisualization } from "@/hooks/useAudioVisualization";

interface VoiceControlProps {
  isListening: boolean;
  transcript: string;
  lastCommand: string;
  recognition: any;
  setIsListening: (listening: boolean) => void;
  setTranscript: (transcript: string) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  isListening,
  transcript,
  lastCommand,
  recognition,
  setIsListening,
  setTranscript,
}) => {
  const { audioLevel, startAudioVisualization, stopAudioVisualization } =
    useAudioVisualization();

  const startListening = async () => {
    if (!recognition) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      await startAudioVisualization(stream, true);

      recognition.start();
      setIsListening(true);
      setTranscript("");

      toast({
        title: "🤖 AI Orchestrator Online",
        description: "Speak your command to the orchestrator...",
      });
    } catch (error) {
      console.error("Microphone access error:", error);
      toast({
        title: "Microphone Access Required",
        description:
          "Please allow microphone access to speak to the orchestrator.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    stopAudioVisualization();
    setIsListening(false);
    setTranscript("");
  };

  return (
    <Card className="mb-8 bg-gradient-to-br from-slate-800/80 via-purple-900/60 to-slate-800/80 border-purple-500/50 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-purple-500/20">
      {/* Enhanced animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div
          className={`absolute w-4 h-4 bg-purple-400/40 rounded-full animate-bounce ${
            isListening ? "opacity-100 animate-pulse" : "opacity-30"
          }`}
          style={{
            top: "15%",
            left: "8%",
            animationDelay: "0s",
            animationDuration: isListening ? "2s" : "4s",
          }}
        ></div>
        <div
          className={`absolute w-2 h-2 bg-pink-400/50 rounded-full animate-bounce ${
            isListening ? "opacity-100 animate-pulse" : "opacity-25"
          }`}
          style={{
            top: "65%",
            left: "85%",
            animationDelay: "0.7s",
            animationDuration: isListening ? "1.5s" : "3.5s",
          }}
        ></div>
        <div
          className={`absolute w-3 h-3 bg-yellow-400/30 rounded-full animate-bounce ${
            isListening ? "opacity-100 animate-pulse" : "opacity-20"
          }`}
          style={{
            top: "75%",
            left: "15%",
            animationDelay: "1.2s",
            animationDuration: isListening ? "1.8s" : "4.2s",
          }}
        ></div>
        <div
          className={`absolute w-2 h-2 bg-cyan-400/35 rounded-full animate-bounce ${
            isListening ? "opacity-100 animate-pulse" : "opacity-25"
          }`}
          style={{
            top: "30%",
            left: "75%",
            animationDelay: "1.8s",
            animationDuration: isListening ? "2.2s" : "3.8s",
          }}
        ></div>
        <div
          className={`absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-bounce ${
            isListening ? "opacity-100 animate-pulse" : "opacity-30"
          }`}
          style={{
            top: "45%",
            left: "25%",
            animationDelay: "2.5s",
            animationDuration: isListening ? "1.3s" : "3.2s",
          }}
        ></div>

        {/* Floating geometric shapes */}
        <div
          className={`absolute w-6 h-6 border-2 border-purple-400/20 rotate-45 animate-spin ${
            isListening ? "opacity-60" : "opacity-20"
          }`}
          style={{
            top: "20%",
            right: "20%",
            animationDuration: isListening ? "8s" : "20s",
          }}
        ></div>
        <div
          className={`absolute w-4 h-4 border border-pink-400/25 rounded-full animate-spin ${
            isListening ? "opacity-50" : "opacity-15"
          }`}
          style={{
            bottom: "25%",
            right: "10%",
            animationDuration: isListening ? "12s" : "25s",
            animationDirection: "reverse",
          }}
        ></div>

        {/* Pulsing energy waves when listening */}
        {isListening && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-pink-500/8 to-transparent animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </>
        )}
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="text-3xl text-center flex items-center justify-center gap-3 text-white">
          <Brain
            className={`w-8 h-8 ${
              isListening ? "text-purple-400 animate-pulse" : "text-purple-300"
            }`}
          />
          Speak to Orchestrator
        </CardTitle>
        <CardDescription className="text-center text-lg text-purple-200/80 font-medium">
          {isListening
            ? "🎧 AI is listening and analyzing your command..."
            : "Your AI agent awaits your command"}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center space-y-8 relative z-10">
        {/* Enhanced Microphone Visualization */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer energy ring */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-700 ${
                isListening
                  ? "bg-gradient-to-r from-purple-500/25 via-pink-500/20 to-yellow-500/15 animate-spin"
                  : "bg-gradient-to-r from-purple-600/10 to-slate-600/10"
              }`}
              style={{
                width: "220px",
                height: "220px",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
                animationDuration: isListening ? "4s" : "20s",
              }}
            ></div>

            {/* Middle pulsing ring */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-500 ${
                isListening
                  ? "bg-gradient-to-r from-purple-400/35 via-pink-400/30 to-cyan-400/25 animate-pulse"
                  : "bg-gradient-to-r from-purple-700/15 to-slate-700/15 animate-pulse"
              }`}
              style={{
                width: "180px",
                height: "180px",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
                animationDuration: isListening ? "2s" : "4s",
              }}
            ></div>

            {/* Inner breathing ring */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-300 ${
                isListening
                  ? "bg-gradient-to-r from-purple-300/20 to-pink-300/20 animate-ping"
                  : "bg-gradient-to-r from-purple-800/20 to-slate-800/20 animate-pulse"
              }`}
              style={{
                width: "200px",
                height: "200px",
                transform: "translate(-50%, -50%)",
                top: "50%",
                left: "50%",
                animationDuration: isListening ? "1.5s" : "3s",
              }}
            ></div>

            {/* Main microphone circle - Enhanced with click interaction */}
            <div
              onClick={isListening ? stopListening : startListening}
              className={`w-40 h-40 rounded-full border-4 flex items-center justify-center transition-all duration-500 relative cursor-pointer group ${
                isListening
                  ? "border-purple-400 bg-gradient-to-br from-purple-500/40 to-pink-500/40 shadow-purple-400/60 shadow-2xl animate-pulse"
                  : "border-purple-600/60 bg-gradient-to-br from-slate-700/50 to-purple-800/50 hover:bg-gradient-to-br hover:from-purple-700/60 hover:to-pink-700/60 hover:border-purple-400/80 hover:shadow-xl hover:shadow-purple-500/30"
              }`}
              style={{
                transform: isListening
                  ? `scale(${1.1 + audioLevel / 200}) rotate(${
                      audioLevel / 50
                    }deg)`
                  : "scale(1)",
                background: isListening
                  ? `radial-gradient(circle, rgba(147, 51, 234, ${
                      0.4 + audioLevel / 500
                    }) 0%, rgba(236, 72, 153, ${0.3 + audioLevel / 600}) 100%)`
                  : "radial-gradient(circle, rgba(100, 116, 139, 0.4) 0%, rgba(88, 28, 135, 0.6) 100%)",
                boxShadow: isListening
                  ? `0 0 ${
                      20 + audioLevel / 10
                    }px rgba(147, 51, 234, 0.6), 0 0 ${
                      40 + audioLevel / 5
                    }px rgba(236, 72, 153, 0.4)`
                  : "0 0 20px rgba(147, 51, 234, 0.2)",
              }}
            >
              {/* Breathing effect when not listening */}
              {!isListening && (
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 animate-pulse"></div>
              )}

              {/* AI brain icon overlay when listening */}
              {isListening && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2 animate-bounce">
                    <Brain className="w-4 h-4 text-white animate-pulse" />
                  </div>
                </div>
              )}

              {/* Energy particles around microphone when listening */}
              {isListening && (
                <>
                  <div
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                    style={{ top: "10%", left: "20%", animationDelay: "0s" }}
                  ></div>
                  <div
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                    style={{ top: "80%", right: "15%", animationDelay: "0.3s" }}
                  ></div>
                  <div
                    className="absolute w-1 h-1 bg-pink-400 rounded-full animate-ping"
                    style={{ left: "10%", top: "50%", animationDelay: "0.6s" }}
                  ></div>
                  <div
                    className="absolute w-2 h-2 bg-purple-300 rounded-full animate-ping"
                    style={{ right: "10%", top: "30%", animationDelay: "0.9s" }}
                  ></div>
                </>
              )}

              {isListening ? (
                <div className="flex flex-col items-center">
                  <Mic
                    className="w-16 h-16 text-white animate-pulse"
                    style={{
                      filter: `brightness(${1.2 + audioLevel / 300})`,
                      transform: `scale(${1 + audioLevel / 400})`,
                    }}
                  />
                  <div className="text-xs text-white mt-2 font-bold tracking-wider">
                    🎧 LISTENING
                  </div>
                  <div className="text-xs text-purple-200 mt-1">
                    {audioLevel > 50
                      ? "🔊 LOUD"
                      : audioLevel > 20
                      ? "🔉 NORMAL"
                      : "🔈 QUIET"}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center group-hover:scale-110 transition-transform duration-300">
                  <Mic className="w-16 h-16 text-purple-200 group-hover:text-white transition-colors duration-300" />
                  <div className="text-xs text-purple-300 mt-2 group-hover:text-white transition-colors duration-300">
                    TAP TO SPEAK
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Live Transcript */}
        {transcript && (
          <div className="p-6 bg-gradient-to-r from-purple-900/60 to-pink-900/40 rounded-xl border border-purple-400/40 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
              <p className="text-sm text-purple-300 font-medium">
                AI Processing:
              </p>
            </div>
            <p className="text-xl text-white font-medium leading-relaxed">
              {transcript}
            </p>
          </div>
        )}

        {/* Enhanced Last Command */}
        {lastCommand && (
          <div className="p-6 bg-gradient-to-r from-green-900/40 to-emerald-900/30 rounded-xl border border-green-400/40 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400"></div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-green-400" />
              <p className="text-sm text-green-300 font-medium">
                Command Executed:
              </p>
            </div>
            <p className="text-xl text-white font-medium leading-relaxed">
              {lastCommand}
            </p>
          </div>
        )}

        {/* Enhanced AI Status indicator */}
        <div className="flex justify-center items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full relative ${
                isListening ? "bg-green-400 animate-pulse" : "bg-slate-500"
              }`}
            >
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full bg-green-300 animate-pulse"></div>
                </>
              )}
            </div>
          </div>

          {/* Audio level indicator when listening */}
          {isListening && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-purple-300">Audio:</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-3 rounded-full transition-all duration-200 ${
                      audioLevel > i * 20
                        ? "bg-gradient-to-t from-green-500 to-yellow-400"
                        : "bg-slate-600"
                    }`}
                    style={{
                      height: audioLevel > i * 20 ? `${8 + i * 2}px` : "4px",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceControl;
