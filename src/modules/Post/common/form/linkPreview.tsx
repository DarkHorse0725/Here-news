import Avatar from 'components/Avatar'
import Loader from 'components/Loader'
import CustomImage from 'components/core/Image'
import formatDistance from 'date-fns/formatDistance'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { ILinkDetails, IPost } from 'types/interfaces'

interface Props {
  isLoading: boolean
  linKPreviewError: unknown
  preview?: ILinkDetails
  showSourceInfo: boolean
}

function EditorLinkPreview({
  isLoading,
  preview,
  linKPreviewError,
  showSourceInfo
}: Props) {
  if (isLoading) {
    return (
      <div className='rounded-lg px-4 py-2 bg-historic border-stroke flex flex-row justify-start items-center gap-2'>
        <Loader color='red' />
      </div>
    )
  }

  if (linKPreviewError && typeof linKPreviewError === 'string') {
    return (
      <div className='rounded-lg px-4 py-2 bg-historic border-stroke flex flex-row gap-2 !text-sm !leading-[1.2rem] text-red-500'>
        {linKPreviewError}
      </div>
    )
  }

  return preview && preview.title ? (
    <Link
      href={
        preview.sourcePost
          ? `/post/${preview.sourcePost.postId}/${preview.sourcePost.permalink}`
          : preview.url
      }
      target='_blank'
      className='no-underline rounded-lg p-2 bg-historic border-stroke flex flex-col items-stretch gap-2'
    >
      {/* Source post info */}
      {preview.sourcePost && showSourceInfo && (
        <SourcePostInfo {...preview.sourcePost} />
      )}

      <div
        className={`flex flex-row gap-2 items-center ${
          preview.sourcePost && showSourceInfo
            ? 'bg-baseWhite p-2 rounded-lg'
            : 'bg-transparent'
        }`}
      >
        {/* Preview Image */}
        {preview.image && (
          <CustomImage
            width={150}
            height={150}
            className='w-[7.75rem] h-[8.5rem] rounded-lg object-cover object-center shrink-0'
            fallbackClassName='w-[7.75rem] h-[8.5rem] rounded-lg bg-cover bg-center shrink-0'
            src={preview.image}
            alt={preview.title}
          />
        )}

        {/* Preview content */}
        <div className='flex flex-col gap-2 flex-1'>
          <div className='flex flex-row gap-1 items-center'>
            {/* Favicon */}
            {preview.favicon && (
              <CustomImage
                className='w-5 h-5 rounded-full object-contain object-center'
                fallbackClassName='w-5 h-5 rounded-full bg-contain bg-center bg-no-repeat'
                width={20}
                height={20}
                alt={preview.siteName || 'Site logo'}
                src={preview.favicon}
              />
            )}

            {/* Preview website */}
            <p className='text-xs leading-[140%] font-semibold tracking-medium text-linkBody'>
              {new URL(preview.url).host}
            </p>
          </div>

          {/* Preview title */}
          <p className='text-base sm:text-xl text-header leading-[140%] font-medium line-clamp-1'>
            {preview.title}
          </p>

          {/* Preview description */}
          <p className='text-xs sm:text-sm text-leading-[160%] text-linkBody text-justify line-clamp-3 sm:line-clamp-2'>
            {preview.description}
          </p>
        </div>
      </div>
    </Link>
  ) : (
    <></>
  )
}

const SourcePostInfo = ({
  userId: { avatar, userIdHash, displayName, verified },
  createdAt
}: IPost) => {
  const time = useMemo(
    () =>
      formatDistance(new Date(createdAt), new Date(), {
        addSuffix: true
      }),
    [createdAt]
  )

  return (
    <div className='flex flex-row items-center gap-2'>
      <Avatar
        imageUrl={avatar}
        iamgeClassNames='object-cover object-center'
        containerClassNames='h-10 w-10 sm:w-12 sm:h-12 rounded-full'
      />

      <p className='font-medium text-base sm:text-xl leading-[120%] tracking-medium text-header'>
        @{verified ? displayName : userIdHash}
      </p>

      <div className='w-1 h-1 sm:w-1.5 sm:h-1.5 bg-header rounded-full' />

      <p className='tracking-medium text-sm sm:text-base leading-[140%] text-header underline'>
        {time}
      </p>
    </div>
  )
}

export default EditorLinkPreview
