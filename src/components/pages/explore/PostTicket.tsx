import React, { useMemo } from 'react'
import formatDistance from 'date-fns/formatDistance'
import { IPost } from 'types/interfaces'
import Icon from 'components/core/Icon'
import { formatNumber, getCardText } from 'utils'
import Link from 'next/link'
import VotesCounter from 'components/SinglePost/VotesCounter'

function PostTicket({
  createdAt,
  userId: { verified, userIdHash, displayName, _id: posterID },
  title,
  upvotes,
  downvotes,
  tips,
  text,
  preview,
  replies,
  postId,
  permalink
}: IPost) {
  const cardText = useMemo(
    () => getCardText(title, text, preview),
    [title, text, preview]
  )

  const onClickCard = (e: any) => {
    if (['svg', 'path'].includes(e.target.localName)) {
      e.preventDefault()
    }
  }

  return (
    <Link
      href={`/post/${postId}/${permalink}`}
      onClick={(e: any) => {
        onClickCard(e)
      }}
      className='no-underline flex flex-col px-4 sm:px-[1.875rem] py-2 sm:py-4 bg-baseWhite rounded-lg gap-2 border border-stroke cursor-pointer'
    >
      <p className='line-clamp-1 text-base sm:text-xl leading-[140%] font-medium text-primary'>
        {cardText.title}
      </p>

      <div className='flex flex-row items-center gap-1 sm:gap-2 flex-wrap'>
        {/* Comments */}
        <Icon name='comment' raw />
        <p className='text-grayMd text-sm sm:text-base leading-[120%] font-medium tracking-mediumw'>
          {formatNumber(replies?.length || 0)}
        </p>

        {/* Seperator */}
        <div className='w-[0.3rem] h-[0.3rem] shrink-0 rounded-full bg-grayMd' />

        {/* Votes Counter */}
        <VotesCounter
          upvotes={upvotes}
          downvotes={downvotes}
          tips={tips}
          posterID={posterID}
          postId={postId}
          isTicket
        />

        {/* Separator */}
        <div className='w-[0.3rem] h-[0.3rem] shrink-0 rounded-full bg-grayMd' />

        {/* User Display name */}
        <p className='text-primary leading-[120%] text-sm sm:text-base font-medium tracking-medium'>
          {verified ? displayName : `@${userIdHash}`}
        </p>

        {/* Separator */}
        <div className='w-[0.3rem] h-[0.3rem] shrink-0 rounded-full bg-grayMd' />

        {/* Time difference */}
        <p className='text-sm sm:text-base shrink-0 tracking-medium text-grayMd leading-[120%] font-medium'>
          {formatDistance(new Date(createdAt), new Date(), {
            addSuffix: true
          })}
        </p>
      </div>
    </Link>
  )
}

export default PostTicket
