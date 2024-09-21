import React, { useContext, useEffect, useState } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaWaveSquare, FaRandom, FaRedo, FaMinus, FaVolumeMute } from 'react-icons/fa';
import { GiGrandPiano, GiSaxophone } from 'react-icons/gi';
import { AudioContext } from '../contexts/AudioContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const MusicPlayer = ({ posts = [] }) => {
  const { 
    playlist, 
    currentTrack, 
    isPlaying, 
    playPause, 
    nextTrack, 
    prevTrack, 
    loadPlaylist, 
    setCurrentTrack,
    removeFromPlaylist,
    audioRef,
    toggleShuffle,
    toggleRepeat,
    isShuffled,
    repeatMode,
    stopAndClearPlaylist
  } = useContext(AudioContext);

  const [progress, setProgress] = useState(0);
  const [activeGenre, setActiveGenre] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [audioRef]);

  const genreButtons = [
    { genre: 'ambient', icon: <FaWaveSquare size={20} /> },
    { genre: 'classical', icon: <GiGrandPiano size={20} /> },
    { genre: 'jazz', icon: <GiSaxophone size={20} /> },
    { genre: 'none', icon: <FaVolumeMute size={20} /> },
  ];

  const handleGenreClick = (genre) => {
    console.log('Genre clicked:', genre);
    if (genre !== 'none') {
      loadPlaylist(genre);
      setActiveGenre(genre);
    } else {
      stopAndClearPlaylist();
      setActiveGenre(null);
    }
  };

  const formatSongTitle = (title) => {
    return title ? title.replace('.mp3', '') : 'Set the mood above';
  };

  const getCurrentLyrics = () => {
    if (playlist.length > 0) {
      const currentSong = playlist[currentTrack];
      const songPost = posts.find(post => post.audioFile === currentSong.title);
      return songPost ? songPost.content : '';
    }
    return '';
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center space-x-4 mb-4">
        {genreButtons.map(({ genre, icon }) => (
          <button 
            key={genre} 
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors
              ${activeGenre === genre || (genre === 'none' && activeGenre === null) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}
              hover:bg-blue-600 hover:text-white`}
            onClick={() => handleGenreClick(genre)}
          >
            {icon}
          </button>
        ))}
      </div>
      
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg mr-4 flex-shrink-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <FaPlay size={20} />
        </div>
        <div className="flex-grow">
          <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            {playlist.length > 0 ? formatSongTitle(playlist[currentTrack].title) : 'Set the mood above'}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">AI Generated Music</p>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-full appearance-none cursor-pointer"
        />
      </div>
      
      <div className="flex justify-center items-center mb-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleShuffle} 
            className={`p-1.5 rounded-full ${isShuffled ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-blue-600 hover:text-white transition-colors`}
          >
            <FaRandom size={11} />
          </button>
          <button onClick={prevTrack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
            <FaStepBackward size={15} />
          </button>
          <button onClick={playPause} className="w-9 h-9 flex items-center justify-center bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
            {isPlaying ? <FaPause size={15} /> : <FaPlay size={15} />}
          </button>
          <button onClick={nextTrack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
            <FaStepForward size={15} />
          </button>
          <button 
            onClick={toggleRepeat} 
            className={`p-1.5 rounded-full ${repeatMode !== 'off' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-blue-600 hover:text-white transition-colors`}
          >
            <FaRedo size={11} />
          </button>
        </div>
      </div>
      
      {playlist.length > 0 && (
        <>
          <div className="flex-grow overflow-y-auto mb-4">
            <ul className="text-xs text-gray-600 dark:text-gray-400">
              {playlist.map((track, index) => (
                <li 
                  key={index} 
                  className={`flex justify-between items-center p-2 rounded transition-all duration-200
                    ${index === currentTrack 
                      ? 'bg-gray-300 dark:bg-gray-600 text-blue-500' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-500'}`}
                >
                  <button 
                    onClick={() => removeFromPlaylist(index)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors mr-2"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span 
                    className="cursor-pointer flex-grow"
                    onClick={() => setCurrentTrack(index)}
                  >
                    {formatSongTitle(track.title)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 max-h-60 overflow-y-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              className="prose dark:prose-invert max-w-none"
            >
              {getCurrentLyrics()}
            </ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
};

export default MusicPlayer;