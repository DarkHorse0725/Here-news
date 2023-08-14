import React from 'react'
import Link from 'next/link'

interface IVerifyUserItemProps {
  email: string
  status: string
  className?: string
  userIdHash?: string
  _id?: string
  verified?: boolean
  displayName?: string
}

const VerifyUserItem = ({
  email,
  status,
  className,
  userIdHash,
  _id,
  verified,
  displayName
}: IVerifyUserItemProps) => {
  return (
    <div
      className={`flex flex-row items-center justify-between gap-2 pr-2 md:pr-8 ${className}`}
    >
      <p className='min-w-[15rem] text-sm md:text-base font-[400] leading-[25px] text-grayMd lowercase'>
        {email}
      </p>
      {status === 'pending' ? (
        <p
          className={`hidden sm:block no-underline text-sm font-[400] leading-[22px] text-grayL lowercase`}
        >
          {status}
        </p>
      ) : (
        <Link
          href={`/publicProfile/${_id}`}
          className={`hidden sm:block no-underline text-sm font-[400] leading-[22px] text-success capitalize`}
        >
          {verified
            ? `Accepted by ${displayName}`
            : `Accepted by @${userIdHash} (${displayName} ???)`}
        </Link>
      )}
    </div>
  )
}

export { VerifyUserItem }
