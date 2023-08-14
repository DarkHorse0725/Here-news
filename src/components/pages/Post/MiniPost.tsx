import Typography from 'components/core/Typography'
import formatDistance from 'date-fns/formatDistance'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { IPost } from 'types/interfaces'
import { getCardText } from 'utils'

const MiniPost = ({
  userId: { userIdHash, verified, displayName },
  text,
  title,
  preview,
  createdAt,
  postId,
  permalink
}: IPost) => {
  const time = useMemo(
    () =>
      formatDistance(new Date(createdAt), new Date(), {
        addSuffix: true
      }),
    [createdAt]
  )

  const cardText = useMemo(
    () => getCardText(title, text, preview),
    [title, text, preview]
  )

  return (
    <Link
      href={`/post/${postId}/${permalink}`}
      className='fixed h-[3.125rem] no-underline w-full bg-primary grid place-items-center px-2 md:px-4 rounded-b-lg z-20'
    >
      <div className='py-[0.59375rem] max-w-[57.75rem] w-full flex flex-row justify-between items-center px-2 gap-1'>
        <div className='flex flex-row gap-2 flex-1 shrink-0 item-start justify-center items-center'>
          <Typography
            type='body'
            className='text-baseWhite !text-sm sm:!text-base !leading-[1.6rem] font-medium'
          >
            @{verified ? displayName : userIdHash}
          </Typography>

          <div
            className='!text-sm flex-1 !leading-[1.4rem] text-grayL font-medium line-clamp-1'
            dangerouslySetInnerHTML={{
              __html: cardText.title || cardText.content || ''
            }}
          />
        </div>

        <Typography
          type='body'
          className='!text-xs !leading-[1.2rem] text-grayL shrink-0'
        >
          {time}
        </Typography>
      </div>
    </Link>
  )
}

export default MiniPost
