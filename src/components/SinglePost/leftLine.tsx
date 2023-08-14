import React from 'react'
import { BsDiamondFill } from 'react-icons/bs'

interface Props {
  withEditor: boolean
  repliedTo: boolean
  isLastItem: boolean
}

const LeftLine = ({ isLastItem, withEditor, repliedTo }: Props) => {
  return repliedTo ? (
    <>
      {/* Vertical line */}
      <div
        className={`absolute border-l-2 border-dashed -top-[0.875rem] border-primary z-10 ${
          isLastItem || withEditor
            ? 'bottom-[calc(100%-55px)]'
            : 'bottom-0'
        } ${
          withEditor
            ? 'left-[0.25rem] md:left-[1.95rem] lg:left-[2.25rem]'
            : 'left-[0.3rem] md:left-[1.25rem] lg:left-[1.4rem] 2xl:left-[1.35rem]'
        }`}
      />

      {/* Horizontal line and Diamond */}
      <div className='flex flex-row items-center z-10'>
        <BsDiamondFill className='text-primary' size={12} />
        <div className='border-primary border-dashed border-t-2 w-0 md:w-2 lg:w-7' />
      </div>
    </>
  ) : (
    <></>
  )
}

export default LeftLine
