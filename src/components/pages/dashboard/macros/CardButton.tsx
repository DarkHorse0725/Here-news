import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface CardButtonProps {
  iconWhite: string
  text: string
  href: string
  iconGray?: any
}

const CardButton = ({
  iconWhite,
  text,
  href,
  iconGray
}: CardButtonProps) => (
  <Link
    href={href}
    className={`relative flex h-12 w-[148px] items-center justify-center gap-2 rounded-[8px] no-underline bg-white border-[1px] border-stroke group hover:bg-primary`}
  >
    <Image
      src={iconWhite}
      alt='verify'
      height={24}
      width={24}
      className='hidden group-hover:block'
    />
    <Image
      src={iconGray}
      alt='verify'
      height={24}
      width={24}
      className='block group-hover:hidden'
    />
    <p
      className={`text-base font-[500] leading-[120%] text-grayMedium group-hover:text-white`}
    >
      {text}
    </p>
  </Link>
)

export { CardButton }
