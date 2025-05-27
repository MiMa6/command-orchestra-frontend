
import { useState, useRef } from 'react';

export const useAudioVisualization = () => {
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const startAudioVisualization = async (stream: MediaStream, isListening: boolean) => {
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    
    const updateAudioLevel = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(average);
      }
      if (isListening) {
        requestAnimationFrame(updateAudioLevel);
      }
    };
    updateAudioLevel();
  };

  const stopAudioVisualization = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioLevel(0);
  };

  return {
    audioLevel,
    startAudioVisualization,
    stopAudioVisualization
  };
};
