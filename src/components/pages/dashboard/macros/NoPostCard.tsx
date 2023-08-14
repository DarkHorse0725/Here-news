import Icon from 'components/core/Icon'
import React from 'react'

const NoPostCard = ({ text }: any) => {
  return (
    <div className='flex flex-row items-center gap-2 p-4 w-full bg-white rounded-md h-[6rem]'>
      <Icon name='emoji' raw />
      <p className='text-base font-[400] text-body'>
        {text || 'No Posts Found.'}
      </p>
    </div>
  )
}

export { NoPostCard }
