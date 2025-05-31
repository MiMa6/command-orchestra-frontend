import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: "circle" | "square" | "triangle";
}

interface AnimatedBackgroundProps {
  isVoiceActive?: boolean;
  intensity?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  isVoiceActive = false,
  intensity = 1,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Initialize particles
  useEffect(() => {
    const initialParticles: Particle[] = [];
    const particleCount = isVoiceActive ? 60 : 35;

    const colors = [
      "rgba(147, 51, 234, 0.25)", // purple - reduced from 0.6
      "rgba(236, 72, 153, 0.25)", // pink - reduced from 0.6
      "rgba(59, 130, 246, 0.25)", // blue - reduced from 0.6
      "rgba(16, 185, 129, 0.25)", // emerald - reduced from 0.6
      "rgba(245, 158, 11, 0.25)", // amber - reduced from 0.6
      "rgba(99, 102, 241, 0.25)", // indigo - reduced from 0.6
    ];

    for (let i = 0; i < particleCount; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * (isVoiceActive ? 2 : 0.5),
        vy: (Math.random() - 0.5) * (isVoiceActive ? 2 : 0.5),
        size: Math.random() * (isVoiceActive ? 6 : 3) + 1,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: ["circle", "square", "triangle"][
          Math.floor(Math.random() * 3)
        ] as "circle" | "square" | "triangle",
      });
    }

    setParticles(initialParticles);
  }, [isVoiceActive]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let newX = particle.x + particle.vx * intensity;
          let newY = particle.y + particle.vy * intensity;

          // Bounce off edges
          if (newX < 0 || newX > window.innerWidth) {
            particle.vx *= -1;
            newX = Math.max(0, Math.min(newX, window.innerWidth));
          }
          if (newY < 0 || newY > window.innerHeight) {
            particle.vy *= -1;
            newY = Math.max(0, Math.min(newY, window.innerHeight));
          }

          // Mouse interaction - particles are attracted to mouse when voice is active
          if (isVoiceActive) {
            const dx = mousePosition.x - newX;
            const dy = mousePosition.y - newY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              const force = ((150 - distance) / 150) * 0.02;
              particle.vx += (dx / distance) * force;
              particle.vy += (dy / distance) * force;
            }
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            opacity: isVoiceActive
              ? 0.4 + Math.sin(Date.now() * 0.005 + particle.id) * 0.3
              : particle.opacity,
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 16); // ~60fps
    return () => clearInterval(interval);
  }, [mousePosition, isVoiceActive, intensity]);

  const renderParticle = (particle: Particle) => {
    const style = {
      position: "absolute" as const,
      left: particle.x,
      top: particle.y,
      width: particle.size,
      height: particle.size,
      opacity: particle.opacity,
      transform: `translate(-50%, -50%) scale(${isVoiceActive ? 1.2 : 1})`,
      transition: "transform 0.3s ease-out",
      pointerEvents: "none" as const,
    };

    switch (particle.type) {
      case "circle":
        return (
          <div
            key={particle.id}
            style={{
              ...style,
              backgroundColor: particle.color,
              borderRadius: "50%",
              boxShadow: isVoiceActive
                ? `0 0 ${particle.size * 1.5}px ${particle.color}`
                : "none",
            }}
          />
        );
      case "square":
        return (
          <div
            key={particle.id}
            style={{
              ...style,
              backgroundColor: particle.color,
              transform: `${style.transform} rotate(${
                Date.now() * 0.001 + particle.id
              }rad)`,
            }}
          />
        );
      case "triangle":
        return (
          <div
            key={particle.id}
            style={{
              ...style,
              width: 0,
              height: 0,
              backgroundColor: "transparent",
              borderLeft: `${particle.size / 2}px solid transparent`,
              borderRight: `${particle.size / 2}px solid transparent`,
              borderBottom: `${particle.size}px solid ${particle.color}`,
              transform: `${style.transform} rotate(${
                Date.now() * 0.002 + particle.id
              }rad)`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 transition-all duration-1000 ${
          isVoiceActive
            ? "bg-gradient-to-br from-purple-900/15 via-pink-900/20 to-indigo-900/15"
            : "bg-gradient-to-br from-slate-900/8 via-purple-900/12 to-slate-900/8"
        }`}
        style={{
          animation: isVoiceActive ? "pulse 2s ease-in-out infinite" : "none",
        }}
      />

      {/* Energy waves when voice is active */}
      {isVoiceActive && (
        <>
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/4 to-transparent animate-pulse"
            style={{ animationDuration: "1.5s" }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-l from-transparent via-pink-500/4 to-transparent animate-pulse"
            style={{ animationDuration: "2s", animationDelay: "0.5s" }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/4 to-transparent animate-pulse"
            style={{ animationDuration: "2.5s", animationDelay: "1s" }}
          />
        </>
      )}

      {/* Constellation lines between nearby particles */}
      <svg className="absolute inset-0 w-full h-full">
        {particles.map((particle, i) =>
          particles.slice(i + 1).map((otherParticle, j) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100 && isVoiceActive) {
              return (
                <line
                  key={`${i}-${j}`}
                  x1={particle.x}
                  y1={particle.y}
                  x2={otherParticle.x}
                  y2={otherParticle.y}
                  stroke="rgba(147, 51, 234, 0.15)"
                  strokeWidth="0.5"
                  opacity={Math.max(0, 1 - distance / 100)}
                />
              );
            }
            return null;
          })
        )}
      </svg>

      {/* Floating particles */}
      {particles.map(renderParticle)}

      {/* Mouse following glow effect when voice is active */}
      {isVoiceActive && (
        <div
          className="absolute pointer-events-none transition-all duration-100"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            width: "200px",
            height: "200px",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      )}
    </div>
  );
};

export default AnimatedBackground;
