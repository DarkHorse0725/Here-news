import React, { useEffect } from 'react'
import { DashboardHeader } from './DashboardHeader'
import Layout from 'components/Layouts'
import { useRouter } from 'next/router'
import Loader from 'components/Loader'
import { getTokenFromCookies } from 'lib/token'

const DashboardLayout = ({ children }: any) => {
  const router = useRouter()

  useEffect(() => {
    if (!getTokenFromCookies()) {
      router.push('/')
    }
  }, [router])

  if (!getTokenFromCookies()) {
    return (
      <div className='h-screen w-screen grid place-items-center'>
        <Loader color='fill-primary' />
      </div>
    )
  }
  return (
    <Layout pageTitle='Dashboard - Here News' type='home'>
      <div className='min-h-screen flex flex-col gap-4 w-full max-w-[100rem] m-auto px-2 md:px-4 lg:px-28'>
        <DashboardHeader />
        {children}
      </div>
    </Layout>
  )
}

export { DashboardLayout }
