import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { IPublicUser } from 'types/interfaces'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { showShareModal } from 'store/slices/app.slice'
import Avatar from 'components/Avatar'
import ReputationBadge from 'assets/smallReputationBadge.svg'
import Icon from 'components/core/Icon'
import Button from 'components/core/Button'
import Badge from 'assets/dashboard/verify.svg'
import { useMutation } from 'react-query'
import http from 'services/http-common'
import { toast } from 'react-toastify'

const ProfilePageHeader = ({
  user: {
    _id,
    avatar,
    verified,
    userIdHash,
    displayName,
    reputation,
    verifiedBy
  }
}: IPublicUser) => {
  const dispatch = useAppDispatch()
  const { selectedAccount } = useAppSelector(state => state.auth)

  const [isVerifiedByCurrentUser, setIsVerifiedByCurrentUser] =
    useState(verifiedBy?.includes(selectedAccount?._id))

  const canVerifyOthers = useMemo(
    () => selectedAccount?.verified,
    [selectedAccount]
  )

  const tooltipMessage = useMemo(
    () =>
      canVerifyOthers
        ? isVerifiedByCurrentUser
          ? 'Unverify this user'
          : 'Verify this user'
        : 'You need to be verified first to be able to verify others',
    [canVerifyOthers, isVerifiedByCurrentUser]
  )

  useEffect(() => {
    setIsVerifiedByCurrentUser(
      verifiedBy?.includes(selectedAccount?._id)
    )
  }, [verifiedBy, selectedAccount?._id])

  const onShare = useCallback(() => {
    dispatch(showShareModal())
  }, [dispatch])

  const verifyUserMutation = useMutation(
    (data: any) => {
      return http.put(`/verifyUser`, data)
    },
    {
      onSuccess: data => {
        setIsVerifiedByCurrentUser(!isVerifiedByCurrentUser)
      },
      onError: err => {
        toast.error('Cannot verify user. Please try again!')
      }
    }
  )

  const onVerifyClick = useCallback(() => {
    if (canVerifyOthers) {
      verifyUserMutation.mutate({ id: _id })
    }
  }, [canVerifyOthers, verifyUserMutation, _id])

  return (
    <div className='flex flex-col-reverse sm:flex-row items-end sm:items-center sm:justify-between sm:p-4 sm:bg-baseWhite sm:border sm:border-stroke sm:rounded-lg'>
      <div className='flex flex-col self-center items-center gap-2'>
        <div className='flex self-center flex-col sm:flex-row items-center gap-4 sm:gap-[1.04375rem]'>
          {/* Avatar and the badge */}
          <div className='relative'>
            {/* Avatar */}
            <Avatar
              imageUrl={avatar}
              containerClassNames='rounded-full w-[8.4375rem] sm:w-[6.25rem] aspect-square bg-baseWhite border-[0.0965rem] border-stroke'
              iamgeClassNames='!p-0 object-cover object-center'
            />

            {/* Reputation badge */}
            <div className='absolute bottom-0 right-0'>
              <Image
                src={ReputationBadge}
                className='w-10 h-10 md:w-12 md:h-12'
                alt={`The user has a reputation of ${reputation}`}
              />

              <p className='absolute top-[0.4rem] right-0 left-0 text-sm md:text-base font-bold leading-[140%] text-center'>
                {reputation}
              </p>
            </div>
          </div>

          {/* User info */}
          <div className='flex flex-col items-center sm:items-start justify-center sm:gap-2'>
            {/* Display name and verified badge */}
            <div className='flex flex-row items-center gap-2'>
              <p className='text-2xl sm:text-3xl leading-[160%] sm:leading-[120%] font-medium'>
                {verified ? displayName : `@${userIdHash}`}
              </p>

              {verified && (
                <Icon name='verifiedBadge' raw size={18} />
              )}
            </div>

            <p className='text-xs sm:text-base leading-[160%] text-grayMd'>
              {!verified ? `(${displayName} ???)` : `@${userIdHash}`}
            </p>
          </div>
        </div>

        {/* Verify User */}
        {!verified && selectedAccount && (
          <Button
            data-tooltip-id='globalTooltip'
            data-tooltip-content={tooltipMessage}
            isLoading={verifyUserMutation.isLoading}
            onClick={onVerifyClick}
            className='flex sm:hidden h-[2.375rem] w-24 !p-[0.418125rem] rounded-lg !bg-historic !border !border-stroke flex-row items-center justify-center gap-1'
          >
            <Image
              src={Badge.src}
              width={14}
              height={14}
              alt='Verify user'
            />
            <p className='text-[0.625rem] leading-[160%] font-medium text-body'>
              {isVerifiedByCurrentUser ? 'UnVerify' : 'Verify User'}
            </p>
          </Button>
        )}
      </div>

      {/* Extra buttons */}
      <div className='flex flex-row items-center gap-2'>
        {!verified && selectedAccount && (
          <Button
            data-tooltip-id='globalTooltip'
            data-tooltip-content={tooltipMessage}
            isLoading={verifyUserMutation.isLoading}
            onClick={onVerifyClick}
            className={`hidden sm:flex  h-[3.0625rem] !p-2 rounded-lg ${
              isVerifiedByCurrentUser
                ? ''
                : '!bg-historic !border border-stroke'
            } ${
              !canVerifyOthers ? 'cursor-not-allowed' : ''
            } flex-row items-center gap-2`}
          >
            <Icon
              name='verifyBtn'
              raw
              color={isVerifiedByCurrentUser ? '#ffffff' : '#5A6B74'}
            />
            <p
              className={`text-xs sm:text-sm leading-[160%] font-medium ${
                isVerifiedByCurrentUser ? '' : 'text-body'
              } `}
            >
              {isVerifiedByCurrentUser ? 'UnVerify' : 'Verify User'}
            </p>
          </Button>
        )}

        <Icon
          name='share2'
          className='rounded-lg !h-12 !w-12 !bg-historic border border-stroke !p-3 grid place-items-center'
          onClick={onShare}
          iconClassName='h-6 w-6'
          noHighlights
          noShadow
        />
      </div>
    </div>
  )
}

export default ProfilePageHeader
