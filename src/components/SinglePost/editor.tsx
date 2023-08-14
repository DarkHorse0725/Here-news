import Tooltip from 'components/Tooltip'
import Button from 'components/core/Button'
import PostForm from 'modules/Post/common/form'
import { useRouter } from 'next/router'
import React, { useCallback, useState } from 'react'
import { QueryClient } from 'react-query'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  deductBalance,
  toggleIsLoginModalVisible
} from 'store/slices/auth.slice'
import { IPost } from 'types/interfaces'

interface Props {
  postId: string
}

const ReplyEditor = ({ postId }: Props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const selectedAccount = useAppSelector(
    state => state.auth.selectedAccount?._id
  )

  const queryClient = new QueryClient()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const focusInput = useCallback(() => {
    setIsFocused(true)
  }, [])

  const openLoginModal = useCallback(() => {
    dispatch(toggleIsLoginModalVisible(true))
  }, [dispatch])

  const onReplyAdded = (data?: IPost) => {
    dispatch(deductBalance(1))
    queryClient.invalidateQueries(`getSinglePost/${postId}`)
    queryClient.invalidateQueries(`getReplies/${postId}`)
    router.push(`/post/${data?.postId}/${data?.permalink}`)
    setIsFocused(false)
  }

  return (
    <div className='ml-0 sm:ml-[4.25rem] mb-4 px-4 sm:p-4 bg-baseWhite sm:border border-stroke rounded-b-lg'>
      {selectedAccount ? (
        !isFocused ? (
          <div className='flex w-full flex-row items-stretch gap-1 sm:gap-4'>
            <div
              className='cursor-text text-grayMd flex-1 text-xs sm:text-base italic tracking-medium font-light leading-[1.4rem] h-full py-2 pl-2 sm:py-3 sm:px-4 bg-historic border border-stroke rounded-lg'
              onClick={focusInput}
            >
              Write your words
            </div>
            <Tooltip
              id='replyButton'
              message='Reply to the post'
              className='self-stretch'
            >
              <Button
                className='grid h-full !mb-0 place-items-center tracking-medium font-medium !leading-[1.2rem] !text-xs sm:!text-base bg-primary !border-none'
                type='button'
                onClick={() => setIsFocused(true)}
              >
                Reply
              </Button>
            </Tooltip>
          </div>
        ) : (
          <PostForm
            apiEndpoint={`/createPostReply/${postId}`}
            onAPICallSuccess={onReplyAdded}
            actionLabel='Reply'
          />
        )
      ) : (
        <p className='text-xs sm:text-base pl-2 py-2'>
          Please{' '}
          <span
            className='text-primary underline cursor-pointer'
            onClick={e => {
              e.stopPropagation()
              openLoginModal()
            }}
          >
            log in
          </span>{' '}
          to join the conversation
        </p>
      )}
    </div>
  )
}

export default ReplyEditor
