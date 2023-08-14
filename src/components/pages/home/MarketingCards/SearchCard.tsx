import Image from 'next/image'
import React, { useCallback } from 'react'
import SearchCardImage from 'assets/marketingCards/searchCard.svg'
import { useAppDispatch } from 'store/hooks'
import { changeIsSearchInputFocused } from 'store/slices/app.slice'

const SearchCard = () => {
  const dispatch = useAppDispatch()

  const focusSearch = useCallback(
    () => dispatch(changeIsSearchInputFocused(true)),
    [dispatch]
  )

  return (
    <div
      onClick={focusSearch}
      className='rounded-lg cursor-pointer p-4 min-h-[10.875rem] flex flex-row items-center justify-between bg-primary gap-2'
    >
      <p className='text-xl font-medium leading-[140%] text-baseWhite'>
        Get insights, search global news by asking questions below.
      </p>

      <Image
        src={SearchCardImage.src}
        width={131}
        height={85}
        alt='Search'
      />
    </div>
  )
}

export default SearchCard
