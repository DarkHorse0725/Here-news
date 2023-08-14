import Image from 'next/image'
import React from 'react'

const Button = ({
  text,
  icon,
  className,
  textClassName,
  loading,
  ...rest
}: any) => {
  return (
    <button
      className={`flex ${
        icon ? 'h-8 w-8' : 'w-[120px] h-10'
      } md:w-[147px] md:h-12 items-center justify-center gap-1 bg-white rounded-[4px] md:rounded-[8px] border-[1px] border-[#E6E6E6] ${
        loading ? 'opacity-70 pointer-events-none' : ''
      } ${className}`}
      {...rest}
    >
      {icon ? (
        <Image
          src={icon}
          alt='edit'
          height={24}
          width={24}
          className='w-[18px] h-[18px] md:h-[24px] md:w-[24px]'
        />
      ) : null}
      <p
        className={`${
          icon ? 'hidden md:block ' : ''
        } text-base font-[500] text-grayMd leading-[19px] ${textClassName}`}
      >
        {text}
      </p>
    </button>
  )
}

export { Button }
