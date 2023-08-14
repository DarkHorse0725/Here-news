import React from 'react'

interface IWalletHistoryItemProps {
  date: string
  desc: string
}

const WalletHistoryItem = ({
  date,
  desc
}: IWalletHistoryItemProps) => {
  return (
    <div className='flex flex-row items-center justify-between gap-8 md:gap-16'>
      <p className='text-sm md:text-base font-[400] leading-[25px] text-grayMd'>
        {desc}
      </p>
      <p className='text-sm md:text-base font-[400] leading-[25px] text-grayMd'>
        {date}
      </p>
    </div>
  )
}

export { WalletHistoryItem }
