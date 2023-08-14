import Button from 'components/core/Button'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'

const CookiePopup = () => {
  const key = 'cookiePolicyStatus'
  const [shouldShowPopup, setShouldShowPopup] =
    useState<boolean>(false)

  useEffect(() => {
    setTimeout(() => {
      const policyStatus = localStorage.getItem(key) as
        | 'accepted'
        | 'declined'
        | null
      if (policyStatus !== 'accepted') {
        setShouldShowPopup(true)
      }
    }, 7000)
  }, [])

  const acceptCookiePolicy = useCallback(() => {
    localStorage.setItem(key, 'accepted')
  }, [])

  const declineCookiePolicy = useCallback(() => {
    localStorage.setItem(key, 'declined')
  }, [])

  return shouldShowPopup ? (
    <div className='rounded-lg fixed border border-stroke bg-baseWhite p-8 w-[33rem] flex flex-col gap-6'>
      <h3 className='text-header font-medium text-normal sm:text-2xl leading-[1.815625rem]'>
        Cookie Policy
      </h3>

      <p className='font-normal text-body leading-[1.6rem]'>
        This website uses cookies. By continuing to use this site, you
        accept our use of cookies. Please see our{' '}
        <Link
          href=''
          className='font-semibold text-sm sm:text-base leading-[1.2rem]'
        >
          cookies policy
        </Link>{' '}
        for more information.
      </p>

      <div className='flex flex-row items-center gap-4'>
        <Button
          onClick={acceptCookiePolicy}
          className='grid place-items-center rounded-lg !px-6 !py-1 h-12 bg-primary text-baseWhite font-medium text-sm sm:text-base leading-[1.2rem] tracking-medium'
        >
          Accept
        </Button>

        <Button
          onClick={declineCookiePolicy}
          className='grid place-items-center rounded-lg !px-6 !py-1 h-12 bg-baseWhite !border !border-primary text-primary font-medium text-sm sm:text-base leading-[1.2rem] tracking-medium'
        >
          Decline
        </Button>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default CookiePopup
