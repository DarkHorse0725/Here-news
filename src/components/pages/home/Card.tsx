import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IPost } from 'types/interfaces'
import CardHeader from './CardHeader'
import Link from 'next/link'
import { getCardImage, getCardText } from 'utils'
import CustomImage from 'components/core/Image'
import Typography from 'components/core/Typography'
import Image from 'next/image'

const Card = ({
  title,
  createdAt,
  text,
  preview,
  permalink,
  postId,
  userId: { verified, displayName, userIdHash, avatar }
}: IPost) => {
  const [isPreviewFailed, setIsPreviewFailed] = useState(false)
  const [contentLineClamp, setContentLineClamp] = useState<string>()
  const titleRef = useRef<HTMLParagraphElement>(null)

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

  useEffect(() => {
    if (titleRef.current) {
      let value = 'line-clamp-2'

      if (!cardImage?.src) {
        setContentLineClamp(value)
        return
      }

      const titleLineHeight = 28
      const lines = titleRef.current.clientHeight / titleLineHeight

      if (lines === 3) {
        value = 'hidden'
      } else if (lines === 2) {
        value = 'line-clamp-2'
      } else {
        value = 'line-clamp-3'
      }

      setContentLineClamp(value)
    }
  }, [cardImage])

  const cardHeight = useMemo<string>(() => {
    let height: number = 0

    if (cardImage?.isVideo && cardImage.src && !cardText.content) {
      height = 12.1875
    } else if (cardImage && !isPreviewFailed) {
      // url cards
      height = 18.4375
    } else if (isPreviewFailed) {
      if (contentLineClamp === 'line-clamp-3') {
        height = 12.875
      } else {
        height = 12.5
      }
    }

    return height ? `${height}rem` : ''
  }, [cardImage, isPreviewFailed, cardText, contentLineClamp])

  return (
    <Link
      href={`/post/${postId}/${permalink}`}
      className='relative flex flex-col no-underline rounded-lg mb-6 overflow-hidden shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)]'
      style={{
        background: cardText.isPreviewText
          ? 'linear-gradient(0deg, rgba(33, 54, 66, 0.25) 1.04%, rgba(33, 54, 66, 0.32) 100%, rgba(33, 54, 66, 0.00) 100%), linear-gradient(180deg, rgba(33, 54, 66, 0.83) 0%, rgba(0, 0, 0, 0.12) 100%)'
          : '#F9FAFB',
        height: cardHeight
      }}
    >
      {/* Background image/video */}
      {(cardText.isPreviewText || cardImage) && (
        <div className='absolute left-0 right-0 bottom-0 top-0 z-0'>
          {cardImage?.isVideo && !preview?.youtubeId ? (
            <video autoPlay={false}>
              <source src={cardImage.src} />
            </video>
          ) : (
            cardImage?.src && (
              <Image
                fill
                sizes='30vw'
                src={cardImage?.src}
                alt=''
                className={`object-cover object-center ${
                  isPreviewFailed ? 'hidden' : ''
                }`}
                onError={() => setIsPreviewFailed(true)}
              />
            )
          )}

          <div
            className='absolute top-0 left-0 right-0 bottom-0'
            style={{
              background:
                'linear-gradient(0deg, rgba(33, 54, 66, 0.35) 1.04%, rgba(33, 54, 66, 0.45) 100%, rgba(33, 54, 66, 0.00) 100%)'
            }}
          />
        </div>
      )}

      {/* Content */}
      <div
        className={`z-10 flex flex-col flex-1 justify-between p-4 ${
          !cardImage ? 'gap-5' : ''
        }`}
      >
        <CardHeader
          date={createdAt}
          verified={verified}
          name={
            verified
              ? displayName
              : userIdHash
              ? `@${userIdHash}`
              : '????'
          }
          avatar={avatar}
          cardImage={cardImage}
          isURL={cardText?.isPreviewText || false}
        />

        <div className='flex flex-col gap-1'>
          <div className='flex flex-col gap-1'>
            {cardText.title && (
              <p
                ref={titleRef}
                className={`text-xl break-words text-ellipsis font-semibold line-clamp-3 leading-7 ${
                  cardText.isPreviewText || cardImage
                    ? 'text-baseWhite'
                    : 'text-primary'
                }`}
              >
                {cardText.title}
              </p>
            )}

            {contentLineClamp && cardText.content && (
              <p
                className={`font-normal text-base text-ellipsis ${
                  cardText.isPreviewText || cardImage
                    ? 'text-baseWhite'
                    : 'text-primary'
                } ${contentLineClamp}`}
              >
                {cardText.content}
              </p>
            )}
          </div>

          {cardText.isPreviewText && preview && (
            <div className='mt-[0.1875rem] flex flex-row items-center gap-1'>
              {preview?.favicon && (
                <CustomImage
                  src={
                    !preview.favicon.startsWith('http')
                      ? `https:${preview.favicon}`
                      : preview.favicon
                  }
                  alt={`${preview.siteName}'s logo`}
                  fallbackClassName=''
                  width={30}
                  height={30}
                  className='rounded-full bg-center bg-cover'
                />
              )}

              <Typography
                type='body'
                className={`text-sm font-medium tracking-medium line-clamp-1 ${
                  cardText.isPreviewText || cardImage
                    ? 'text-lightWhite'
                    : 'text-grayDark'
                }`}
              >
                {preview.siteName || new URL(preview.url).hostname}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default Card
