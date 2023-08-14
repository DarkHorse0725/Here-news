import Typography from 'components/core/Typography'
import formatDistance from 'date-fns/formatDistance'
import Image from 'next/image'
import React, { useMemo } from 'react'
import Icon from 'components/core/Icon'

interface Props {
  isPreview: boolean
  createdAt: Date
  displayName: string
  avatar?: string
  verified?: boolean
}

const ItemHeader = ({
  createdAt,
  displayName,
  avatar,
  isPreview,
  verified
}: Props) => {
  const time = useMemo(
    () =>
      formatDistance(new Date(createdAt), new Date(), {
        addSuffix: true
      }),
    [createdAt]
  )

  return isPreview ? (
    <div className='flex flex-row items-center gap-1 tracking-medium mb-1'>
      <div className='w-1.5 h-1.5 rounded-full bg-primary' />

      <Typography
        className='!text-xs !leading-[1.2rem] font-medium text-primary'
        type='body'
      >
        {time}
      </Typography>
    </div>
  ) : (
    <div className='flex flex-row items-center justify-between gap-2 flex-wrap'>
      <Image
        // @ts-ignore
        src={avatar}
        className='rounded-full w-10 h-10 !border !border-stroke bg-black'
        height={26}
        width={26}
        alt='Profile image for the user'
      />

      <div className='flex-1 flex flex-col items-start justify-center'>
        <div className='flex flex-row items-center gap-1'>
          <Typography
            type='body'
            className='!text-base !leading-[1.4rem] text-primary tracking-medium font-medium'
          >
            {displayName}
          </Typography>

          {verified && <Icon name='verifiedBadge' raw size={18} />}
        </div>

        <div className='flex flex-row items-center justify-center gap-1 tracking-medium'>
          <div className='w-1 h-1 rounded-full bg-primary' />

          <Typography
            className='!text-xs !leading-[0.8rem] font-medium text-primary'
            type='body'
          >
            {time}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default ItemHeader
