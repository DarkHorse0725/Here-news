import React, { useMemo } from 'react'
import Image from 'next/image'
import PlayIcon from 'assets/play.png'
import formatDistance from 'date-fns/formatDistance'
import Avatar from 'components/Avatar'
import Typography from 'components/core/Typography'
import Icon from 'components/core/Icon'

interface Props {
  date: Date
  name: string
  avatar?: string
  cardImage?: {
    src: string
    isVideo: boolean
  }
  verified?: boolean
  isURL: boolean
}

const CardHeader = ({
  date,
  name,
  avatar,
  verified,
  cardImage,
  isURL
}: Props) => {
  const time = useMemo(
    () =>
      formatDistance(new Date(date), new Date(), {
        addSuffix: true
      }),
    [date]
  )

  return cardImage?.isVideo ? (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-row items-center gap-4'>
        <div className='w-8 grid place-items-center aspect-square rounded-full border-2 border-baseWhite'>
          <Image
            className='object-contain'
            src={PlayIcon}
            alt='This post is a video - click to view'
          />
        </div>

        <p className='text-xs font-semibold leading-[160%] text-baseWhite'>
          Watch this video!
        </p>
      </div>

      <div className='flex flex-row gap-1 items-center'>
        <div className='w-1 h-1 rounded-lg bg-baseWhite' />
        <p className='text-[0.625rem] leading-[160%] font-medium text-baseWhite'>
          {time}
        </p>
      </div>
    </div>
  ) : cardImage || isURL ? (
    <div className='flex flex-row gap-1 items-center'>
      <div className='w-1 h-1 rounded-lg bg-baseWhite' />
      <p className='text-xs leading-[160%] font-medium text-baseWhite'>
        {time}
      </p>
    </div>
  ) : (
    <div className='flex flex-row gap-2 items-center'>
      <Avatar
        imageUrl={avatar}
        iamgeClassNames='w-full h-full !object-cover !p-0'
        containerClassNames='w-10 h-10 rounded-full'
      />

      <div className='flex flex-col'>
        <div className='flex flex-row items-center gap-1.5'>
          <Typography
            type='subtitle-small'
            className='!text-base !leading-[1.4rem] !font-medium tracking-medium text-primary'
          >
            {name}
          </Typography>

          {verified && <Icon name='verifiedBadge' size={18} raw />}
        </div>

        <div className='flex flex-row gap-1 items-center'>
          <div className='w-1 h-1 rounded-lg bg-primary' />
          <p className='text-[0.625rem] leading-[160%] font-medium text-primary'>
            {time}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CardHeader
