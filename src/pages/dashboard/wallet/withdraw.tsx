import Layout from 'components/Layouts'
import { Button } from 'components/pages/dashboard'
import { useRouter } from 'next/router'
import React from 'react'
import { useAppSelector } from 'store/hooks'

// Icons
import ArrowBack from 'assets/dashboard/arrowLeft.svg'

const Withdraw = () => {
  const router = useRouter()
  const { selectedAccount } = useAppSelector(state => state.auth)
  return (
    <Layout pageTitle='Withdraw - Here.news' type='home'>
      <div className='w-full max-w-[938px] p-2 md:p-4 flex flex-col gap-8'>
        <Button
          text='Wallet'
          icon={ArrowBack}
          onClick={() => router.back()}
          className='w-[2.5rem] md:!w-[93px]'
          textClassName='!text-body'
        />
        <p className='!text-[1.5rem] md:!text-[48px] font-bold md:leading-[68px] text-body text-center'>
          You have {selectedAccount?.balance.toFixed(2)} μ{' '}
          <span className='text-base md:text-[20px] font-medium leading-5 md:leading-7 text-grayL'>
            {/* @ts-ignore */}
            (${(selectedAccount?.balance / 100).toFixed(2)})
          </span>
        </p>
        <div className='flex flex-col items-center justify-center gap-8'>
          <p className='text-lg md:text-2xl text-grayMd leading-[140%] font-medium'>
            This feature is coming soon. Stay with us.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Withdraw
