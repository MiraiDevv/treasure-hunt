import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Volume1, VolumeX, Maximize, Minimize, RotateCcw } from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);

  // Controle de Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Controle de Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Controle de Tempo
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Formatação do tempo
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Controle da Timeline
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Controle de Tela Cheia
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Velocidade de Reprodução
  const handlePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  // Efeito para definir a duração inicial
  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, [videoRef.current?.duration]);

  return (
    <div 
      className="relative group w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full rounded-xl"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
      />

      {/* Controles */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Timeline */}
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 mb-4 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
        />

        <div className="flex items-center justify-between">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="text-white hover:text-pink-500 transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
              className="text-white hover:text-pink-500 transition-colors"
            >
              {volume === 0 ? <VolumeX size={24} /> : 
               volume < 0.5 ? <Volume1 size={24} /> : 
               <Volume2 size={24} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm"
            />
          </div>

          {/* Tempo */}
          <div className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Velocidade */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlaybackRate(1)}
              className={`px-2 py-1 rounded ${playbackRate === 1 ? 'bg-pink-500' : 'bg-gray-700'} text-white text-sm`}
            >
              1x
            </button>
            <button
              onClick={() => handlePlaybackRate(1.5)}
              className={`px-2 py-1 rounded ${playbackRate === 1.5 ? 'bg-pink-500' : 'bg-gray-700'} text-white text-sm`}
            >
              1.5x
            </button>
            <button
              onClick={() => handlePlaybackRate(2)}
              className={`px-2 py-1 rounded ${playbackRate === 2 ? 'bg-pink-500' : 'bg-gray-700'} text-white text-sm`}
            >
              2x
            </button>
          </div>

          {/* Tela Cheia */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-pink-500 transition-colors"
          >
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer; 