import Icon from 'components/core/Icon'
import useClickOutside from 'hooks/useClickOutside'
import Link from 'next/link'
import React, {
  useCallback,
  useState,
  useEffect,
  useRef
} from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  logout,
  setBalance,
  setSelectedAccount
} from 'store/slices/auth.slice'
import LoginModal from './pages/home/LoginModal'
import logoutIcon from 'assets/logout.svg'
import Logo from '../assets/logo.png'
import 'react-awesome-animated-number/dist/index.css'
import Button from './core/Button'
import Typography from './core/Typography'
import Image from 'next/image'
import { showEditorModal } from 'store/slices/editor.slice'
import InviteModal from './pages/home/InviteModal'
import { useRouter } from 'next/router'
import ForgotPasswordModal from './pages/home/ForgotPasswprd'
import ChangePasswordModal from './pages/home/ChangePasswordModal'
import { formatCurrency } from 'utils'
import dynamic from 'next/dynamic'
import { NotificationsPopup } from './pages/notifications'
import http from 'services/http-common'
import { removeAllPosts } from 'store/slices/notification.slice'
import WelcomeModal from './pages/home/WelcomeModal'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Tooltip from './Tooltip'
import { setIsLogoutModalVisible } from 'store/slices/app.slice'
import LogoutModal from './pages/home/LogoutModal'

const AuthoringViewModal = dynamic(
  () => import('./pages/home/AuthoringViewModal'),
  {
    ssr: false
  }
)

const ShareModal = dynamic(
  () => import('components/blocks/ShareModal'),
  { ssr: false }
)

