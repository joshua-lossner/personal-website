import dynamic from 'next/dynamic';

const DynamicMusicPlayer = dynamic(() => import('./DynamicMusicPlayer'), {
  ssr: false,
  loading: () => <p>Loading music player...</p>
});

const MusicPlayer = () => {
  return <DynamicMusicPlayer />;
};

export default MusicPlayer;