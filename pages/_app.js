import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { AudioProvider } from '../contexts/AudioContext';
import { CategoriesProvider } from '../contexts/CategoriesContext';
import Layout from '../components/Layout';
import Head from 'next/head';
import { getCSP } from '../lib/csp';

function MyApp({ Component, pageProps, categories }) {
  return (
    <ThemeProvider attribute="class">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content={getCSP()} />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains; preload" />
      </Head>
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