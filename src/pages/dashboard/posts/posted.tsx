import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  DashboardLayout,
  PostCard,
  Button
} from 'components/pages/dashboard'
import { BiLoaderAlt } from 'react-icons/bi'
import { useInfiniteQuery } from 'react-query'
import http from 'services/http-common'
import { IPost } from 'types/interfaces'
import Loader from 'components/Loader'
import Filter from 'assets/dashboard/filter.svg'
import useClickOutside from 'hooks/useClickOutside'
import {
  FiltersDropdown,
  NoPostCard
} from 'components/pages/dashboard/macros'

const Posted = () => {
  const limit = 30
  const observerElem = useRef(null)

  const [selectedFilter, setSelectedFilter] =
    useState<string>('Posts')
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)

  const { ref: filtersRef } = useClickOutside({
    shouldRegister: filtersOpen,
    onOutsideClick: () => setFiltersOpen(false)
  })

  const fetchUserPosts = async (page: number) => {
    const response = await http.get(
      `/getUserPosts?limit=${limit}&page=${page}&postType=${selectedFilter}`
    )
    return {
      result: response.data.data
    }
  }

  const {
    data,
    isLoading,
    isSuccess,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(
    selectedFilter,
    ({ pageParam = 1 }) => fetchUserPosts(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage: number = allPages.length + 1
        return lastPage.result.length === limit ? nextPage : undefined
      },
      enabled: true,
      refetchOnMount: true
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

  const onClickFilter = (item: string) => {
    setFiltersOpen(false)
    setSelectedFilter(item)
  }

  const toggleFiltersDropdown = () => {
    setFiltersOpen(!filtersOpen)
  }

  const FILTERS_OPTION = [
    {
      name: 'Posts',
      onClick: () => onClickFilter('Posts')
    },
    {
      name: 'Replies',
      onClick: () => onClickFilter('Replies')
    }
  ]

  return (
    <DashboardLayout>
      <div className={`flex flex-col gap-2 w-full mb-32`}>
        <div className='w-fit ml-auto relative z-20' ref={filtersRef}>
          <Button
            className='md:!w-[6rem]'
            text={selectedFilter}
            icon={Filter}
            onClick={toggleFiltersDropdown}
          />
          {filtersOpen ? (
            <FiltersDropdown options={FILTERS_OPTION} />
          ) : null}
        </div>

        {isLoading ? <Loader color='fill-primary' /> : null}
        {data?.pages[0]?.result?.length === 0 ? <NoPostCard /> : null}

        {isSuccess &&
          data &&
          data.pages &&
          data.pages.map(
            page =>
              page &&
              page.result &&
              page.result.map((post: IPost) => {
                return (
                  <PostCard
                    key={post.postId}
                    {...post}
                    type='posts'
                  />
                )
              })
          )}
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
    </DashboardLayout>
  )
}

export default Posted
