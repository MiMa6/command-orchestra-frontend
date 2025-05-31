import React, { useEffect, useState } from "react";
import { Sparkles, Zap, Music } from "lucide-react";

const Header = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="text-center mb-12 relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-1/4 animate-float">
          <Sparkles className="w-4 h-4 text-purple-400/40" />
        </div>
        <div
          className="absolute top-8 right-1/3 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <Zap className="w-3 h-3 text-pink-400/40" />
        </div>
        <div
          className="absolute top-2 right-1/4 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <Music className="w-4 h-4 text-cyan-400/40" />
        </div>
      </div>

      {/* Main Title */}
      <div
        className={`
        transition-all duration-1000 ease-out transform
        ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
      `}
      >
        <h1 className="text-6xl font-bold mb-4 relative">
          {/* Gradient text with animation */}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-shift">
            Command Orchestra
          </span>

          {/* Glow effect behind text */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/8 via-pink-400/8 to-cyan-400/8 blur-xl -z-10 animate-pulse"></div>
        </h1>
      </div>

      {/* Subtitle */}
      <div
        className={`
        transition-all duration-1000 ease-out transform
        ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
      `}
        style={{ transitionDelay: "200ms" }}
      >
        <p className="text-xl text-purple-200/90 mb-2 font-medium">
          AI-Powered Workflow Automation
        </p>
      </div>

      {/* Description */}
      <div
        className={`
        transition-all duration-1000 ease-out transform
        ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
      `}
        style={{ transitionDelay: "400ms" }}
      >
        <p className="text-purple-300/70 max-w-2xl mx-auto leading-relaxed">
          Orchestrate your digital workspace with voice commands and intelligent
          automation. Seamlessly integrate your productivity tools and
          workflows.
        </p>
      </div>

      {/* Animated separator line */}
      <div
        className={`
        mt-8 flex justify-center transition-all duration-1000 ease-out
        ${mounted ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}
      `}
        style={{ transitionDelay: "600ms" }}
      >
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
      </div>

      {/* Status indicators */}
      <div
        className={`
        mt-6 flex justify-center items-center gap-4 transition-all duration-1000 ease-out
        ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
      `}
        style={{ transitionDelay: "800ms" }}
      >
        <div className="flex items-center gap-2 text-sm text-purple-300/80">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Orchestra Online</span>
        </div>
        <div className="w-1 h-4 bg-purple-500/30"></div>
        <div className="flex items-center gap-2 text-sm text-purple-300/80">
          <div
            className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <span>AI Ready</span>
        </div>
        <div className="w-1 h-4 bg-purple-500/30"></div>
        <div className="flex items-center gap-2 text-sm text-purple-300/80">
          <div
            className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <span>Voice Active</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
