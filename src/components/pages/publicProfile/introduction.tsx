import VotesCounter from 'components/SinglePost/VotesCounter'
import Icon from 'components/core/Icon'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { IPost } from 'types/interfaces'
import { getCardText } from 'utils'

interface Props {
  post: IPost
}

const IntroductoryPost = ({
  post: {
    upvotes,
    downvotes,
    tips,
    title,
    text,
    userId,
    postId,
    permalink,
    preview
  }
}: Props) => {
  const cardText = useMemo(
    () => getCardText(title, text, preview),
    [title, text, preview]
  )

  return (
    <div className='flex flex-col gap-4 p-4 bg-baseWhite border border-stroke rounded-lg'>
      <div className='flex flex-row justify-between items-center'>
        {/* Voting counter */}
        <VotesCounter
          posterID={userId as unknown as string}
          postId={postId}
          upvotes={upvotes}
          tips={tips}
          downvotes={downvotes}
        />

        {/* Maximize button to link to the post */}
        <Link
          href={`/post/${postId}/${permalink}`}
          className='grid place-items-center rounded-[8px] h-12 w-12 bg-historic no-underline'
        >
          <Icon name='maximize' className='text-primary' raw />
        </Link>
      </div>

      <div className='flex flex-col px-1 gap-2'>
        <p className='text-xl leading-[140%] font-medium text-header'>
          {cardText.title}
        </p>

        <p
          dangerouslySetInnerHTML={{ __html: cardText.content || '' }}
          className='!text-base leading-[160%] text-body line-clamp-6 sm:line-clamp-2'
        />
      </div>
    </div>
  )
}

export default IntroductoryPost
