import React, { useContext, useEffect, useState } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo, FaList, FaRadio } from 'react-icons/fa';
import { AudioContext } from '../contexts/AudioContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import Image from 'next/image';

const DynamicMusicPlayerContent = () => {
  const { 
    playlist, 
    currentTrack, 
    isPlaying,
    playPause, 
    nextTrack, 
    prevTrack, 
    setCurrentTrack,
    audioRef,
    toggleShuffle,
    toggleRepeat,
    isShuffled,
    repeatMode,
    S3_BASE_URL_ALBUMS,
    radioStations,
    currentRadioStation,
    setCurrentRadioStation
    // Remove loadRadioStation and currentArtwork from here
  } = useContext(AudioContext);

  const [progress, setProgress] = useState(0);
  const [albumArt, setAlbumArt] = useState('/album-art/default-album-art.png');
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showRadioStations, setShowRadioStations] = useState(false);

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

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const handleEnded = () => {
        if (repeatMode === 'one') {
          audio.currentTime = 0;
          audio.play();
        } else if (repeatMode === 'all' || (!isShuffled && currentTrack < playlist.length - 1)) {
          nextTrack();
        } else if (isShuffled) {
          const nextIndex = Math.floor(Math.random() * playlist.length);
          setCurrentTrack(nextIndex);
        }
      };
      
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [audioRef, repeatMode, isShuffled, currentTrack, playlist.length, nextTrack, setCurrentTrack]);

  const formatSongTitle = (title) => {
    return title ? title.replace(/\.(mp3|wav|ogg)$/, '') : 'Choose Vibe Below';
  };

  const getCurrentLyrics = () => {
    if (playlist.length > 0) {
      const currentSong = playlist[currentTrack];
      return currentSong.lyrics || "No lyrics available for this track.";
    }
    return "No track is currently playing.";
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

  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
    if (!showPlaylist) {
      setShowRadioStations(false);
    }
  };

  const toggleRadioStations = () => {
    console.log('Toggle Radio Stations clicked');
    setShowRadioStations(!showRadioStations);
    if (!showRadioStations) {
      setShowPlaylist(false);
    }
  };

  const handleRadioStationClick = (stationId) => {
    setCurrentRadioStation(stationId);
    // If you need to load the radio station, you can add the logic here
    // or call a function from the AudioContext that handles this
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
            {playlist.length > 0 ? formatSongTitle(playlist[currentTrack].title) : 'Choose Vibe Below'}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">AI Generated Music</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4 flex-wrap">
        <div className="flex items-center space-x-2">
          <button onClick={toggleShuffle} className={`text-sm ${isShuffled ? 'text-blue-500' : 'text-gray-500'}`}>
            <FaRandom />
          </button>
          <button onClick={prevTrack} className="text-gray-600 dark:text-gray-300">
            <FaStepBackward />
          </button>
          <button onClick={playPause} className="bg-blue-500 text-white rounded-full p-2">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={nextTrack} className="text-gray-600 dark:text-gray-300">
            <FaStepForward />
          </button>
          <button onClick={toggleRepeat} className={`text-sm ${repeatMode !== 'off' ? 'text-blue-500' : 'text-gray-500'}`}>
            <FaRedo />
          </button>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <button onClick={togglePlaylist} className={`text-sm ${showPlaylist ? 'text-blue-500' : 'text-gray-500'}`}>
            <FaList />
          </button>
          <button onClick={toggleRadioStations} className={`text-sm ${showRadioStations ? 'text-blue-500' : 'text-gray-500'}`}>
            <FaRadio />
          </button>
        </div>
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
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-h-40 overflow-y-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          className="prose dark:prose-invert max-w-none"
        >
          {getCurrentLyrics()}
        </ReactMarkdown>
      </div>

      {showPlaylist && playlist.length > 0 && (
        <div className="mt-4 max-h-60 overflow-y-auto relative"> {/* Add max-h-60, overflow-y-auto, and relative */}
          <h3 className="text-sm font-semibold mb-2">Playlist</h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400">
            {playlist.map((track, index) => ( /* Remove the slice(0, 10) limitation */
              <li 
                key={index}
                className={`cursor-pointer p-2 rounded ${index === currentTrack ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                onClick={() => setCurrentTrack(index)}
              >
                {formatSongTitle(track.title)}
              </li>
            ))}
          </ul>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none"></div> {/* Add gradient overlay */}
        </div>
      )}

      {showRadioStations && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Radio Stations</h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400">
            {radioStations.map((station) => (
              <li 
                key={station.id}
                className={`cursor-pointer p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${currentRadioStation === station.id ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                onClick={() => handleRadioStationClick(station.id)}
              >
                {station.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DynamicMusicPlayerContent;