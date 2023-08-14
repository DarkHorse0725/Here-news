import React, { useCallback, useEffect, useRef } from 'react'
import { BiLoaderAlt } from 'react-icons/bi'
import { useInfiniteQuery } from 'react-query'
import http from 'services/http-common'
import { useAppSelector } from 'store/hooks'
import { IPost } from 'types/interfaces'
import PostTicket from '../explore/PostTicket'
import Icon from 'components/core/Icon'
import { useDispatch } from 'react-redux'
import { removeAllPosts } from 'store/slices/notification.slice'

function Explore() {
  const limit = 30
  const dispatch = useDispatch()

  const observerElem = useRef(null)
  const selectedAccount = useAppSelector(
    state => state.auth.selectedAccount
  )

  const fetchExplorePosts = async (page: number) => {
    const response = await http.get(
      `/getExplorePosts?per_page=${limit}&page=${page}`
    )
    return {
      result: response.data.data
    }
  }

  const {
    data,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    'getExplorePosts',
    ({ pageParam = 1 }) => fetchExplorePosts(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage: number = allPages.length + 1
        return lastPage.result.length === limit ? nextPage : undefined
      },
      enabled: false
    }
  )

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage]
  )

  useEffect(() => {
    if (!observerElem.current) return
    const element: HTMLDivElement = observerElem.current
    const option = { threshold: 0 }

    const observer = new IntersectionObserver(handleObserver, option)
    observer.observe(element)
    return () => observer.unobserve(element)
  }, [fetchNextPage, hasNextPage, handleObserver])

  // To remove the new posts notification from header when you visit explore screen
  useEffect(() => {
    dispatch(removeAllPosts())
  }, [dispatch])

  return (
    <div
      className={`flex flex-col gap-4 w-full max-w-[100rem] m-auto pt-[1.5625rem] px-2 md:px-28 ${
        selectedAccount ? 'mt-2' : ''
      }`}
    >
      <div
        className='h-[4.5rem] sm:h-[5.875rem] flex flex-row items-center p-4 gap-4 border border-stroke backdrop-blur-[0.78125rem] rounded-lg'
        style={{
          background:
            'radial-gradient(50% 50.00% at 50% 50.00%, rgba(218, 218, 218, 0.08) 0%, rgba(249, 250, 252, 0.08) 100%), rgba(255, 255, 255, 0.60)'
        }}
      >
        <span className='text-lg sm:text-2xl leading-[160%] font-medium text-primary'>
          Latest Activities
        </span>

        <Icon name='explore' raw />
      </div>

      <div className='flex flex-col gap-2'>
        {isSuccess &&
          data?.pages?.map(page =>
            page?.result?.map((post: IPost) => {
              return <PostTicket key={post.postId} {...post} />
            })
          )}
      </div>

      {hasNextPage && (
        <div className='my-4 w-full z-[1] loader' ref={observerElem}>
          <div className='flex items-center justify-center z-[1]'>
            <p className='text-white text-sm bg-black px-3 py-2 rounded-lg font-semibold flex flex-row items-center'>
              {!isFetchingNextPage ? (
                'Load more news...'
              ) : (
                <div className='flex flex-row items-center'>
                  <span className='animate-spin rotate mr-2'>
                    <BiLoaderAlt color='white' />
                  </span>
                  Loading news...
                </div>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Explore
