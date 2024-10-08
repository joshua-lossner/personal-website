import React, { useContext, useEffect, useState, useRef } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo, FaList, FaBroadcastTower } from 'react-icons/fa';
import { AudioContext } from '../contexts/AudioContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';

const DynamicMusicPlayer = () => {
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
    loadRadioStation,
    currentArtwork
  } = useContext(AudioContext);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [musicPosts, setMusicPosts] = useState([]);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showRadioStations, setShowRadioStations] = useState(true);
  const [error, setError] = useState(null);
  const [albumArtUrl, setAlbumArtUrl] = useState(null);
  const [isPlaylistScrollable, setIsPlaylistScrollable] = useState(false);
  const playlistRef = useRef(null);

  useEffect(() => {
    setShowRadioStations(true);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      setShowPlaylist(true);
      setShowRadioStations(false);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const updateProgress = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
          setDuration(audio.duration);
        }
      };
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setError('Error playing audio. Please try again.');
      });
      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('error', () => {});
      };
    }
  }, [audioRef]);

  useEffect(() => {
    if (playlist.length > 0 && currentTrack >= 0 && currentTrack < playlist.length) {
      const currentSong = playlist[currentTrack];
      console.log('Current song:', currentSong);
      const artFileName = encodeURIComponent(currentSong.title.replace(/\.(mp3|wav|ogg)$/, '').trim()) + '.png';
      console.log('Art file name:', artFileName);
      const artPath = S3_BASE_URL_ALBUMS ? `${S3_BASE_URL_ALBUMS}/${artFileName}` : `/album-art/${artFileName}`;
      console.log('Full art path:', artPath);
      setAlbumArtUrl(artPath);
      
      const img = new Image();
      img.onerror = () => {
        console.error('Failed to load album art:', artPath);
        setAlbumArtUrl(S3_BASE_URL_ALBUMS ? `${S3_BASE_URL_ALBUMS}/default-album-art.png` : '/album-art/default-album-art.png');
      };
      img.src = artPath;
    }
  }, [currentTrack, playlist, S3_BASE_URL_ALBUMS]);

  useEffect(() => {
    if (currentArtwork) {
      console.log('Album art URL:', currentArtwork);
      
      const img = new Image();
      img.onerror = () => {
        console.error('Failed to load album art:', currentArtwork);
      };
      img.src = currentArtwork;
    }
  }, [currentArtwork]);

  useEffect(() => {
    console.log('S3_BASE_URL_ALBUMS:', S3_BASE_URL_ALBUMS);
  }, [S3_BASE_URL_ALBUMS]);

  useEffect(() => {
    if (playlistRef.current) {
      setIsPlaylistScrollable(playlistRef.current.scrollHeight > playlistRef.current.clientHeight);
    }
  }, [playlist, showPlaylist]);

  const formatSongTitle = (title) => {
    return title ? title.replace(/\.(mp3|wav|ogg)$/, '') : 'Choose Vibe Below';
  };

  const getCurrentLyrics = () => {
    if (playlist.length > 0 && musicPosts.length > 0) {
      const currentSong = playlist[currentTrack];
      const songPost = musicPosts.find(post => post.audioFile === currentSong.title);
      return songPost ? songPost.content : '';
    }
    return '';
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = (e.target.value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setProgress(e.target.value);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const fetchMusicPosts = async () => {
      try {
        const response = await fetch('/api/music-posts');
        const data = await response.json();
        if (data.posts) {
          setMusicPosts(data.posts);
        } else {
          console.error('No posts data in the response:', data);
        }
      } catch (error) {
        console.error('Error fetching music posts:', error);
      }
    };

    fetchMusicPosts();
  }, []);

  const togglePlaylist = () => {
    setShowPlaylist(!showPlaylist);
    setShowRadioStations(false);
  };

  const toggleRadioStations = () => {
    setShowRadioStations(!showRadioStations);
    setShowPlaylist(false);
  };

  const handlePlayPause = () => {
    setError(null);
    playPause().catch(err => {
      console.error('Error in playPause:', err);
      setError('Failed to play/pause. Please try again.');
    });
  };

  const handleRadioStationClick = (stationId) => {
    loadRadioStation(stationId);
  };

  return (
    <div className="flex flex-col items-start w-full p-6">
      <div className="flex items-center mb-4 w-full">
        <div className="relative w-16 h-16 mr-4 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={albumArtUrl || `${S3_BASE_URL_ALBUMS}/default-album-art.png`}
            alt="Album Art" 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {playlist.length > 0 ? formatSongTitle(playlist[currentTrack].title) : 'Choose Vibe Below'}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">AI Generated Music</p>
        </div>
      </div>
      
      <div className="flex items-center mb-4 w-full">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleShuffle} 
            className={`p-1 rounded-full ${isShuffled ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-blue-600 hover:text-white transition-colors`}
          >
            <FaRandom size={11} />
          </button>
          <button onClick={prevTrack} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
            <FaStepBackward size={15} />
          </button>
          <button onClick={handlePlayPause} className="w-7 h-7 flex items-center justify-center bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors">
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
          <button 
            onClick={togglePlaylist}
            className={`p-1 rounded-full ${showPlaylist ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-blue-600 hover:text-white transition-colors`}
          >
            <FaList size={11} />
          </button>
          <button 
            onClick={toggleRadioStations}
            className={`p-1 rounded-full ${showRadioStations ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-300'} hover:bg-blue-600 hover:text-white transition-colors`}
          >
            <FaBroadcastTower size={11} />
          </button>
        </div>
      </div>

      <div className="flex items-center mb-6 w-full">
        <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">
          {formatTime(audioRef.current?.currentTime || 0)}
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full appearance-none cursor-pointer"
        />
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
          {formatTime(duration)}
        </span>
      </div>
      
      {showPlaylist && playlist.length > 0 && (
        <div className="mt-4 w-full relative">
          <h3 className="text-sm font-semibold mb-2">Now Playing</h3>
          <div 
            ref={playlistRef}
            className="max-h-60 overflow-y-auto pr-2 relative"
          >
            <ul className="text-xs text-gray-600 dark:text-gray-400">
              {playlist.map((track, index) => (
                <li 
                  key={index}
                  className={`cursor-pointer p-2 rounded ${index === currentTrack ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  onClick={() => setCurrentTrack(index)}
                >
                  {formatSongTitle(track.title)}
                </li>
              ))}
            </ul>
          </div>
          {isPlaylistScrollable && (
            <div className="text-center text-gray-500 mt-2">
              <span className="inline-block animate-bounce">▼</span>
            </div>
          )}
        </div>
      )}

      {showRadioStations && (
        <div className="mt-4 w-full">
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

      {getCurrentLyrics() && (
        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 max-h-60 overflow-y-auto w-full">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            className="prose dark:prose-invert max-w-none"
          >
            {getCurrentLyrics()}
          </ReactMarkdown>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mt-2 mb-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default DynamicMusicPlayer;