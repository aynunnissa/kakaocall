import DefaultLayout from '@/components/layout/DefaultLayout';
import client from '@/lib/client';
import { ContactProvider } from '@/store/context/contact-context';
import '@/styles/globals.css';
/**
 * Important: Import icon fonts
 */
import '@/styles/icons.css';
import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContactProvider>
      <ApolloProvider client={client}>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </ApolloProvider>
    </ContactProvider>
  );
}
