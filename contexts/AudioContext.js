import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'one', 'all'
  const [S3_BASE_URL_ALBUMS, setS3BaseUrlAlbums] = useState(process.env.NEXT_PUBLIC_S3_BASE_URL_ALBUMS || '');
  const [audioElement, setAudioElement] = useState(null);
  const [radioStations, setRadioStations] = useState([
    { id: 1, name: "Electric Daydreams", tag: "electric-chill" },
    { id: 2, name: "Ivory Reverie", tag: "classic-piano" },
    { id: 3, name: "Velvet Vibes", tag: "soft-jazz" },
    { id: 4, name: "Echoes of Tomorrow", tag: "echoes-of-tomorrow" },
    { id: 5, name: "Deep-Dive Podcast", tag: "deep-dive" }, // Renamed and moved to the bottom
  ]);
  const [currentRadioStation, setCurrentRadioStation] = useState(null);
  const [currentArtwork, setCurrentArtwork] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudioElement(new Audio());
    }
  }, []);

  useEffect(() => {
    if (audioElement) {
      const handleTrackEnd = () => {
        console.log('Track ended');
        if (repeatMode === 'one') {
          audioElement.currentTime = 0;
          audioElement.play();
        } else if (repeatMode === 'all' || currentTrack < playlist.length - 1) {
          nextTrack();
        } else {
          setIsPlaying(false);
        }
      };

      audioElement.addEventListener('ended', handleTrackEnd);
      return () => audioElement.removeEventListener('ended', handleTrackEnd);
    }
  }, [audioElement, repeatMode, currentTrack, playlist.length]);

  useEffect(() => {
    if (playlist.length > 0 && audioElement) {
      const currentSong = playlist[currentTrack];
      if (audioElement.src !== currentSong.url) {
        const wasPlaying = !audioElement.paused;
        audioElement.src = currentSong.url;
        audioElement.currentTime = 0; // Reset time only when changing tracks
        if (wasPlaying) {
          audioElement.play().catch(error => console.error('Error playing audio:', error));
        }
      }
    }
  }, [currentTrack]); // Only depend on currentTrack, not playlist

  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (playlist.length > 0 && currentTrack >= 0 && currentTrack < playlist.length) {
      const currentSong = playlist[currentTrack];
      if (currentSong.artwork) {
        const artworkUrl = `${S3_BASE_URL_ALBUMS}/${currentSong.artwork}`;
        setCurrentArtwork(artworkUrl);
      } else {
        setCurrentArtwork(null);
      }
    }
  }, [currentTrack, playlist, S3_BASE_URL_ALBUMS]);

  const playPause = () => {
    return new Promise((resolve, reject) => {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
        resolve();
      } else {
        audioElement.play()
          .then(() => {
            setIsPlaying(true);
            resolve();
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            reject(error);
          });
      }
    });
  };

  const nextTrack = () => {
    console.log('Next track called');
    if (playlist.length > 0) {
      let nextIndex;
      if (isShuffled) {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } else {
        nextIndex = (currentTrack + 1) % playlist.length;
      }
      setCurrentTrack(nextIndex);
      setIsPlaying(true);
      if (audioElement) {
        audioElement.src = playlist[nextIndex].url;
        audioElement.play().catch(error => console.error('Error playing audio:', error));
      }
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
      if (current === 'off') return 'one';
      if (current === 'one') return 'all';
      return 'off';
    });
  };

  const loadPlaylist = async (genre) => {
    try {
      const response = await fetch(`/api/music-by-tag?tag=${genre}`);
      const data = await response.json();
      if (Array.isArray(data.playlist) && data.playlist.length > 0) {
        console.log('Loaded playlist:', data.playlist);
        setPlaylist(data.playlist);
        setCurrentTrack(0);
        setIsPlaying(true);
        if (audioElement) {
          audioElement.src = data.playlist[0].url;
          audioElement.play().catch(error => console.error('Error playing audio:', error));
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

  const constructAudioUrl = (path) => {
    const baseUrl = 'https://personal-website-audio.s3.amazonaws.com/audio';
    return `${baseUrl}/${path.replace(/^\//, '')}`;
  };

  const playSong = (audioFile) => {
    console.log('Playing song:', audioFile);
    if (!audioFile) {
      console.error('No audio file provided');
      return;
    }
    const audioUrl = constructAudioUrl(audioFile); // Construct and escape URL
    console.log('Constructed audio URL:', audioUrl); // Log the constructed URL
    const newTrack = { title: decodeURIComponent(audioFile.split('/').pop()), url: audioUrl }; // Decode title for display
    setPlaylist([newTrack]);
    setCurrentTrack(0);
    setIsPlaying(true);
    if (audioElement) {
      audioElement.src = newTrack.url;
      audioElement.play().catch(error => console.error('Error playing audio:', error));
    }
  };

  const addToQueue = (audioFile) => {
    console.log('Adding to queue:', audioFile);
    if (!audioFile) {
      console.error('No audio file provided');
      return;
    }
    const audioUrl = constructAudioUrl(audioFile);
    console.log('Constructed audio URL:', audioUrl);
    const newTrack = { title: decodeURIComponent(audioFile.split('/').pop()), url: audioUrl };
    setPlaylist(prev => [...prev, newTrack]);
    // Start playing only if the playlist was previously empty
    if (playlist.length === 0) {
      setCurrentTrack(0);
      setIsPlaying(true);
      if (audioElement) {
        audioElement.src = newTrack.url;
        audioElement.play().catch(error => console.error('Error playing audio:', error));
      }
    }
  };

  const addToUpNext = (audioFile) => {
    console.log('Adding to up next:', audioFile);
    if (!audioFile) {
      console.error('No audio file provided');
      return;
    }
    const audioUrl = constructAudioUrl(audioFile);
    console.log('Constructed audio URL:', audioUrl);
    const newTrack = { title: decodeURIComponent(audioFile.split('/').pop()), url: audioUrl };
  
    setPlaylist(prev => [
      ...prev.slice(0, currentTrack + 1),
      newTrack,
      ...prev.slice(currentTrack + 1)
    ]);

    // Only start playing if the playlist was previously empty
    if (playlist.length === 0) {
      setCurrentTrack(0);
      setIsPlaying(true);
      if (audioElement) {
        audioElement.src = newTrack.url;
        audioElement.play().catch(error => console.error('Error playing audio:', error));
      }
    }
  };

  const removeFromPlaylist = (index) => {
    setPlaylist(prev => {
      const newPlaylist = [...prev.slice(0, index), ...prev.slice(index + 1)];
      if (index < currentTrack) {
        setCurrentTrack(currentTrack - 1);
      } else if (index === currentTrack && newPlaylist.length > 0) {
        // If we're removing the current track, play the next one (or the previous if it's the last)
        audioElement.src = newPlaylist[currentTrack % newPlaylist.length].url;
        audioElement.play().catch(error => console.error('Error playing audio:', error));
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
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  };

  const loadRadioStation = async (stationId) => {
    const station = radioStations.find(s => s.id === stationId);
    if (station) {
      try {
        const response = await fetch(`/api/audio-by-tag?tag=${station.tag}`);
        const data = await response.json();
        if (Array.isArray(data.playlist) && data.playlist.length > 0) {
          console.log('Loaded radio station playlist:', data.playlist);
          setPlaylist(data.playlist);
          setCurrentTrack(0);
          setIsPlaying(true);
          setCurrentRadioStation(stationId);
          if (audioElement) {
            audioElement.src = data.playlist[0].url;
            audioElement.play().catch(error => console.error('Error playing audio:', error));
          }
        } else {
          console.error('Invalid or empty playlist data received:', data);
          setPlaylist([]);
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('Error loading radio station:', error);
        setPlaylist([]);
        setIsPlaying(false);
      }
    }
  };

  const playTrack = (index) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentTrack(index);
      setIsPlaying(true);
      if (audioElement) {
        audioElement.src = playlist[index].url;
        audioElement.currentTime = 0; // Reset the current time to 0
        audioElement.play().catch(error => console.error('Error playing audio:', error));
      }
    }
  };

  return (
    <AudioContext.Provider value={{
      playlist,
      currentTrack,
      isPlaying,
      audioRef: { current: audioElement },
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
      stopAndClearPlaylist,
      S3_BASE_URL_ALBUMS,
      setIsPlaying,  // Add this line to expose setIsPlaying
      radioStations,
      currentRadioStation,
      setCurrentRadioStation,
      loadRadioStation,
      currentArtwork,
      playTrack,
    }}>
      {children}
    </AudioContext.Provider>
  );
};