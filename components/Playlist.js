import React, { useContext } from 'react';
import { AudioContext } from '../contexts/AudioContext';

const Playlist = () => {
  const { playlist, currentTrack, playTrack } = useContext(AudioContext);

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 p-4 rounded-lg mb-4 overflow-y-auto max-h-60">
      <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200">Playlist</h2>
      {playlist.length > 0 ? (
        <ul>
          {playlist.slice(0, 10).map((track, index) => ( // Limit to 10 songs
            <li 
              key={track.id || index} 
              className={`cursor-pointer mb-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white ${index === currentTrack ? 'font-bold' : ''}`}
              onClick={() => playTrack(index)}
              aria-label={`Play ${track.title}`}
            >
              {track.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No tracks in the playlist.</p>
      )}
    </div>
  );
};

export default Playlist;