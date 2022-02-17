import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { SessionProvider } from "next-auth/react"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/global.scss';

function MyApp({
  Component,
  pageProps: { session, ...pageProps } }) {

  return (
    <SessionProvider session={session}>
      <Header />
      <ToastContainer />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
