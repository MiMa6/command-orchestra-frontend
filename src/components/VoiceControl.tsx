import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  Mic,
  MicOff,
  Brain,
  Zap,
  MessageCircle,
  Settings,
  Volume2,
  Send,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useAudioVisualization } from "@/hooks/useAudioVisualization";

interface VoiceControlProps {
  isListening: boolean;
  transcript: string;
  lastCommand: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition: any;
  setIsListening: (listening: boolean) => void;
  setTranscript: (transcript: string) => void;
  isSpeaking?: boolean;
  conversationHistory?: Array<{
    type: "user" | "ai";
    text: string;
    timestamp: Date;
  }>;
  speak?: (text: string) => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  isListening,
  transcript,
  lastCommand,
  recognition,
  setIsListening,
  setTranscript,
  isSpeaking = false,
  conversationHistory = [],
  speak,
}) => {
  const { audioLevel, startAudioVisualization, stopAudioVisualization } =
    useAudioVisualization();

  const [textInput, setTextInput] = useState("");

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const userMessage = textInput.trim();
    setTextInput("");

    // Speak the user's text input
    if (speak) {
      speak(userMessage);
    }

    // Process the text as if it were a voice command
    // This will be handled by the speech recognition hook
    if (recognition && recognition.onresult) {
      // Simulate a speech recognition result
      const mockEvent = {
        results: [
          {
            0: { transcript: userMessage },
            isFinal: true,
          },
        ],
        resultIndex: 0,
      };
      recognition.onresult(mockEvent);
    }

    toast({
      title: "💬 Text Message Sent",
      description: `Processing: "${userMessage}"`,
      variant: "default",
    });
  };

  const startListening = async () => {
    if (!recognition) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        if (permission.state === "denied") {
          toast({
            title: "🎤 Microphone Access Denied",
            description:
              "Click the lock icon in your address bar and allow microphone access, then refresh the page.",
            variant: "destructive",
          });
          return;
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      await startAudioVisualization(stream, true);

      recognition.start();
      setIsListening(true);
      setTranscript("");

      toast({
        title: "🤖 AI Orchestrator Online",
        description: "Speak your command to the orchestrator...",
      });
    } catch (error: unknown) {
      console.error("Microphone access error:", error);

      let title = "Microphone Access Required";
      let description = "Please allow microphone access to use voice features.";

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          title = "🎤 Microphone Permission Needed";
          description =
            "In Arc: Click the 🔒 lock icon → Set Microphone to 'Allow' → Refresh page";
        } else if (error.name === "NotFoundError") {
          title = "🎤 No Microphone Detected";
          description = "Please connect a microphone and try again.";
        } else if (error.name === "NotSupportedError") {
          title = "🎤 Not Supported";
          description =
            "Your browser doesn't support microphone access over this connection.";
        } else if (error.name === "AbortError") {
          title = "🎤 Microphone Access Interrupted";
          description = "Microphone access was interrupted. Please try again.";
        }
      }

      toast({
        title,
        description,
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
    <div className="mb-8 space-y-4">
      <Card className="bg-gradient-to-br from-slate-800/80 via-purple-900/60 to-slate-800/80 border-purple-500/50 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-purple-500/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 transition-all duration-1000 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-slate-900/20"></div>

          <div
            className={`absolute w-4 h-4 rounded-full animate-bounce bg-purple-400/40 ${
              isListening ? "opacity-100 animate-pulse" : "opacity-30"
            }`}
            style={{
              top: "15%",
              left: "8%",
              animationDelay: "0s",
              animationDuration: isListening ? "2s" : "4s",
            }}
          ></div>

          {isSpeaking && (
            <>
              <div
                className="absolute w-3 h-3 bg-yellow-400/60 rounded-full animate-ping"
                style={{ top: "25%", right: "20%" }}
              ></div>
              <div
                className="absolute w-2 h-2 bg-orange-400/50 rounded-full animate-ping"
                style={{ top: "65%", left: "15%", animationDelay: "0.3s" }}
              ></div>
              <div
                className="absolute w-1 h-1 bg-red-400/40 rounded-full animate-ping"
                style={{ top: "45%", right: "25%", animationDelay: "0.6s" }}
              ></div>
            </>
          )}

          {isListening && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"></div>
          )}

          {isSpeaking && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/15 to-transparent animate-pulse"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-orange-500/10 to-transparent animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </>
          )}
        </div>

        <CardHeader className="relative z-10">
          <CardTitle className="text-3xl text-center flex items-center justify-center gap-3 text-white">
            <Brain
              className={`w-8 h-8 ${
                isListening
                  ? "text-purple-400 animate-pulse"
                  : "text-purple-300"
              }`}
            />
            {isSpeaking ? (
              <Volume2 className="w-6 h-6 text-yellow-400 animate-pulse" />
            ) : (
              "Orchestrator"
            )}
          </CardTitle>
          <CardDescription className="text-center text-lg font-medium">
            {isSpeaking ? (
              <span className="text-yellow-300">🔊 AI is speaking...</span>
            ) : isListening ? (
              <span className="text-purple-200/80">
                🎧 AI is listening and analyzing your command...
              </span>
            ) : (
              <span className="text-purple-200/80">
                Your Al agent awaits your command
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-8 relative z-10">
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-full transition-all duration-700 ${
                  isSpeaking
                    ? "bg-gradient-to-r from-yellow-500/25 via-orange-500/20 to-red-500/15 animate-spin"
                    : isListening
                    ? "bg-gradient-to-r from-purple-500/25 via-pink-500/20 to-yellow-500/15 animate-spin"
                    : "bg-gradient-to-r from-purple-600/10 to-slate-600/10"
                }`}
                style={{
                  width: "220px",
                  height: "220px",
                  transform: "translate(-50%, -50%)",
                  top: "50%",
                  left: "50%",
                  animationDuration: isSpeaking
                    ? "2s"
                    : isListening
                    ? "4s"
                    : "20s",
                }}
              ></div>

              <div
                onClick={isListening ? stopListening : startListening}
                className={`w-40 h-40 rounded-full border-4 flex items-center justify-center transition-all duration-500 relative cursor-pointer group ${
                  isSpeaking
                    ? "border-yellow-400 bg-gradient-to-br from-yellow-500/40 to-orange-500/40 shadow-yellow-400/60 shadow-2xl animate-pulse"
                    : isListening
                    ? "border-purple-400 bg-gradient-to-br from-purple-500/40 to-pink-500/40 shadow-purple-400/60 shadow-2xl animate-pulse"
                    : "border-purple-600/60 bg-gradient-to-br from-slate-700/50 to-purple-800/50 hover:bg-gradient-to-br hover:from-purple-700/60 hover:to-pink-700/60 hover:border-purple-400/80"
                }`}
              >
                {isSpeaking ? (
                  <div className="flex flex-col items-center">
                    <Volume2 className="w-16 h-16 text-white animate-pulse" />
                    <div className="text-xs text-white mt-2 font-bold tracking-wider">
                      🔊 SPEAKING
                    </div>
                  </div>
                ) : isListening ? (
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
                    <Mic className="w-16 h-16 transition-colors duration-300 text-purple-200 group-hover:text-white" />
                    <div className="text-xs mt-2 transition-colors duration-300 text-purple-300 group-hover:text-white">
                      TAP TO SPEAK
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text input for typing commands/messages */}
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your command or message here..."
                className="flex-1 bg-slate-800/80 border-purple-400/40 text-white placeholder-purple-200/60 focus:border-purple-400 focus:ring-purple-400/20"
                disabled={isListening || isSpeaking}
              />
              <Button
                type="submit"
                disabled={!textInput.trim() || isListening || isSpeaking}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {transcript && (
            <div className="p-6 rounded-xl border backdrop-blur-sm relative overflow-hidden bg-gradient-to-r from-purple-900/60 to-pink-900/40 border-purple-400/40">
              <div className="absolute top-0 left-0 w-full h-1 animate-pulse bg-gradient-to-r from-purple-400 to-pink-400"></div>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
                <p className="text-sm font-medium text-purple-300">
                  AI Processing: (NOT YET IMPLEMENTED COMMANDS STILL GO TO
                  BACKEND)
                </p>
              </div>
              <p className="text-xl text-white font-medium leading-relaxed">
                {transcript}
              </p>
            </div>
          )}

          {conversationHistory.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              <h3 className="text-lg font-medium text-purple-300 mb-4">
                Recent Commands & Responses
              </h3>
              {conversationHistory
                .slice()
                .reverse()
                .slice(0, 3)
                .map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-900/40 border-l-4 border-blue-400 ml-4"
                        : "bg-purple-900/40 border-l-4 border-purple-400 mr-4"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {message.type === "user" ? (
                        <Mic className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Brain className="w-4 h-4 text-purple-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          message.type === "user"
                            ? "text-blue-300"
                            : "text-purple-300"
                        }`}
                      >
                        {message.type === "user" ? "You" : "AI"}
                      </span>
                    </div>
                    <p className="text-white">{message.text}</p>
                  </div>
                ))}
            </div>
          )}

          <div className="flex justify-center items-center gap-4 text-sm">
            {isListening && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-purple-300">Audio:</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-3 rounded-full transition-all duration-200 ${
                        audioLevel > i * 20
                          ? "bg-gradient-to-t from-purple-500 to-yellow-400"
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
    </div>
  );
};

export default VoiceControl;
