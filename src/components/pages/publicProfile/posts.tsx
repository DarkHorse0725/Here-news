import PostCard from 'components/PostCard'
import React, { useCallback, useEffect, useRef } from 'react'
import { BiLoaderAlt } from 'react-icons/bi'
import Masonry from 'react-masonry-css'
import { UseInfiniteQueryResult } from 'react-query'
import { IPost } from 'types/interfaces'
import PostTicket from '../explore/PostTicket'

interface Props {
  type: 'list' | 'grid'
  response: UseInfiniteQueryResult<{ result: any }>
}

const PublicPosts = ({
  type,
  response: { data, fetchNextPage, hasNextPage, isFetchingNextPage }
}: Props) => {
  const breakpointColumnsObj = {
    default: 4,
    1320: 3,
    1000: 2,
    700: 1
  }

  const observerElem = useRef(null)

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

  return (
    <>
      <div className='w-full'>
        {type === 'list' ? (
          <div className='flex flex-col gap-2'>
            {data?.pages.map(page =>
              page.result.map((post: IPost) => (
                <PostTicket key={post.postId} {...post} />
              ))
            )}
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className='trending'
            columnClassName='trending_column'
          >
            {data?.pages.map(page =>
              page.result.map((post: IPost) => (
                <PostCard key={post.postId} {...post} />
              ))
            )}
          </Masonry>
        )}

        {/* Page loader */}
        {hasNextPage && (
          <div
            className='my-4 w-full z-[1] loader'
            ref={observerElem}
          >
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
    </>
  )
}

export default PublicPosts
