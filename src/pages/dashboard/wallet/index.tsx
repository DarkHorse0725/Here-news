import React, { useState } from 'react'
import {
  DashboardLayout,
  WalletHistory
} from 'components/pages/dashboard'
import { useQuery } from 'react-query'
import { useAppSelector } from 'store/hooks'
import http from 'services/http-common'
import Loader from 'components/Loader'
import { CardButton } from 'components/pages/dashboard/macros'
import WalletUp from 'assets/dashboard/CreditCardUp.svg'
import WalletDown from 'assets/dashboard/CreditCardDown.svg'
import WalletUpGray from 'assets/dashboard/CreditCardUpGray.svg'
import WalletDowngray from 'assets/dashboard/CreditCardDownGray.svg'
import Tooltip from 'components/Tooltip'

const Wallet = () => {
  const { selectedAccount } = useAppSelector(state => state.auth)
  const [walletHistoryDropdown, setWalletHistoryDropdown] =
    useState(false)

  const getProfileStats = async () => {
    const response = await http.get(`/getUserSpendingsAndIncome`)
    return response.data.data
  }

  const { data, isLoading } = useQuery({
    queryKey: `getUserSpendingsAndIncome`,
    queryFn: getProfileStats,
    cacheTime: 0
  })

  const getWalletHistory = async () => {
    const response = await http.get(`/invoice/paid`)
    return response.data.data
  }

  const walletHistory = useQuery({
    queryKey: `walletHistory`,
    queryFn: getWalletHistory,
    cacheTime: 0
  })

  return (
    <DashboardLayout>
      <div className='flex flex-col gap-2 min-h-screen'>
        <div className='flex flex-row items-center ml-auto gap-2'>
          <CardButton
            iconWhite={WalletUp}
            text='Deposit'
            href='/dashboard/wallet/deposit'
            iconGray={WalletUpGray}
          />
          <CardButton
            iconWhite={WalletDown}
            iconGray={WalletDowngray}
            text='Withdraw'
            href='/dashboard/wallet/withdraw'
          />
        </div>
        <div className='flex flex-row items-center justify-between gap-2 py-2 md:py-4 px-2 md:px-4 lg:px-[30px] rounded-[8px] bg-white border-[1px] border-[#E6E6E6]'>
          {isLoading ? (
            <div className='w-full h-32 bg-baseWhite'>
              <Loader color='fill-primary' />
            </div>
          ) : (
            <>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-row gap-4 items-center'>
                  <p className='text-base md:text-[20px] font-[500] text-primary leading-[100%] md:leading-[140%]'>
                    Balance
                  </p>
                  <Tooltip
                    id='μDescription'
                    message='A utility token, each equal to one US cent. Its digital and used to fuel activities and news experiences on our platform'
                  >
                    <p className='text-base md:text-[20px] font-[500] text-grayMd'>
                      (what’s μ?)
                    </p>
                  </Tooltip>
                </div>
                <p className='text-lg md:text-[3rem] font-[700] leading-[22px] md:leading-[68px] text-[#5A6B74]'>
                  {selectedAccount?.balance.toFixed(2)} μ{' '}
                  <span className='text-[#ADB3BD] font-[500] text-sm md:text-[20px]'>
                    {/* @ts-ignore  */}
                    (${(selectedAccount?.balance / 100).toFixed(2)})
                  </span>
                </p>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-0 md:gap-2'>
                  <p className='text-right text-sm md:text-base font-[500] text-[#5A6B74] leading-[19px]'>
                    Income (Upvote received)
                  </p>
                  <p className='text-right text-xs md:text-sm font-[400] text-[#98A2B3] leading-[22px]'>
                    {data?.totalIncome} μ
                  </p>
                </div>
                <div className='flex flex-col gap-0 md:gap-2'>
                  <p className='text-right text-sm md:text-base font-[500] text-[#5A6B74] leading-[19px]'>
                    Spends
                  </p>
                  <p className='text-right text-xs md:text-sm font-[400] text-[#98A2B3] leading-[22px]'>
                    {data?.totalSpendings} μ
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        {walletHistory?.data && walletHistory?.data?.length > 0 && (
          <WalletHistory
            data={walletHistory?.data}
            walletHistoryDropdown={walletHistoryDropdown}
            setWalletHistoryDropdown={setWalletHistoryDropdown}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default Wallet
