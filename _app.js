import { AudioProvider } from '../contexts/AudioContext'; // Adjust the import path if necessary
// ... other imports ...

function MyApp({ Component, pageProps }) {
  return (
    <AudioProvider>
      <Component {...pageProps} />
    </AudioProvider>
  );
}

export default MyApp;