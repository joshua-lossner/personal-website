import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { AudioProvider } from '../contexts/AudioContext';
import { CategoriesProvider } from '../contexts/CategoriesContext';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps, categories }) {
  return (
    <ThemeProvider attribute="class">
      <AudioProvider>
        <CategoriesProvider>
          <Layout categories={categories}>
            <Component {...pageProps} categories={categories} />
          </Layout>
        </CategoriesProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async () => {
  if (typeof window === 'undefined') {
    const { getCategories } = await import('../lib/posts');
    const categories = await getCategories();
    return { categories };
  }
  return { categories: [] };
};

export default MyApp;