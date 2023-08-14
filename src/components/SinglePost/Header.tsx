import Typography from 'components/core/Typography'
import formatDistance from 'date-fns/formatDistance'
import React, { useMemo } from 'react'
import { IPost } from 'types/interfaces'
import VotesCounter from './VotesCounter'
import Link from 'next/link'
import Avatar from 'components/Avatar'
import Icon from 'components/core/Icon'

interface Props {
  post: IPost
  focused?: boolean
}

const SinglePostHeader = ({ post, focused }: Props) => {
  const {
    createdAt,
    upvotes,
    downvotes,
    tips,
    repliedTo,
    postId,
    userId: { userIdHash, _id: userId, displayName, avatar, verified }
  } = post

  const time = useMemo(
    () =>
      formatDistance(new Date(createdAt), new Date(), {
        addSuffix: true
      }),
    [createdAt]
  )

  return (
    <div
      className={`sticky flex z-10 w-full flex-row items-center py-2 sm:py-[0.9375rem] ${
        focused && repliedTo ? 'top-[7.6rem]' : 'top-[4.5rem]'
      } ${focused ? 'bg-baseWhite' : 'bg-historic'}`}
    >
      <Avatar
        imageUrl={avatar}
        iamgeClassNames='!p-0 object-cover object-center'
        containerClassNames='rounded-full shrink-0 w-[2.3125rem] h-[2.3125rem] mr-[0.5625rem] block sm:hidden'
      />

      <div className='flex flex-row flex-1 justify-between items-center'>
        <div className='flex flex-col'>
          <div className='flex flex-row items-center gap-1 sm:gap-2 flex-wrap'>
            <div className='flex flex-row items-center gap-1 sm:gap-2'>
              <Link
                href={`/publicProfile/${userId}`}
                className='no-underline'
              >
                <Typography
                  type='subtitle-small'
                  className={`font-medium !text-base !leading-[1.2rem] text-primary ${
                    focused ? 'sm:!text-2xl' : 'sm:!text-xl'
                  }`}
                >
                  {verified ? displayName : `@${userIdHash}`}
                </Typography>
              </Link>

              {verified && (
                <Icon name='verifiedBadge' raw size={18} />
              )}
            </div>

            <p className='text-xs sm:text-base leading-[160%] text-grayMedium'>
              {!verified ? `(${displayName} ???)` : `@${userIdHash}`}
            </p>
          </div>

          <div className='flex flex-row items-center gap-1'>
            <div className='w-1 h-1 rounded-full bg-grayMd' />

            <Typography
              type='body'
              className='text-grayMd !text-[0.625rem] sm:!text-xs !leading-[1.2rem]'
            >
              {time}
            </Typography>
          </div>
        </div>

        <VotesCounter
          upvotes={upvotes}
          downvotes={downvotes}
          tips={tips}
          postId={postId}
          posterID={userId}
          focused={focused ? true : false}
        />
      </div>
    </div>
  )
}

export default SinglePostHeader
