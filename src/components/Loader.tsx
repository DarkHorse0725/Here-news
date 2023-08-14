import React from 'react'
import { BiLoader } from 'react-icons/bi'

interface LoaderProps {
  color?: string
  className?: string
}

const Loader = ({ color, className }: LoaderProps) => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <BiLoader
        size={30}
        className={`${
          color ? color : 'fill-white'
        } animate-spin ${className}`}
      />
    </div>
  )
}

export default Loader
