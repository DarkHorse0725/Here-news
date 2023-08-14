import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Button from './core/Button'
import Typography from './core/Typography'
import useClickOutside from 'hooks/useClickOutside'

let secondNavData = [
  {
    name: 'Profile',
    url: '/dashboard/profile'
  },
  {
    name: 'Reputation',
    url: '/dashboard/reputation'
  },
  {
    name: 'Settings',
    url: '/dashboard/settings'
  },
  {
    name: 'Bookmarks',
    url: '/dashboard/bookmarks'
  },
  {
    name: 'Drafts',
    url: '/dashboard/drafts'
  }
]

interface TickerProps {
  onActivePageChange: (page: string) => void
}

function Ticker({ onActivePageChange }: TickerProps) {
  const router = useRouter()

  const [openAccount, setOpenAccount] = useState(false)

  const toggleOpenAccount = () => {
    if (openAccount) return setOpenAccount(false)
    setOpenAccount(prev => !prev)
  }

  const { ref: accountMenuRef } = useClickOutside({
    shouldRegister: openAccount,
    onOutsideClick: () => setOpenAccount(false)
  })

  return (
    <div className='w-full fixed left-0 z-[29] flex justify-center transition-all duration-500 shadow-xl bg-landing-gray_13 opacity-[0.96] backdrop-blur-[2px]'>
      <div className='w-full max-w-[100rem] flex justify-between items-center px-2 md:px-28 h-[55px] lg:h-[64px]'>
        <div className='flex gap-[58px]'>
          <div>
            <div className='max-[1020px]:hidden'>
              <div className='flex flex-row items-center justify-center px-1 gap-2 bg-white h-[48px] lg:h-[56px] rounded-[12px] border-[1px] border-landing-gray_12'>
                {secondNavData?.map((item, index) => (
                  <Button
                    key={index}
                    size='medium'
                    outlined={router.pathname !== item?.url}
                    className={`lg:h-[3rem] rounded-[8px] font-medium flex items-center ${
                      router.pathname !== item?.url
                        ? 'border-none text-[#667085]'
                        : ''
                    }`}
                    href={item?.url}
                  >
                    <Typography
                      type='button'
                      className={`${
                        router.pathname === item?.url
                          ? 'text-white'
                          : 'text-[#667085]'
                      }`}
                    >
                      {item?.name}
                    </Typography>
                  </Button>
                ))}
              </div>
            </div>
            <div className='min-[920px]:hidden'>
              <div
                className='h-[44px] md:h-[46px] relative z-10'
                ref={accountMenuRef}
              >
                <button
                  className='h-full px-1 md:px-2.5 py-1.5 rounded flex gap-1 md:gap-3 items-center text-gray-500 bg-white duration-75 hover:bg-[rgba(0,0,0,0.01)]'
                  onClick={toggleOpenAccount}
                >
                  menu
                  <Typography
                    type='small'
                    className='text-[16px]'
                  ></Typography>
                </button>
                {openAccount && (
                  <div className='absolute border-2 border-gray-100  shadow-2xl bg-white rounded  w-[300px] top-[110%] z-[30]'>
                    {secondNavData?.map((item, index) => (
                      <div
                        key={index}
                        className='bg-[#F5F3FA] px-4 py-1'
                      >
                        <div
                          onClick={() => router?.push(item?.url)}
                          className='flex items-center gap-[4] cursor-pointer'
                        >
                          <Typography
                            type='body'
                            className='truncate text-left w-full px-4 py-2.5 border-t-[1px] border-gray-100 text-[#53389E] capitalize font-medium'
                          >
                            {item?.name}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ticker
