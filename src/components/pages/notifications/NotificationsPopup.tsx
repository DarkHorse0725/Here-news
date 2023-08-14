import React from 'react'
import { NotificationItem } from './NotificationItem'
import { useRouter } from 'next/router'
import http from 'services/http-common'
import { useQuery } from 'react-query'
import Loader from 'components/Loader'

const NotificationsPopup = () => {
  const router = useRouter()
  const limit = 10

  const { data, isSuccess, isLoading } = useQuery(
    'getNotifications',
    () => {
      return http.get(
        `/notifications/status/unread?limit=${limit}&page=1`
      )
    },
    {
      cacheTime: 0
    }
  )

  // const markAllAsRead = useMutation(
  //   () => {
  //     return http.put(`/notification/markAllAsRead`)
  //   },
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries('fetchNotifications')
  //       queryClient.invalidateQueries('getNotifications')
  //     },
  //     onError: () => {
  //       toast.error('There was some error!')
  //     }
  //   }
  // )

  const onClickViewAll = () => {
    router.push('/dashboard/notifications')
    // markAllAsRead.mutate()
  }

  return (
    <div
      className='max-h-[calc(100vh-150px)] overflow-auto absolute top-12 divide-y-[1px] divide-[#E6E6E6] border-[1px] border-stroke rounded-[8px]'
      style={{
        boxShadow:
          '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)'
      }}
    >
      <div
        className={`min-w-[20rem] max-w-[25rem] flex items-center gap-2 bg-white p-4`}
      >
        <div className='h-[6px] w-[6px] rounded-full bg-primary' />
        <p className='text-base leading-[120%] text-primary'>
          Notifications
        </p>
      </div>
      {isLoading ? (
        <div className='w-full h-32 bg-baseWhite'>
          <Loader color='fill-primary' />
        </div>
      ) : null}
      {isSuccess && data?.data?.data?.length === 0 ? (
        <NotificationItem
          isPopup
          type='noNotification'
          text='No unread notifications here yet!'
        />
      ) : (
        isSuccess &&
        data?.data?.data?.map((notification: any) => (
          <NotificationItem
            isPopup
            type='invite'
            key={notification._id}
            {...notification}
          />
        ))
      )}
      <p
        className='text-left text-base leading-[19px] font-[500] text-gray5 p-4 bg-white rounded-[0_0_8px_8px] cursor-pointer'
        onClick={onClickViewAll}
      >
        View All
      </p>
    </div>
  )
}

export { NotificationsPopup }
