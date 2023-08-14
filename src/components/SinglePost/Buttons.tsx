import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'components/core/Icon'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import http from 'services/http-common'
import Tooltip from 'components/Tooltip'
import { IPost, IUser } from 'types/interfaces'
import CommentButton from './CommentButton'
import OptionsButton from './OptionsButton'
import Button from 'components/core/Button'
import { showShareModal } from 'store/slices/app.slice'

interface Props {
  post: IPost
  commentors: IUser[]
}

function Buttons({ post, commentors }: Props) {
  const { _id, bookMarks, postId, replies } = post

  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const { selectedAccount } = useAppSelector(state => state.auth)
  const [bookmark, setBookmark] = useState(false)

  useEffect(() => {
    if (
      bookMarks?.length &&
      selectedAccount?._id &&
      selectedAccount?._id &&
      bookMarks.includes(selectedAccount?._id)
    ) {
      setBookmark(true)
    }
  }, [bookMarks, selectedAccount])

  const { mutate, isLoading } = useMutation(
    (data: { userId: string }) => {
      return http.post(`/bookMarkPost/${postId}`, data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('getSinglePost')
        queryClient.invalidateQueries('getReplies')
        queryClient.invalidateQueries('getTrendingPosts')
        queryClient.invalidateQueries('getAllPostsByTopic')
      },
      onError: () => {
        toast.error('There was some error book post!')
      }
    }
  )

  const bookMarkPost = useCallback(() => {
    setBookmark(!bookmark)
    if (selectedAccount?._id)
      mutate({
        userId: selectedAccount._id
      })
  }, [mutate, bookmark, selectedAccount])

  const onShare = useCallback(() => {
    dispatch(showShareModal(`${window.location.origin}/post/${_id}`))
  }, [dispatch, _id])

  return (
    <div className='flex flex-row justify-between items-center pt-2 pb-4 sm:pb-6 px-4 bg-baseWhite ml-0 sm:ml-[4.25rem] sm:border !border-t-0 border-stroke'>
      {/* Comment button */}
      <CommentButton
        commentors={commentors}
        totalComments={replies?.length}
      />

      {/* Small Screen Right Buttons */}
      <div className='flex flex-row gap-1 sm:hidden items-center'>
        {/* Similar posts button */}
        <Tooltip
          id='similarPostsButton'
          message='Check out posts similar to this one'
        >
          <Button
            href={`/similarPosts/${postId}`}
            leftIcon='smallTelescope'
            className='text-grayMedium rounded-lg !p-1 sm:!p-3 bg-transparent !border-none'
          />
        </Tooltip>

        {/* Chart button */}
        <Tooltip id='chartButton' message='Coming soon'>
          <Icon
            name='smallChart'
            className='text-grayMedium rounded-lg !p-1 sm:!p-3'
            noShadow
            onClick={e => {
              e.stopPropagation()
            }}
          />
        </Tooltip>

        {/* Share button */}
        <Tooltip
          id='shareButton'
          message='Share this post with your friends and family'
        >
          <div
            className='p-1 sm:p-3 text-grayMedium rounded-lg cursor-pointer'
            onClick={onShare}
          >
            <Icon name='smallShare' raw />
          </div>
        </Tooltip>

        {/* Bookmark button */}
        <Tooltip id='bookmarkButton' message='Bookmark this post'>
          <Icon
            name={bookmark ? 'bookmark' : 'outlineBookMark'}
            className={`text-grayMedium rounded-lg !p-1 sm:!p-3 ${
              isLoading ? 'pointer-events-none' : ''
            }`}
            noShadow
            size={16}
            onClick={bookMarkPost}
          />
        </Tooltip>

        {/* Options */}
        <OptionsButton post={post} />
      </div>

      {/* Large screen right Buttons */}
      <div className='hidden sm:flex flex-row gap-1 flex-wrap'>
        {/* Similar posts button */}
        <Tooltip
          id='similarPostsButton'
          message='Check out posts similar to this one'
        >
          <Button
            href={`/similarPosts/${postId}`}
            leftIcon='telescope'
            className='text-grayMedium rounded-lg !p-3 bg-transparent !border-none'
          />
        </Tooltip>

        {/* Chart button */}
        <Tooltip id='chartButton' message='Coming soon'>
          <Icon
            name='chart'
            className='text-grayMedium rounded-lg !p-3'
            noShadow
            onClick={e => {
              e.stopPropagation()
            }}
          />
        </Tooltip>

        {/* Share button */}
        <Tooltip
          id='shareButton'
          message='Share this post with your friends and family'
        >
          <div
            className='p-3 text-grayMedium rounded-lg cursor-pointer'
            onClick={onShare}
          >
            <Icon name='share2' size={24} raw />
          </div>
        </Tooltip>

        {/* Bookmark button */}
        <Tooltip
          id='bookmarkButton'
          message={
            bookmark ? 'Remove bookmark' : 'Bookmark this post'
          }
        >
          <Icon
            name={bookmark ? 'bookmark' : 'outlineBookMark'}
            className={`text-grayMedium rounded-lg !p-3 ${
              isLoading ? 'pointer-events-none' : ''
            }`}
            noShadow
            onClick={bookMarkPost}
          />
        </Tooltip>

        {/* Options */}
        <OptionsButton post={post} />
      </div>
    </div>
  )
}

export default Buttons
