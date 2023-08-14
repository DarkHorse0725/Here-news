import Head from 'next/head'
import React from 'react'
import { ILayout } from './common/types'
import Header from 'components/Header'
import Footer from 'components/Footer'

function HomeLayout({ children, pageTitle, className }: ILayout) {
  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header />
      <div
        className={`flex flex-col items-center pt-5 pb-20 min-h-screen bg-background ${
          className ? `${className}` : ''
        }`}
      >
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default HomeLayout
