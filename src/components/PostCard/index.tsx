import Typography from 'components/core/Typography'
import React, { useMemo } from 'react'
import { IPost } from 'types/interfaces'
import { getCardImage, getCardText } from 'utils'
import ItemHeader from './itemHeader'
import ItemImage from './itemImage'
import Link from 'next/link'

const PostCard = ({
  title,
  text,
  preview,
  createdAt,
  postId,
  permalink,
  userId: { displayName, avatar, verified, userIdHash }
}: IPost) => {
  const cardText = useMemo(
    () => getCardText(title, text, preview),
    [title, text, preview]
  )

  const cardImage = useMemo<
    { src: string; isVideo: boolean } | undefined
  >(
    () => getCardImage(cardText, text, preview),
    [preview, text, cardText]
  )

  return (
    <Link
      href={`/post/${postId}/${permalink}`}
      style={{
        background:
          'radial-gradient(50% 50% at 50% 50%, rgba(218, 218, 218, 0.08) 0%, rgba(249, 250, 252, 0.08) 100%), rgba(255, 255, 255, 0.39)'
      }}
      className='flex overflow-hidden mb-4 rounded-[1.125rem] no-underline flex-col gap-2 border-[0.103125rem] border-basewhite p-4 backdrop-blur-[0.20625rem]'
    >
      <ItemHeader
        displayName={(verified ? displayName : userIdHash) || '????'}
        createdAt={createdAt}
        isPreview={!!cardText.isPreviewText}
        avatar={avatar}
        verified={verified}
      />

      <ItemImage cardImage={cardImage} />

      <div
        className={`flex flex-col gap-2 !pb-2 ${
          cardImage ? 'p-0' : cardText.content ? 'pt-2' : 'pt-4'
        }`}
      >
        {cardText.title && (
          <Typography
            type='subtitle-2'
            className='!text-xl font-semibold text-primary line-clamp-4 break-words'
          >
            {cardText.title}
          </Typography>
        )}

        {cardText.content && (
          <Typography
            type='body'
            className='!text-base !leading-[1.4rem] font-normal text-primary line-clamp-2 break-words'
          >
            {cardText.content}
          </Typography>
        )}
      </div>
    </Link>
  )
}

export default PostCard
