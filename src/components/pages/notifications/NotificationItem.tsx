import React, { useMemo } from 'react'
import formatDistance from 'date-fns/formatDistance'
import { useMutation, useQueryClient } from 'react-query'
import http from 'services/http-common'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import {
  getCardText,
  getNotificationText,
  timeDifference
} from 'utils'
import Icon from 'components/core/Icon'

interface NotificationItemProps {
  type:
    | 'invite'
    | 'comment'
    | 'upvote'
    | 'downvote'
    | 'noNotification'
    | 'wallet'
    | 'reputation'
    | 'tip'
  status?: 'read' | 'unread'
  isPopup?: boolean
  text?: string
  createdAt?: string
  _id?: any
  post?: any
  metadata?: any
}

const ICON_TYPE: any = {
  invite: 'userIcon',
  comment: 'comment',
  upvote: 'upvote',
  downvote: 'downvote',
  noNotification: 'emoji',
  wallet: 'wallet',
  reputation: 'user',
  tip: 'tips'
}

const POST_NOTIFICATION_TYPES = [
  'upvote',
  'downvote',
  'comment',
  'tip'
]

const NotificationItem = ({
  isPopup,
  type,
  status,
  text,
  _id,
  post,
  metadata,
  createdAt
}: NotificationItemProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate, isLoading } = useMutation(
    id => {
      return http.patch(`/notification/markAsRead/${id}`)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fetchNotifications')
        queryClient.invalidateQueries('getNotifications')
      },
      onError: () => {
        toast.error('There was some error!')
      }
    }
  )

  const markAsRead = () => {
    mutate(_id)
  }

  const onNotificationClick = (e: any) => {
    if (e.target.classList.contains('dismissBtn')) {
      return
    }
    if (POST_NOTIFICATION_TYPES.includes(type)) {
      router.push(`/post/${post}`)
    }
    markAsRead()
  }

  const cardText = useMemo(
    () =>
      getCardText(metadata?.title, metadata?.text, metadata?.preview),
    [metadata?.title, metadata?.text, metadata?.preview]
  )

  const notificationText = metadata
    ? getNotificationText(
        type,
        cardText?.title,
        metadata.count,
        isPopup ? 10 : 50
      )
    : text

  return (
    <div
      className={`bg-white ${
        isPopup ? ' border-y-[1px]' : ' border-[1px]'
      } border-stroke flex items-center justify-between w-full ${
        !isPopup
          ? 'rounded-[8px] gap-4 py-4 px-4 md:px-[30px]'
          : 'gap-2 px-4 py-2'
      }`}
      onClick={onNotificationClick}
    >
      <div
        className={`flex flex-row items-start gap-4 ${
          isPopup ? 'py-1' : ''
        } w-full`}
      >
        <Icon
          name={ICON_TYPE[type]}
          raw
          size={isPopup ? 20 : 24}
          color='#5A6B74'
        />
        <div className='flex flex-col gap-2'>
          <p
            className={`text-left font-[400] text-grayMedium ${
              isPopup
                ? 'text-sm leading-[20px]'
                : 'text-sm md:text-base leading-[25px]'
            } `}
          >
            {notificationText}
          </p>
          <div
            className={`${
              type === 'noNotification' || isPopup ? 'hidden' : ''
            } flex items-center gap-2`}
          >
            <div className='h-[6px] w-[6px] rounded-full bg-landing-gray_14' />
            <p className='text-xs sm:text-sm leading-[120%] text-grayMedium font-[400]'>
              {createdAt
                ? formatDistance(new Date(createdAt), new Date(), {
                    addSuffix: true
                  })
                : ''}
            </p>
          </div>
        </div>
      </div>
      <p
        className={`dismissBtn ${
          type === 'noNotification' || isPopup || status === 'read'
            ? 'hidden'
            : ''
        } text-sm md:text-base font-[500] leading-[19px] text-grayLight ${
          isLoading ? 'pointer-events-none' : 'cursor-pointer '
        }`}
        onClick={markAsRead}
      >
        Dismiss
      </p>
      <div
        className={`${
          !isPopup ? 'hidden' : ''
        } w-[60px] text-left flex items-center gap-2`}
      >
        <div className='h-[6px] w-[6px] rounded-full bg-landing-gray_14' />
        <p
          className={`${
            !isPopup ? 'hidden' : ''
          } text-left flex-none text-sm leading-[120%] text-grayLight cursor-pointer`}
        >
          {createdAt ? timeDifference(new Date(createdAt)) : '1s'}
        </p>
      </div>
    </div>
  )
}

export { NotificationItem }
