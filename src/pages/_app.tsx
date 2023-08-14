import type { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useRef } from 'react'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from 'store'
import { Inter } from '@next/font/google'
import Wrapper from 'components/Wrapper'
import ProgressBar from 'nextjs-progressbar'
import 'styles/globals.css'
import { SocketProvider } from 'context/SocketContext'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import CookiePopup from 'components/blocks/CookiePopup'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  const { metaTags } = pageProps
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          refetchOnReconnect: false,
          refetchOnWindowFocus: false
        }
      }
    })
  )

  return (
    <React.Fragment>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />

        <link
          rel='icon'
          type='image/png'
          href='/favicon-32x32.png'
          sizes='32x32'
        />
        <link
          rel='icon'
          type='image/png'
          href='/favicon-16x16.png'
          sizes='16x16'
        />
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link
          rel='icon'
          type='image/png'
          sizes='192x192'
          href='/android-chrome-192x192.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='512x512'
          href='/android-chrome-512x512.png'
        />
        <link rel='manifest' href='/site.webmanifest' />

        <meta name='theme-color' content='#ffffff' />

        <meta
          name='viewport'
          content='width=device-width, initial-scale=1'
        />
        <meta name='twitter:card' content='summary_large_image' />

        {metaTags &&
          Object.entries(metaTags).map(entry => {
            if (!entry[1]) return null
            return (
              <meta
                key={entry[1] as React.Key}
                property={entry[0]}
                content={entry[1] as string}
              />
            )
          })}
      </Head>
      <SocketProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient.current}>
            <Wrapper>
              <Hydrate state={pageProps.dehydratedState}>
                <ProgressBar
                  options={{
                    showSpinner: false
                  }}
                />
                <Component {...pageProps} />
                <CookiePopup />
                <ToastContainer />
                <ReactTooltip
                  closeOnEsc
                  closeOnScroll
                  closeOnResize
                  className='z-50 max-w-[20rem]'
                  id='globalTooltip'
                />
                <ReactQueryDevtools initialIsOpen={false} />
              </Hydrate>
            </Wrapper>
          </QueryClientProvider>
        </Provider>
      </SocketProvider>
    </React.Fragment>
  )
}
