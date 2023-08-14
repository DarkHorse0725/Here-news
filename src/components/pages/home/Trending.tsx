import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import Head from 'next/head'
import { useInfiniteQuery } from 'react-query'
import { BiLoaderAlt } from 'react-icons/bi'
import Masonry from 'react-masonry-css'
import { IPost } from 'types/interfaces'
import http from 'services/http-common'
import Card from './Card'
import SearchCard from './MarketingCards/SearchCard'
import AddPostCard from './MarketingCards/AddPostCard'
import ExploreCard from './MarketingCards/ExploreCard'
import AboutCard from './MarketingCards/AboutCard'

const breakpointColumnsObj = {
  default: 4,
  1320: 3,
  1000: 2,
  700: 1
}

function Trending() {
  const limit = 30
  const observerElem = useRef(null)

  const fetchTrendingPosts = async (page: number) => {
    const response = await http.get(
      `/getTrendingPosts?per_page=${limit}&page=${page}`
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
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery(
    'getTrendingPosts',
    ({ pageParam = 1 }) => fetchTrendingPosts(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage: number = allPages.length + 1
        return lastPage.result.length === limit ? nextPage : undefined
      },
      enabled: false
    }
  )

  useEffect(() => {
    // Schedule reshuffling every 6 minutes (360000 milliseconds)
    const reshuffleInterval = setInterval(() => {
      refetch()
    }, 360000)

    return () => {
      clearInterval(reshuffleInterval)
    }
  }, [refetch])

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

  const posts = useMemo(() => {
    let cards =
      data?.pages?.reduce<JSX.Element[]>((totalPosts, page) => {
        totalPosts.push(
          ...(page?.result?.map((post: IPost) => (
            <Card key={post.postId} {...post} />
          )) || [])
        )

        return totalPosts
      }, []) || []

    const addIndex = Math.floor(cards.length / 4)
    const exploreIndex = Math.floor((cards.length * 3) / 4)

    cards.push(<AboutCard key='AboutCard' />)
    cards.push(<SearchCard key='searchCard' />)
    cards.splice(addIndex, 0, <AddPostCard key='addPostCard' />)
    cards.splice(exploreIndex, 0, <ExploreCard key='exploreCard' />)

    return cards
  }, [data])

  return (
    <div className='w-full max-w-[100rem] px-2 md:px-28 mb-8 flex flex-col items-center'>
      <Head>
        <title>Trending - Here News</title>
      </Head>

      <div className='w-full'>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className='trending'
          columnClassName='trending_column'
        >
          {isSuccess && posts}
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

export default Trending
