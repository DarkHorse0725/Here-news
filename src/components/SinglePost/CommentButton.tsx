import Avatar from 'components/Avatar'
import Icon from 'components/core/Icon'
import Typography from 'components/core/Typography'
import React, { useMemo } from 'react'
import { IUser } from 'types/interfaces'

interface Props {
  commentors: IUser[]
  totalComments?: number
}

const CommentButton = ({ commentors, totalComments = 0 }: Props) => {
  const maxCommentors = 3
  const isExtraCountVisible = useMemo(
    () => commentors.length > maxCommentors,
    [commentors]
  )

  const allowedCommentors = useMemo(
    () => commentors.slice(0, maxCommentors),
    [commentors]
  )

  const largeAvatarBoxWidth = useMemo(
    () =>
      allowedCommentors.length > 0
        ? (allowedCommentors.length + (isExtraCountVisible ? 1 : 0)) *
            1.875 +
          1
        : 0,
    [allowedCommentors, isExtraCountVisible]
  )

  const smallAvatarBoxWidth = useMemo(
    () =>
      allowedCommentors.length > 0
        ? (allowedCommentors.length + (isExtraCountVisible ? 1 : 0)) *
            1.125 +
          0.5
        : 0,
    [allowedCommentors, isExtraCountVisible]
  )

  return (
    <div className='relative h-[1.875rem] sm:h-12 flex flex-row items-center px-2 rounded-lg bg-baseWhite border border-stroke gap-2'>
      {/* Avatar group for large screens */}
      <div
        className='flex-row hidden sm:flex'
        style={{
          width: `${largeAvatarBoxWidth}rem`
        }}
      >
        {allowedCommentors.map((item, index) => (
          <div
            className='absolute top-0 my-[0.1875rem]'
            style={{
              left: `${index * 1.875 + 0.5}rem`,
              zIndex: 5 - index
            }}
            key={item._id}
          >
            <Avatar
              // @ts-ignore
              imageUrl={item.avatar}
              iamgeClassNames='!p-0 object-cover rounded-full object-center'
              containerClassNames='w-10 h-10 rounded-full'
            />
          </div>
        ))}

        {isExtraCountVisible &&
          commentors.length - allowedCommentors.length > 0 && (
            <div
              className='absolute w-10 h-10 rounded-full bg-grayMd grid place-items-center text-[0.625rem] text-baseWhite font-medium top-0 my-[0.1875rem]'
              style={{
                left: `${
                  allowedCommentors.length * 1.875 + 0.3125
                }rem`
              }}
            >
              +{commentors.length - allowedCommentors.length}
            </div>
          )}
      </div>

      {commentors.length === 0 && (
        <div className='hidden sm:block'>
          <Icon name='comment' raw />
        </div>
      )}

      <Typography
        type='body'
        className='hidden sm:block !text-xs !leading-[1.2rem] text-grayMedium'
      >
        Comments ({totalComments})
      </Typography>

      {/* Avatar group for small screens */}
      <div
        className='flex-row flex sm:hidden'
        style={{
          width: `${smallAvatarBoxWidth}rem`
        }}
      >
        {allowedCommentors.map((item, index) => (
          <div
            className='absolute top-0 my-[0.1875rem]'
            style={{
              left: `${index * 1.125 + 0.5}rem`,
              zIndex: 5 - index
            }}
            key={item._id}
          >
            <Avatar
              // @ts-ignore
              imageUrl={item.avatar}
              iamgeClassNames='!p-0 object-cover rounded-full object-center'
              containerClassNames='w-6 h-6 rounded-full'
            />
          </div>
        ))}

        {isExtraCountVisible &&
          commentors.length - allowedCommentors.length > 0 && (
            <div
              className='w-6 h-6 rounded-full bg-grayMd grid place-items-center text-[0.625rem] text-baseWhite font-medium absolute top-0 my-[0.1875rem]'
              style={{
                left: `${allowedCommentors.length * 1.125 + 0.5}rem`
              }}
            >
              +{totalComments - commentors.length}
            </div>
          )}
      </div>

      <div className='flex flex-row gap-0.5 items-center'>
        <div className='block sm:hidden'>
          <Icon name='smallComment' raw />
        </div>

        <Typography
          type='body'
          className='block sm:hidden !text-xs !leading-[1.2rem] text-grayMedium'
        >
          ({totalComments})
        </Typography>
      </div>
    </div>
  )
}

export default CommentButton
