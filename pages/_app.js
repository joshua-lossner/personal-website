import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { AudioProvider } from '../contexts/AudioContext';
import { CategoriesProvider } from '../contexts/CategoriesContext';
import Layout from '../components/Layout';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <AudioProvider>
        <CategoriesProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CategoriesProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}