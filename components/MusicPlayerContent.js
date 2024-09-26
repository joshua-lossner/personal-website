import React, { useContext, useEffect, useState } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo } from 'react-icons/fa';
import { AudioContext } from '../contexts/AudioContext';
import Image from 'next/image';

// Remove the unused 'posts' prop
const MusicPlayerContent = () => {
  const { 
    playlist, 
    currentTrack, 
    isPlaying, 
    playPause, 
    nextTrack, 
    prevTrack, 
    audioRef,
    toggleShuffle,
    toggleRepeat,
    isShuffled,
    repeatMode,
    S3_BASE_URL_ALBUMS
  } = useContext(AudioContext);

  const [progress, setProgress] = useState(0);
  const [albumArt, setAlbumArt] = useState('/album-art/default-album-art.png');
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    };
    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [audioRef]);

  useEffect(() => {
    if (playlist.length > 0) {
      const currentSong = playlist[currentTrack];
      const artFileName = encodeURIComponent(currentSong.title.replace('.mp3', '').trim()) + '.png';
      const artPath = `${S3_BASE_URL_ALBUMS}/${artFileName}`;
      setAlbumArt(artPath);
      
      const img = new Image();
      img.onerror = () => {
        console.error('Failed to load album art:', artPath);
        setAlbumArt(`${S3_BASE_URL_ALBUMS}/default-album-art.png`);
      };
      img.src = artPath;
    } else {
      setAlbumArt(`${S3_BASE_URL_ALBUMS}/default-album-art.png`);
    }
  }, [currentTrack, playlist, S3_BASE_URL_ALBUMS]);

  const formatSongTitle = (title) => {
    return title ? title.replace(/\.(mp3|wav|ogg)$/, '') : 'Set the mood above';
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Image 
          src={albumArt} 
          alt="Album Art" 
          width={56} 
          height={56}
          className="rounded-lg mr-4"
        />
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {playlist.length > 0 ? formatSongTitle(playlist[currentTrack].title) : 'No track selected'}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">AI Generated Music</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <button onClick={toggleShuffle} className={`text-sm ${isShuffled ? 'text-blue-500' : 'text-gray-500'}`}>
          <FaRandom />
        </button>
        <button onClick={prevTrack} className="text-gray-600 dark:text-gray-300">
          <FaStepBackward />
        </button>
        <button onClick={playPause} className="bg-blue-500 text-white rounded-full p-3">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={nextTrack} className="text-gray-600 dark:text-gray-300">
          <FaStepForward />
        </button>
        <button onClick={toggleRepeat} className={`text-sm ${repeatMode !== 'off' ? 'text-blue-500' : 'text-gray-500'}`}>
          <FaRedo />
        </button>
      </div>

      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerContent;