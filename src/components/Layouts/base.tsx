import Header from 'components/Header'
import PostAlert from 'components/PostAlert'
import Ticker from 'components/Ticker'
import Head from 'next/head'
import React from 'react'
import { ILayout } from './common/types'
import { useRouter } from 'next/router'
import Footer from 'components/Footer'

const changeActivePage = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function BaseLayout({ children, pageTitle, showMeta }: ILayout) {
  const router = useRouter()
  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Header />
      {router?.pathname?.includes('dashboard') && (
        <Ticker onActivePageChange={changeActivePage} />
      )}
      <PostAlert />
      <div className={` flex flex-col items-center -mt-32`}>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default BaseLayout
