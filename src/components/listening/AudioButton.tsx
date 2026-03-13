import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface Props {
  src: string;
  autoPlay?: boolean;
  className?: string;
  size?: number;
}

export const AudioButton: React.FC<Props> = ({ src, autoPlay = false, className = '', size = 24 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        setError(true);
      };
    }
    
    setIsPlaying(true);
    setError(false);
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      setIsPlaying(false);
      setError(true);
    });
  };

  React.useEffect(() => {
    if (autoPlay) {
      playAudio();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [src, autoPlay]);

  return (
    <button
      onClick={playAudio}
      disabled={isPlaying}
      className={`flex items-center justify-center rounded-full transition-colors ${
        error 
          ? 'bg-red-100 text-red-500 hover:bg-red-200' 
          : isPlaying 
            ? 'bg-indigo-200 text-indigo-700' 
            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
      } ${className}`}
      title={error ? "Audio not available" : "Play audio"}
    >
      {error ? <VolumeX size={size} /> : <Volume2 size={size} className={isPlaying ? 'animate-pulse' : ''} />}
    </button>
  );
};
