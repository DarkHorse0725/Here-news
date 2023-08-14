import Layout from 'components/Layouts'
import { Button } from 'components/pages/dashboard'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import http from 'services/http-common'
import Image from 'next/image'
import { useAppSelector } from 'store/hooks'

// Icons
import ArrowBack from 'assets/dashboard/arrowLeft.svg'
import Wallet from 'assets/dashboard/wallet.svg'
import Dollar from 'assets/dashboard/currency-dollar.svg'
import LayoutIcon from 'assets/dashboard/layout.svg'

const Deposit = () => {
  const router = useRouter()
  const { selectedAccount } = useAppSelector(state => state.auth)
  const [amount, setAmount] = useState(1)
  const [amountError, setAmountError] = useState('')

  const generateInvoiceMutation = useMutation(
    () => {
      return http.post('/invoice', { amount })
    },
    {
      onSuccess: data => {
        if (data?.data?.success) {
          router.push(`/invoice/${data?.data?.data?._id}`)
        }
      },
      onError: () => {
        toast.error('Something went wrong. Please try again later!')
      }
    }
  )

  const generateInvoice = () => {
    if (!amount) {
      setAmountError('Amount is Required!')
    } else if (amount <= 0) {
      setAmountError('Amount must be greater then 0')
    } else {
      setAmountError('')
      generateInvoiceMutation.mutate()
    }
  }

  const onAmountChange = (e: any) => {
    setAmountError('')
    setAmount(e.target.value)
  }

  return (
    <Layout pageTitle='Deposit - Here.news' type='home'>
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
        <div className='flex flex-col gap-1'>
          <label className='text-sm md:text-base font-medium leading-6 text-grayMd'>
            Amount
          </label>
          <div className='w-full flex flex-row items-center h-[3rem] md:h-[70px] bg-baseWhite rounded-[8px] border-[1px] border-stroke px-[2px]'>
            <Image
              src={Wallet}
              height={24}
              width={24}
              alt='wallet'
              className='ml-2'
            />
            <input
              type='number'
              placeholder='Amount in $'
              value={amount}
              onChange={onAmountChange}
              className={
                'h-full w-full outline-none italic text-body disabled:bg-[#e6e6e6] placeholder:text-[#e0dfdf] px-2'
              }
            />
            <div className='h-[45px] w-[45px] md:h-[62px] md:w-[62px] grid place-items-center rounded-[0px_8px_8px_0] bg-historic'>
              <Image
                src={Dollar}
                height={24}
                width={24}
                alt='wallet'
              />
            </div>
          </div>
          {amountError ? (
            <p className='text-sm md:text-base font-[300] text-red-500'>
              {amountError}
            </p>
          ) : null}

          <p className='text-sm md:text-base font-[300] italic text-grayMd'>
            {amount
              ? `${amount} dollars = ${amount * 100}μ`
              : '1 dollar = 100μ'}
          </p>
        </div>

        <div className='flex flex-col items-center justify-center gap-2'>
          <Button
            text='Generate Invoice'
            icon={LayoutIcon}
            onClick={generateInvoice}
            loading={generateInvoiceMutation.isLoading}
            className='!w-[173px] !bg-primary'
            textClassName='!text-white !block !text-sm md:text-base'
          />
          <p className='text-xs md:text-sm font-[300] leading-[140%] italic text-grayMd'>
            Pay with lightening network
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Deposit
