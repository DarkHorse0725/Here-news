import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import { removeAllPosts } from 'store/slices/notification.slice'
import { useAppDispatch, useAppSelector } from 'store/hooks'

import Pattern from 'assets/pattern.png'

function PostAlert() {
  const selectedAccount = useAppSelector(
    state => state.auth.selectedAccount
  )

  const dispatch = useAppDispatch()
  const newPostsNotification = useAppSelector(
    state => state.notificaiton.newPosts
  )

  const [showPostsNotification, setShowPostsNotification] =
    useState<boolean>(false)

  const [totalPostsCount, setTotalPostsCount] = useState(
    newPostsNotification?.length || 0
  )

  const removePosts = useCallback(
    () => dispatch(removeAllPosts()),
    [dispatch]
  )

  const notificationInterval = useRef<any>(null)
  const timeoutId = useRef<any>(null)

  const handleInterval = useCallback(() => {
    setShowPostsNotification(true)
    setTotalPostsCount(newPostsNotification?.length || 0)

    if (newPostsNotification?.length && selectedAccount?._id) {
      const newPosts = newPostsNotification.find(
        element => element.user._id === selectedAccount._id
      )
      if (newPosts) {
        setTotalPostsCount(newPostsNotification.length - 1)
      }
    }
  }, [newPostsNotification, selectedAccount])

  const handleTimeout = useCallback(() => {
    if (showPostsNotification && totalPostsCount > 0) {
      removePosts()
      setShowPostsNotification(false)
    }
  }, [removePosts, showPostsNotification, totalPostsCount])

  useEffect(() => {
    notificationInterval.current = setInterval(handleInterval, 5000)
    timeoutId.current = setTimeout(handleTimeout, 30000)

    return () => {
      clearInterval(notificationInterval.current)
      clearTimeout(timeoutId.current)
    }
  }, [handleInterval, handleTimeout])

  return (
    <div
      className={`relative -z-10 mt-[64px] max-lg:h-[calc(250px-78px-22px)] h-[calc(235px-78px-22px)] `}
    >
      <div
        className={`fixed top-0 left-0 w-screen max-lg:h-72 h-64 bg-here-purple-900`}
      >
        <div
          className='flex-1 w-full h-full opacity-50'
          style={{
            background: `url(${Pattern.src}), #53389E`,
            backgroundBlendMode: 'color-burn'
          }}
        />
      </div>
      {/* <div className='relative '>
        {router.pathname === '/explore' &&
          showPostsNotification &&
          totalPostsCount > 0 && (
            <div className='w-full absolute -top-10 left-1/2 transform translate-x-[-50%]'>
              <div className='flex items-center justify-center gap-4 text-white mb-8 text-[1.3rem]'>
                <Icon name='frontView' raw />
                <Typography type='subtitle-small'>
                  <span className='font-bold'>
                    {totalPostsCount} people
                  </span>{' '}
                  just post new things
                </Typography>
              </div>
            </div>
          )}
      </div> */}
    </div>
  )
}

export default PostAlert
