import React, { useContext, useEffect, useState } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaWaveSquare, FaRandom, FaRedo, FaMinus, FaVolumeMute } from 'react-icons/fa';
import { GiGrandPiano, GiSaxophone } from 'react-icons/gi';
import { AudioContext } from '../contexts/AudioContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks'; // Added remark-breaks plugin

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
  const [albumArt, setAlbumArt] = useState('/album-art/default-album-art.png'); // Default album art
  const [duration, setDuration] = useState(0); // Track duration

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration); // Update duration
      }
    };
    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, [audioRef]);

  useEffect(() => {
    if (playlist.length > 0) {
      const currentSong = playlist[currentTrack];
      const artPath = `/album-art/${currentSong.title.replace('.mp3', '')}.png`; // Construct path for album art
      fetch(artPath)
        .then(response => {
          if (response.ok) {
            setAlbumArt(artPath); // Set album art if it exists
          } else {
            setAlbumArt('/album-art/default-album-art.png'); // Set default if not found
          }
        })
        .catch(() => setAlbumArt('/album-art/default-album-art.png')); // Fallback to default on error
    } else {
      setAlbumArt('/album-art/default-album-art.png'); // Reset to default if no track
    }
  }, [currentTrack, playlist]);

  const genreButtons = [
    { genre: 'alternative', icon: <FaWaveSquare size={20} /> },
    { genre: 'hardrock', icon: <GiGrandPiano size={20} /> },
    { genre: 'classical', icon: <GiSaxophone size={20} /> },
    { genre: 'jazz', icon: <FaVolumeMute size={20} /> },
  ];

  const handleGenreClick = async (genre) => {
    console.log('Genre clicked:', genre);
    if (genre !== 'none') {
      await loadPlaylist(genre);
      setActiveGenre(genre);
    } else {
      stopAndClearPlaylist();
      setActiveGenre(null);
    }
  };

  const formatSongTitle = (title) => {
    return title ? title.replace(/\.(mp3|wav|ogg)$/, '') : 'Set the mood above';
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlay = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = playlist[index].url; // Use the URL as-is
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));
    }
  };

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex justify-center space-x-4 mb-4"> {/* Increased margin-bottom from mb-2 to mb-4 */}
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
      
      <div className="flex items-center mb-2 w-full"> {/* Reduced margin */}
        <img src={albumArt} alt="Album Art" className="w-14 h-14 bg-gray-300 dark:bg-gray-600 rounded-lg mr-4 flex-shrink-0" /> {/* Increased size by 20% */}
        <div className="flex-grow">
          <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            {playlist.length > 0 ? formatSongTitle(playlist[currentTrack].title) : 'Set the mood above'}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">AI Generated Music</p>
        </div>
      </div>
      
      <div className="flex items-center mb-2 w-full"> {/* Reduced margin */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleShuffle} 
            className={`p-1 rounded-full ${isShuffled ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-blue-600 hover:text-white transition-colors`}
          >
            <FaRandom size={11} />
          </button>
          <button onClick={prevTrack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
            <FaStepBackward size={15} />
          </button>
          <button onClick={playPause} className="w-7 h-7 flex items-center justify-center bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
            {isPlaying ? <FaPause size={15} /> : <FaPlay size={15} />}
          </button>
          <button onClick={nextTrack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
            <FaStepForward size={15} />
          </button>
          <button 
            onClick={toggleRepeat} 
            className={`p-1 rounded-full ${repeatMode !== 'off' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-blue-600 hover:text-white transition-colors`}
          >
            <FaRedo size={11} />
          </button>
        </div>
      </div>

      <div className="flex items-center mb-4 w-full"> {/* Adjusted margin */}
        <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">{formatTime(audioRef.current?.currentTime || 0)}</span> {/* Current time */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-full appearance-none cursor-pointer"
        />
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">{formatTime(duration)}</span> {/* Total duration */}
      </div>
      
      {playlist.length > 0 && ( // Conditional rendering for playlist
        <div className="flex-grow overflow-y-auto mb-4 bg-gray-100 dark:bg-gray-700 p-2 rounded w-full"> {/* Subtle background for playlist */}
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
                  className="cursor-pointer flex-grow text-left"
                  onClick={() => handlePlay(index)}
                >
                  {formatSongTitle(track.title)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 max-h-60 overflow-y-auto w-full">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]} // Added remarkBreaks plugin
          rehypePlugins={[rehypeRaw]}
          className="prose dark:prose-invert max-w-none"
        >
          {getCurrentLyrics()}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MusicPlayer;