function Header() {
  const dispatch = useAppDispatch()
  const { selectedAccount, balance } = useAppSelector(
    state => state.auth
  )

  const router = useRouter()

  const [isLoginVisible, setIsLoginVisible] = useState(false)
  const [isInviteVisible, setIsInviteVisible] = useState(false)
  const [isForgotVisible, setIsForgotVisible] = useState(false)
  const [isChangeVisible, setIsChangeVisible] = useState(false)
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false)
  const [openAccount, setOpenAccount] = useState(false)

  const { ref: accountMenuRef } = useClickOutside({
    shouldRegister: openAccount,
    onOutsideClick: () => setOpenAccount(false)
  })

  const toggleIsLoginVisible = () => {
    setIsLoginVisible(prev => !prev)
  }
  const toggleIsInviteVisible = () => {
    setIsInviteVisible(prev => !prev)
  }
  const toggleIsForgotVisible = () => {
    setIsForgotVisible(prev => !prev)
  }
  const toggleIsChangeVisible = () => {
    setIsChangeVisible(prev => !prev)
  }
  const toggleIsWelcomeVisible = () => {
    setIsWelcomeVisible(false)
  }

  const showAuthoringViewModal = useCallback(
    () => dispatch(showEditorModal()),
    [dispatch]
  )

  const toggleOpenAccount = () => {
    if (openAccount) return setOpenAccount(false)
    setOpenAccount(prev => !prev)
  }

  useEffect(() => {
    if (
      router?.query?.username &&
      router?.query?.forgottoken &&
      selectedAccount?.displayName
    ) {
      dispatch(logout())
    }
    if (
      router?.query?.username &&
      router?.query?.forgottoken &&
      !selectedAccount?.displayName
    ) {
      setIsChangeVisible(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, selectedAccount?.displayName])

  const [notificationsPopupOpen, setNotificationsPopupOpen] =
    useState<boolean>(false)
  const { ref: notificationsRef } = useClickOutside({
    shouldRegister: notificationsPopupOpen,
    onOutsideClick: () => setNotificationsPopupOpen(false)
  })

  // Explore Sectiion related code
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

  //Update hasNewNotifications to false
  const notificationUpdateMutation = useMutation(
    () => {
      return http.patch(`/hasNewNotifications`)
    },
    {
      onSuccess: data => {
        if (data?.data?.success) {
          dispatch(setSelectedAccount(data?.data?.data))
          dispatch(setBalance(data?.data?.data?.balance))
        }
      },
      onError: err => {
        toast.error('Error. Cannot update notifications!')
      }
    }
  )

  const onClickNotificationBtn = () => {
    notificationUpdateMutation.mutate()
    if (window.innerWidth < 768) {
      router.push('/dashboard/notifications')
    } else {
      setNotificationsPopupOpen(!notificationsPopupOpen)
    }
  }

  return (
    <React.Fragment>
      <div className='w-full h-[72px] min-h-[72px] max-h-[72px]'></div>
      <header className='flex items-center border-b border-b-stroke justify-center fixed left-0 top-0 w-full z-[30] bg-white h-[72px] min-h-[72px] max-h-[72px]'>
        <div className='flex justify-between items-center w-full max-w-[100rem] px-2 md:px-4 lg:px-28 py-3'>
          <Link href='/'>
            <Image
              src={Logo}
              alt='Logo'
              width={150}
              className='w-16 sm:w-[4.5625]'
            />
          </Link>

          <Link
            href='/explore'
            className='hidden md:block text-[20px] text-primary font-medium leading-[25px] no-underline'
          >
            {router.pathname !== '/explore' &&
            showPostsNotification &&
            totalPostsCount > 0 ? (
              `Explore (${totalPostsCount} users have posted just now)`
            ) : (
              <div className='flex flex-row items-center gap-1'>
                Explore what&apos;s happening...
                <Icon name='star' raw />
              </div>
            )}
          </Link>

          <Link
            href='/explore'
            className='flex !text-xs !leading-4 tracking-medium font-medium text-grayMedium no-underline sm:hidden flex-row items-center gap-2 p-2 rounded-lg bg-historic'
          >
            Explore
            <Icon name='smallStar' raw />
          </Link>

          <div className='flex flex-row gap-1 sm:gap-2 items-center cursor-pointer'>
            {selectedAccount ? (
              <React.Fragment>
                <Tooltip id='postButton' message='1&micro; to post'>
                  <Button
                    variant='light'
                    onClick={showAuthoringViewModal}
                    className='post-btn w-10 sm:w-20 h-10 sm:h-12 !p-0 sm:!p-2 sm:!pr-[0.875rem] flex flex-row items-center justify-center outline-none gap-1 !bg-secondary !border !border-stroke rounded-lg'
                  >
                    <Icon name='plus' raw />

                    <Typography
                      type='button'
                      className='hidden sm:block !text-base text-primary font-medium !leading-[1.2rem] -tracking-[0.02rem]'
                    >
                      Post
                    </Typography>
                  </Button>
                </Tooltip>

                {/* Notification icon */}
                <button
                  type='button'
                  className='relative h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-white border-solid border-[1px] border-stroke grid place-items-center'
                  onClick={() => onClickNotificationBtn()}
                  ref={notificationsRef}
                >
                  <div className='relative px-[0.1875rem] py-0.5'>
                    <Icon name='bellIcon' raw noShadow />
                    {/* Blue Dot */}
                    {selectedAccount?.hasNewNotifications ? (
                      <div className='absolute top-0 right-[2px] h-[10px] w-[10px] border-[2px] border-white rounded-full bg-[#FF0000]' />
                    ) : null}
                  </div>
                  {notificationsPopupOpen ? (
                    <NotificationsPopup />
                  ) : null}
                </button>

                <div className='relative z-10' ref={accountMenuRef}>
                  <button
                    type='button'
                    className='rounded-lg p-1 h-10 sm:h-12 flex flex-row gap-1 sm:gap-2 bg-whitw border-stroke border-[1px] justify-center items-center'
                    onClick={toggleOpenAccount}
                  >
                    <Image
                      // @ts-ignore
                      src={selectedAccount.avatar}
                      height={40}
                      width={40}
                      className='bg-black rounded-full w-7 h-7 sm:w-10 sm:h-10'
                      alt='profile'
                    />
                    <Typography
                      type='body'
                      className='min-w-[30px] !text-[10px] sm:!text-base !leading-[1.4rem] -tracking-[0.02rem] font-normal text-grayMd'
                    >
                      {formatCurrency(balance)}{' '}
                      <span className='font-semibold'>&micro;</span>{' '}
                    </Typography>
                    <div className='p-1 sm:px-[0.375rem] sm:py-[0.5625rem]'>
                      <Icon name='downArrow' raw />
                    </div>
                  </button>
                  {openAccount && (
                    <div
                      className='absolute w-[228px] border-[1px] shadow-2xl border-[#e6e6e6] bg-white rounded-[8px] right-0 top-[110%] z-[30]'
                      style={{
                        boxShadow:
                          '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)'
                      }}
                    >
                      <div
                        className='flex items-center gap-2 h-12 bg-background px-2 md:px-4 py-6'
                        onClick={() =>
                          router.push('/dashboard/profile')
                        }
                      >
                        <Image
                          // @ts-ignore
                          src={selectedAccount?.avatar}
                          height={24}
                          width={24}
                          className='rounded-full bg-black'
                          alt='profile'
                        />

                        <Typography
                          type='body'
                          className='truncate text-left w-full text-base text-primary font-medium leading-[1.2rem] tracking-medium'
                        >
                          Profile
                        </Typography>
                      </div>
                      <div
                        onClick={() =>
                          dispatch(setIsLogoutModalVisible(true))
                        }
                        className='h-16 px-2 md:px-4 py-4 flex items-center gap-2'
                      >
                        <Image
                          src={logoutIcon}
                          height={18}
                          width={18}
                          alt='dashboard'
                        />
                        <Typography
                          type='body'
                          className='text-left text-base text-grayMd capitalize font-medium leading-[120%]'
                        >
                          Log out
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Tooltip id='postButton' message='1&micro; to post'>
                  <Button
                    variant='light'
                    onClick={() => toggleIsLoginVisible()}
                    className='post-btn w-10 sm:w-20 h-10 sm:h-12 !p-0 sm:!p-2 sm:!pr-[0.875rem] flex flex-row items-center justify-center outline-none gap-1 !bg-secondary !border !border-stroke rounded-lg'
                  >
                    <Icon name='plus' raw />

                    <Typography
                      type='button'
                      className='hidden sm:block !text-base text-primary font-medium !leading-[1.2rem] -tracking-[0.02rem]'
                    >
                      Post
                    </Typography>
                  </Button>
                </Tooltip>
                <Button
                  variant='light'
                  className='h-12 bg-white rounded-lg border-[1px] border-landing-gray_12'
                  onClick={() => toggleIsLoginVisible()}
                >
                  <Typography type='link' className='no-underline'>
                    Log In
                  </Typography>
                </Button>
              </React.Fragment>
            )}
          </div>
        </div>
      </header>

      <LoginModal
        isLoginVisible={isLoginVisible}
        toggleIsLoginVisible={toggleIsLoginVisible}
      />

      <InviteModal
        isInviteVisible={isInviteVisible}
        toggleIsInviteVisible={toggleIsInviteVisible}
      />

      <AuthoringViewModal />

      <ForgotPasswordModal
        isForgotVisible={isForgotVisible}
        toggleIsForgotVisible={toggleIsForgotVisible}
      />

      <ShareModal />
      <LogoutModal />

      <ChangePasswordModal
        isChangeVisible={isChangeVisible}
        toggleIsChangeVisible={toggleIsChangeVisible}
      />
      <WelcomeModal
        isWelcomeVisible={isWelcomeVisible}
        toggleIsWelcomeVisible={toggleIsWelcomeVisible}
      />
    </React.Fragment>
  )
}

export default Header
