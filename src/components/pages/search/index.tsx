import Button from 'components/core/Button'
import Icon from 'components/core/Icon'
import Typography from 'components/core/Typography'
import React, { useCallback, useEffect, useRef } from 'react'
import Masonry from 'react-masonry-css'
import { useInfiniteQuery } from 'react-query'
import { IPost } from 'types/interfaces'
import SearchItem from 'components/PostCard'
import Head from 'next/head'
import axios from 'axios'
import { BiLoaderAlt } from 'react-icons/bi'
import Popover from 'components/Popover'
import { useRouter } from 'next/router'
import { SearchOrderBy, SearchSort } from 'const'
import Link from 'next/link'
import { useAppDispatch } from 'store/hooks'
import { showShareModal } from 'store/slices/app.slice'

const SearchPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { q: searchQuery, sort, orderBy } = router.query

  if (!searchQuery || typeof searchQuery !== 'string') {
    throw 'No search query provided'
  } else if (
    sort &&
    (typeof sort !== 'string' ||
      !Object.keys(SearchSort).includes(sort))
  ) {
    throw 'Invalid sort value provided'
  } else if (
    orderBy &&
    (typeof orderBy !== 'string' ||
      !Object.keys(SearchOrderBy).includes(orderBy))
  ) {
    throw 'Invalid orderBy provided'
  }

  const limit = 30
  const breakpointColumnsObj = {
    default: 4,
    1320: 3,
    1000: 2,
    700: 1
  }

  const observerElem = useRef(null)

  const fetchSearchResults = async (page: number) => {
    const response = await axios.post(
      'https://us-central1-phonic-jetty-356702.cloudfunctions.net/getSearchQuery',
      {
        search: searchQuery,
        step: limit,
        offset: page,
        orderBy: orderBy ? SearchOrderBy[orderBy] : undefined,
        sort: sort ? SearchSort[sort] : undefined
      }
    )
    return {
      result: response.data.result
    }
  }

  const {
    data,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    `searchResults: ${searchQuery}`,
    ({ pageParam = 0 }) => fetchSearchResults(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage: number = allPages.length + 1
        return lastPage.result?.length === limit
          ? nextPage
          : undefined
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

  const onShare = useCallback(() => {
    dispatch(showShareModal())
  }, [dispatch])

  return (
    <div className='w-full max-w-[100rem] px-2 md:px-28 mb-8 flex flex-col items-stretch'>
      <Head>
        <title>{`${searchQuery} - Here News`}</title>
      </Head>

      <div className='flex flex-row flex-wrap py-2 my-4 justify-between items-center'>
        <Typography
          type='h2'
          className='font-semibold !text-xl !leading-7 flex-1 text-header'
        >
          {searchQuery}
        </Typography>

        <div className='flex flex-row justify-center items-center gap-2'>
          <Icon
            name='share2'
            className='h-12 w-12 bg-historic grid place-items-center rounded-lg !border-0'
            iconClassName='w-6 h-6 text-grayMd'
            noHighlights
            noShadow
            onClick={onShare}
          />

          <Popover className='mt-6 right-0'>
            <Button
              className='h-12 flex flex-row items-center justify-center gap-2 !py-3 !border-0 !px-2 bg-historic rounded-lg'
              size='medium'
              variant='light'
            >
              <Icon name='sort' raw />

              <Typography
                className='!text-base tracking-medium !leading-[1.2rem] text-grayMd font-medium'
                type='button'
              >
                Sort
              </Typography>
            </Button>

            {/* TODO: Add on click behaviors */}
            {() => (
              <div className='flex flex-col w-[7.875rem] h-32'>
                <Link
                  href={`/search?q=${searchQuery}&orderBy=time&sort=latest`}
                  className='no-underline grid place-items-center hover:opacity-90 flex-1 rounded-t-lg bg-baseWhite border border-stroke cursor-pointer font-medium text-base leading-[1.2rem] tracking-medium text-grayMedium'
                >
                  Latest
                </Link>

                <Link
                  href={`/search?q=${searchQuery}&orderBy=time&sort=earliest`}
                  className='no-underline grid place-items-center hover:opacity-90 border-t-0 flex-1 rounded-b-lg bg-baseWhite border border-stroke cursor-pointer font-medium text-base leading-[1.2rem] tracking-medium text-grayMedium'
                >
                  Earliest
                </Link>
              </div>
            )}
          </Popover>
        </div>
      </div>

      <div className='w-full'>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className='trending search'
          columnClassName='trending_column'
        >
          {isSuccess && data.pages.length > 0 ? (
            data?.pages?.map(page =>
              page?.result?.map((post: IPost) => (
                <SearchItem key={post.postId} {...post} />
              ))
            )
          ) : (
            <p className='grid place-items-center p-5'>
              No results found
            </p>
          )}
        </Masonry>

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
    </div>
  )
}

export default SearchPage
