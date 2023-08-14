import React, { useCallback, useEffect, useRef } from 'react'
import { DashboardLayout, Button } from 'components/pages/dashboard'
import { NotificationItem } from 'components/pages/notifications'
import { useInfiniteQuery, useMutation } from 'react-query'
import http from 'services/http-common'
import { BiLoaderAlt } from 'react-icons/bi'
import Loader from 'components/Loader'
import { toast } from 'react-toastify'

const Notifications = () => {
  const limit = 30
  const observerElem = useRef(null)

  const fetchNotifications = async (page: number) => {
    const response = await http.get(
      `/notifications?limit=${limit}&page=${page}`
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
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery(
    'fetchNotifications',
    ({ pageParam = 1 }) => fetchNotifications(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage: number = allPages.length + 1
        return lastPage.result.length === limit ? nextPage : undefined
      },
      enabled: true
    }
  )

  const markAllAsRead = useMutation(
    () => {
      return http.put(`/notification/markAllAsRead`)
    },
    {
      onSuccess: () => {
        refetch()
      },
      onError: () => {
        toast.error('There was some error!')
      }
    }
  )

  const onClickDismissAll = () => {
    markAllAsRead.mutate()
  }

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
    <DashboardLayout>
      <div className='w-full flex flex-col items-center gap-4 min-h-screen'>
        {isLoading ? (
          <div className='w-full h-32'>
            <Loader color='fill-primary' />
          </div>
        ) : null}
        {data?.pages[0]?.result?.length === 0 ? (
          <NotificationItem
            type='noNotification'
            text='No notifications here yet!'
          />
        ) : null}
        {isSuccess && data && data.pages ? (
          <Button
            text='Dismiss All'
            className={`ml-auto ${
              markAllAsRead.isLoading
                ? 'cursor-not-allowed opacity-60'
                : ''
            }`}
            textClassName='!text-[#858D9D]'
            onClick={onClickDismissAll}
            disabled={markAllAsRead.isLoading}
          />
        ) : null}
        {isSuccess &&
          data &&
          data.pages &&
          data.pages.map(
            page =>
              page &&
              page.result &&
              page.result.map((notification: any) => {
                return (
                  <NotificationItem
                    key={notification._id}
                    {...notification}
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
                  'Load more notifications...'
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

export default Notifications
