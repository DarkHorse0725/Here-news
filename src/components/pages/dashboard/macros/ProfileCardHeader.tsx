import React from 'react'

const ProfileCardHeader = ({ heading, children }: any) => (
  <div className='flex flex-col gap-2 py-2 md:py-4 px-2 md:px-4 lg:px-[30px] rounded-[8px] bg-white'>
    <p className='text-[20px] font-[500] text-[#213642]'>{heading}</p>
    <div className='border-b-[1px] border-[#e6e6e6] h-[1px] w-full' />
    {children}
  </div>
)

export { ProfileCardHeader }
