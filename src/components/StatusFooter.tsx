import React from "react";

interface StatusFooterProps {
  isListening: boolean;
}

const StatusFooter: React.FC<StatusFooterProps> = ({ isListening }) => {
  return (
    <div className="mt-12 flex justify-center">
      <div className="relative">
        {/* Modern quote box */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl px-8 py-6 max-w-md">
          <div className="text-center">
            {/* Quote mark */}
            <div className="text-4xl text-purple-400/60 mb-2 font-serif"></div>

            {/* Quote text */}
            <p className="text-lg font-medium bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent leading-relaxed">
              "Dream, drum, move, command"
            </p>

            {/* Decorative elements */}
            <div className="flex justify-center mt-4 space-x-1">
              <div className="w-2 h-2 bg-purple-400/40 rounded-full"></div>
              <div className="w-2 h-2 bg-pink-400/40 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-400/40 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl -z-10"></div>
      </div>
    </div>
  );
};

export default StatusFooter;
