import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { AudioProvider } from '../contexts/AudioContext';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <AudioProvider>
        <Component {...pageProps} />
      </AudioProvider>
    </ThemeProvider>
  );
}