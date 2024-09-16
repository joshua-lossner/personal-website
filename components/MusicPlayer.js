import React, { useContext, useState } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaGuitar } from 'react-icons/fa';
import { GiGrandPiano, GiSaxophone } from 'react-icons/gi';
import { AudioContext } from '../contexts/AudioContext';

const MusicPlayer = () => {
  const { playlist, currentTrack, isPlaying, playPause, nextTrack, prevTrack, loadPlaylist, setCurrentTrack } = useContext(AudioContext);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const genreButtons = [
    { genre: 'piano', icon: <GiGrandPiano size={24} /> },
    { genre: 'string', icon: <FaGuitar size={24} /> },
    { genre: 'jazz', icon: <GiSaxophone size={24} /> },
  ];

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    loadPlaylist(genre);
  };

  // Function to remove .mp3 extension from song title
  const formatSongTitle = (title) => {
    return title.replace('.mp3', '');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-center space-x-4 mb-6">
        {genreButtons.map(({ genre, icon }) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            className={`w-12 h-12 flex items-center justify-center rounded-full 
              ${selectedGenre === genre 
                ? 'bg-gray-900 dark:bg-blue-900 text-white' 
                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'} 
              hover:opacity-80 transition-all duration-200`}
          >
            {icon}
          </button>
        ))}
      </div>
      {playlist.length > 0 ? (
        <div>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <button onClick={prevTrack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              <FaStepBackward size={24} />
            </button>
            <button onClick={playPause} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>
            <button onClick={nextTrack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              <FaStepForward size={24} />
            </button>
          </div>
          <div className="mt-4 max-h-40 overflow-y-auto">
            <ul className="text-sm text-gray-600 dark:text-gray-400">
              {playlist.map((track, index) => (
                <li 
                  key={index} 
                  className={`cursor-pointer p-1 ${index === currentTrack ? 'font-bold' : ''}`}
                  onClick={() => setCurrentTrack(index)}
                >
                  {formatSongTitle(track.title)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">No tracks loaded. Select a playlist to start.</p>
      )}
    </div>
  );
};

export default MusicPlayer;