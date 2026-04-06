import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { AppLanguage } from '../../data/appPreferences';
import { studyContent } from '../../data/studyContent';

interface Props {
  src: string;
  language: AppLanguage;
  autoPlay?: boolean;
  autoPlayToken?: string | number;
  className?: string;
  size?: number;
}

export const AudioButton: React.FC<Props> = ({
  src,
  language,
  autoPlay = false,
  autoPlayToken,
  className = '',
  size = 24
}) => {
  const copy = studyContent[language];
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSrcRef = useRef<string | null>(null);

  const ensureAudio = () => {
    if (!audioRef.current || currentSrcRef.current !== src) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const nextAudio = new Audio(src);
      nextAudio.onended = () => setIsPlaying(false);
      nextAudio.onerror = () => {
        setIsPlaying(false);
        setError(true);
      };

      audioRef.current = nextAudio;
      currentSrcRef.current = src;
    }

    return audioRef.current;
  };

  const playAudio = () => {
    const audio = ensureAudio();

    setIsPlaying(true);
    setError(false);
    audio.currentTime = 0;
    audio.play().catch(() => {
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
  }, [src, autoPlay, autoPlayToken]);

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
      title={error ? copy.audio.unavailable : copy.audio.play}
      aria-label={error ? copy.audio.unavailable : copy.audio.play}
    >
      {error ? <VolumeX size={size} /> : <Volume2 size={size} className={isPlaying ? 'animate-pulse' : ''} />}
    </button>
  );
};
