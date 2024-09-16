import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaGuitar, FaRedo } from 'react-icons/fa';
import { GiGrandPiano, GiSaxophone } from 'react-icons/gi';

const MusicPlayer = ({ playlist = [], onLoadPlaylist }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (playlist.length > 0 && audioRef.current) {
      audioRef.current.src = playlist[currentTrack].url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [playlist, currentTrack, isPlaying]);

  const playPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleLoadPlaylist = (genre) => {
    onLoadPlaylist(genre);
    setCurrentTrack(0);
    setIsPlaying(true);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
    if (audioRef.current) {
      audioRef.current.loop = !isRepeat;
    }
  };

  const handleTrackEnd = () => {
    if (!isRepeat) {
      nextTrack();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-center space-x-4 mb-4">
        <button onClick={() => handleLoadPlaylist('piano')} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          <GiGrandPiano size={24} />
        </button>
        <button onClick={() => handleLoadPlaylist('string')} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          <FaGuitar size={24} />
        </button>
        <button onClick={() => handleLoadPlaylist('jazz')} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          <GiSaxophone size={24} />
        </button>
      </div>
      {playlist.length > 0 ? (
        <div>
          <audio ref={audioRef} onEnded={handleTrackEnd} />
          <div className="flex justify-center items-center space-x-4 mb-4">
            <button onClick={prevTrack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              <FaStepBackward size={20} />
            </button>
            <button onClick={playPause} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
            </button>
            <button onClick={nextTrack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              <FaStepForward size={20} />
            </button>
            <button 
              onClick={toggleRepeat} 
              className={`text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white ${isRepeat ? 'text-blue-500 dark:text-blue-400' : ''}`}
            >
              <FaRedo size={20} />
            </button>
          </div>
          {isPlaying && (
            <div className="mt-4 max-h-40 overflow-y-auto">
              <ul className="text-sm text-gray-600 dark:text-gray-400">
                {playlist.map((track, index) => (
                  <li 
                    key={index} 
                    className={`cursor-pointer p-1 ${index === currentTrack ? 'font-bold' : ''}`}
                    onClick={() => setCurrentTrack(index)}
                  >
                    {track.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">No tracks loaded. Select a playlist to start.</p>
      )}
    </div>
  );
};

export default MusicPlayer;