import Icon from 'components/core/Icon'
import React from 'react'
import { WalletHistoryItem } from './macros'

interface WalletHistoryprops {
  walletHistoryDropdown: boolean
  setWalletHistoryDropdown: (prev: boolean) => void
  data: any
}

const WalletHistory = ({
  walletHistoryDropdown,
  setWalletHistoryDropdown,
  data
}: WalletHistoryprops) => {
  return (
    <div className='flex flex-col gap-4 py-2 md:py-4 px-2 md:px-4 lg:px-[30px] rounded-[8px] bg-white border-[1px] border-[#E6E6E6]'>
      <div
        className='flex flex-row items-center justify-between gap-4 cursor-pointer'
        onClick={() =>
          setWalletHistoryDropdown(!walletHistoryDropdown)
        }
      >
        <p className='text-[20px] font-medium leading-7 text-body'>
          Wallet History
        </p>
        <div className='grid place-items-center rounded-[4px] h-[30px] w-[30px] bg-historic'>
          <Icon
            name={walletHistoryDropdown ? 'chevronUp' : 'chevronDown'}
            className=''
            size={18}
            color='#213642'
            raw
          />
        </div>
      </div>
      {walletHistoryDropdown && (
        <div className='flex flex-col gap-2'>
          {data?.map((item: any) => (
            <WalletHistoryItem
              date={new Date(item?.createdAt).toLocaleDateString()}
              key={item._id}
              desc={`${Math.floor(item?.amount * 100)}μ deposited`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { WalletHistory }
