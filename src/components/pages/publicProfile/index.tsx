import React, { useCallback, useState } from 'react'
import Head from 'next/head'
import { useInfiniteQuery } from 'react-query'
import http from 'services/http-common'
import { IPublicUser } from 'types/interfaces'
import ProfilePageHeader from './header'
import Icon from 'components/core/Icon'
import PublicPosts from './posts'
import Button from 'components/core/Button'
import IntroductoryPost from './introduction'

const PublicProfilePage = ({
  user,
  totalPosts,
  totalDownvotes,
  totalUpvotes
}: IPublicUser) => {
  const {
    _id: userId,
    verified,
    userIdHash,
    displayName,
    introductoryPost
  } = user

  const limit = 30
  const [viewType, setViewType] = useState<'list' | 'grid'>('list')

  const getUserPosts = async (page: number) => {
    const response = await http.get(
      `/getPublicPosts/${userId}?perPage=${limit}&page=${page}`
    )

    return {
      result: response.data.data
    }
  }

  const response = useInfiniteQuery({
    queryKey: `getPublicPosts/${userId}`,
    queryFn: ({ pageParam = 1 }) => getUserPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage: number = allPages.length + 1
      return lastPage.result.length === limit ? nextPage : undefined
    },
    enabled: false
  })

  const toggleViewType = useCallback(
    () =>
      setViewType(previous =>
        previous === 'list' ? 'grid' : 'list'
      ),
    []
  )

  return (
    <div
      className={`w-full max-w-[100rem] p-4 sm:px-2 md:px-28 mb-8 flex flex-col items-stretch ${
        verified ? 'gap-4' : 'gap-2'
      } sm:gap-2`}
    >
      <Head>
        <title>
          {verified ? displayName : userIdHash}&apos;s Profile - Here
          News
        </title>
      </Head>

      <ProfilePageHeader user={user} />

      {verified ? (
        introductoryPost && (
          <IntroductoryPost post={introductoryPost} />
        )
      ) : (
        <div className='flex flex-col items-center sm:items-start p-2 sm:p-4 gap-2 rounded-lg border border-stroke bg-baseWhite'>
          <p className='text-base sm:text-xl leading-[120%] sm:leading-[140%] tracking-medium sm:tracking-normal font-medium text-primary'>
            This person haven&apos;t verified yet
          </p>

          <p className='text-sm sm:text-base leading-[160%] text-grayL'>
            No introductory post
          </p>
        </div>
      )}

      <div className='flex flex-col gap-2'>
        <div className='flex flex-row py-2 px-4 rounded-lg bg-baseWhite border border-stroke justify-between items-start sm:items-center'>
          {/* Summary */}
          <div className='flex flex-col sm:flex-row gap-2 sm:gap-6 sm:items-center'>
            <p className='text-xl leading-[140%] text-primary font-medium'>
              {!verified ? `@${userIdHash}` : displayName}&apos;s
              posts
            </p>

            <div className='flex flex-row gap-2 sm:gap-4 items-stretch py-[0.1875rem] px-2'>
              <p className='text-sm leading-[160%] text-grayMd'>
                {totalPosts || 0} Posts
              </p>

              <div className='border-l border-solid border-grayMd' />

              <p className='text-sm leading-[160%] text-grayMd'>
                {totalUpvotes || 0} Upvotes
              </p>

              <div className='border-l border-solid border-grayMd' />

              <p className='text-sm leading-[160%] text-grayMd'>
                {totalDownvotes || 0} Downvotes
              </p>
            </div>
          </div>

          {/* View type */}
          <div className='flex flex-row gap-[0.3125rem] sm:gap-2 shrink-0'>
            <Button
              className={`grid place-items-center rounded-lg !border-none transition-colors !p-[0.46875rem] sm:!p-3 ${
                viewType === 'list'
                  ? '!bg-primary'
                  : '!bg-transparent'
              }`}
              onClick={toggleViewType}
            >
              <div className='hidden sm:block'>
                <Icon
                  name='listView'
                  color={viewType === 'list' ? '#FFFFFF' : '#213642'}
                  raw
                />
              </div>

              <div className='block sm:hidden'>
                <Icon
                  name='smallListView'
                  color={viewType === 'list' ? '#FFFFFF' : '#213642'}
                  raw
                />
              </div>
            </Button>

            <Button
              className={`grid place-items-center rounded-lg !border-none !p-[0.46875rem] sm:!p-3 transition-colors ${
                viewType === 'grid'
                  ? '!bg-primary'
                  : '!bg-transparent'
              }`}
              onClick={toggleViewType}
            >
              <div className='hidden sm:block'>
                <Icon
                  name='gridView'
                  color={viewType === 'grid' ? '#FFFFFF' : '#213642'}
                  raw
                />
              </div>

              <div className='block sm:hidden'>
                <Icon
                  name='smallGridView'
                  color={viewType === 'grid' ? '#FFFFFF' : '#213642'}
                  raw
                />
              </div>
            </Button>
          </div>
        </div>

        <PublicPosts type={viewType} response={response} />
      </div>
    </div>
  )
}

export default PublicProfilePage
