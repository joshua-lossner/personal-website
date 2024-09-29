import React, { createContext, useState, useRef, useEffect } from 'react';

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
    { id: 4, name: "Mindwarp Radio", tag: "prog-rock" },
    { id: 5, name: "AltSoundwave", tag: "alternative" },
    { id: 6, name: "Deep Dives On Air", tag: "podcast-show" },
  ]);
  const [currentRadioStation, setCurrentRadioStation] = useState(null);
  const [currentArtwork, setCurrentArtwork] = useState(null);

  console.log('S3_BASE_URL_ALBUMS in AudioContext:', process.env.S3_BASE_URL_ALBUMS);

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
      audioElement.src = playlist[currentTrack].url;
      if (isPlaying) {
        audioElement.play().catch(error => console.error('Error playing audio:', error));
      }
    }
  }, [currentTrack, isPlaying, playlist]);

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
    if (isShuffled) {
      const nextIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrack(nextIndex);
    } else {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
    setIsPlaying(true);
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

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      audioElement.currentTime = 0;
      audioElement.play();
    } else if (repeatMode === 'all' || currentTrack < playlist.length - 1) {
      nextTrack();
    } else {
      setIsPlaying(false);
    }
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
    const audioUrl = constructAudioUrl(audioFile); // Construct and escape URL
    console.log('Constructed audio URL:', audioUrl); // Log the constructed URL
    const newTrack = { title: decodeURIComponent(audioFile.split('/').pop()), url: audioUrl }; // Decode title for display
    setPlaylist(prev => [...prev, newTrack]);
    if (!isPlaying) {
      setIsPlaying(true);
      setCurrentTrack(0);
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
    const audioUrl = constructAudioUrl(audioFile); // Construct and escape URL
    console.log('Constructed audio URL:', audioUrl); // Log the constructed URL
    const newTrack = { title: decodeURIComponent(audioFile.split('/').pop()), url: audioUrl }; // Decode title for display
    setPlaylist(prev => [
      ...prev.slice(0, currentTrack + 1),
      newTrack,
      ...prev.slice(currentTrack + 1)
    ]);
    if (!isPlaying && playlist.length === 0) {
      setIsPlaying(true);
      setCurrentTrack(0);
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
        const response = await fetch(`/api/music-by-tag?tag=${station.tag}`);
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
    }}>
      {children}
    </AudioContext.Provider>
  );
};