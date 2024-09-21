import React, { createContext, useState, useRef, useEffect } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  const audioRef = useRef(null);

  useEffect(() => {
    if (playlist.length > 0 && audioRef.current) {
      audioRef.current.src = playlist[currentTrack].url;
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error('Error playing audio:', error));
      }
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (isShuffled) {
      const nextIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrack(nextIndex);
    } else {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
  };

  const prevTrack = () => {
    if (isShuffled) {
      const prevIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrack(prevIndex);
    } else {
      setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setRepeatMode(current => {
      switch (current) {
        case 'off': return 'all';
        case 'all': return 'one';
        case 'one': return 'off';
        default: return 'off';
      }
    });
  };

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all' || currentTrack < playlist.length - 1) {
      nextTrack();
    } else {
      setIsPlaying(false);
    }
  };

  const loadPlaylist = async (genre) => {
    try {
      const response = await fetch(`/api/music?directory=${genre}`);
      const data = await response.json();
      if (Array.isArray(data.playlist) && data.playlist.length > 0) {
        console.log('Loaded playlist:', data.playlist);
        setPlaylist(data.playlist);
        setCurrentTrack(0);
        setIsPlaying(true);
        if (audioRef.current) {
          audioRef.current.src = `/audio/site-playlist/${genre}/${data.playlist[0].title}`; // Updated path
          audioRef.current.play().catch(error => console.error('Error playing audio:', error));
        }
      } else {
        console.error('Invalid or empty playlist data received:', data);
        setPlaylist([]);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
      setPlaylist([]);
      setIsPlaying(false);
    }
  };

  const playSong = (audioFile) => {
    console.log('Playing song:', audioFile);
    if (!audioFile) {
      console.error('No audio file provided');
      return;
    }
    const newTrack = { title: audioFile, url: `/audio/song-library/${audioFile}` };
    console.log('New track:', newTrack);
    setPlaylist([newTrack]);
    setCurrentTrack(0);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = newTrack.url;
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));
    }
  };

  const addToQueue = (audioFile) => {
    console.log('Adding to queue:', audioFile);
    if (!audioFile) {
      console.error('No audio file provided');
      return;
    }
    const newTrack = { title: audioFile, url: `/audio/song-library/${audioFile}` };
    setPlaylist(prev => {
      const newPlaylist = [...prev, newTrack];
      console.log('Updated playlist:', newPlaylist);
      return newPlaylist;
    });
    // If nothing is playing, start playing the first track
    if (!isPlaying && playlist.length === 0) {
      setIsPlaying(true);
      setCurrentTrack(0);
    }
  };

  const addToUpNext = (audioFile) => {
    console.log('Adding to up next:', audioFile);
    if (!audioFile) {
      console.error('No audio file provided');
      return;
    }
    const newTrack = { title: audioFile, url: `/audio/song-library/${audioFile}` };
    setPlaylist(prev => {
      const newPlaylist = [
        ...prev.slice(0, currentTrack + 1),
        newTrack,
        ...prev.slice(currentTrack + 1)
      ];
      console.log('Updated playlist:', newPlaylist);
      return newPlaylist;
    });
    // If nothing is playing, start playing the first track
    if (!isPlaying && playlist.length === 0) {
      setIsPlaying(true);
      setCurrentTrack(0);
    }
  };

  const removeFromPlaylist = (index) => {
    setPlaylist(prev => {
      const newPlaylist = [...prev.slice(0, index), ...prev.slice(index + 1)];
      if (index < currentTrack) {
        setCurrentTrack(currentTrack - 1);
      } else if (index === currentTrack && newPlaylist.length > 0) {
        // If we're removing the current track, play the next one (or the previous if it's the last)
        audioRef.current.src = newPlaylist[currentTrack % newPlaylist.length].url;
        audioRef.current.play().catch(error => console.error('Error playing audio:', error));
      } else if (newPlaylist.length === 0) {
        setIsPlaying(false);
        setCurrentTrack(0);
      }
      return newPlaylist;
    });
  };

  const stopAndClearPlaylist = () => {
    setPlaylist([]);
    setCurrentTrack(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <AudioContext.Provider value={{
      playlist,
      currentTrack,
      isPlaying,
      audioRef,
      playPause,
      nextTrack,
      prevTrack,
      loadPlaylist,
      setCurrentTrack,
      playSong,
      addToQueue,
      addToUpNext,
      removeFromPlaylist,
      volume,
      setVolume,
      isShuffled,
      toggleShuffle,
      repeatMode,
      toggleRepeat,
      stopAndClearPlaylist
    }}>
      {children}
      <audio 
        ref={audioRef} 
        onEnded={handleTrackEnd}
        onError={(e) => console.error('Audio error:', e)}
      />
    </AudioContext.Provider>
  );
};