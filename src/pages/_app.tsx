import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { SessionProvider } from "next-auth/react"
import { PrismicPreview } from '@prismicio/next'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/global.scss';

function MyApp({
  Component,
  pageProps: { session, ...pageProps } }) {

  return (
    <SessionProvider session={session}>
      <PrismicPreview repositoryName={process.env.NEXT_PUBLIC_REPONAME}>
        <Header />
        <ToastContainer />
        <Component {...pageProps} />
      </PrismicPreview>
    </SessionProvider>
  )
}

export default MyApp
