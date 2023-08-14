import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import formatDistance from 'date-fns/formatDistance'
import { IPost } from 'types/interfaces'
import Typography from 'components/core/Typography'
import Icon from 'components/core/Icon'
import { getCardText, getContentFromText, sanitizeTitle } from 'utils'
import Image from 'next/image'
import ThreeDots from 'assets/ThreeDots.svg'
import useClickOutside from 'hooks/useClickOutside'
import { Button } from './Button'
import Bookmark from 'assets/dashboard/bookmark-active.svg'
import { useMutation, useQueryClient } from 'react-query'
import http from 'services/http-common'
import { useAppSelector } from 'store/hooks'
import { toast } from 'react-toastify'
import Tooltip from 'components/Tooltip'
import VotesCounter from 'components/SinglePost/VotesCounter'

interface IPostCard extends IPost {
  selectedFilter?: string
}

function PostCard({
  createdAt,
  userId,
  title: initialTitle,
  upvotes,
  downvotes,
  text,
  preview,
  tips,
  replies,
  type,
  postId,
  permalink,
  selectedFilter
}: IPostCard) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { selectedAccount } = useAppSelector(state => state.auth)
  const [postDropdownOpen, setPostDropdownOpen] =
    useState<boolean>(false)
  const { ref: dropdownRef } = useClickOutside({
    shouldRegister: postDropdownOpen,
    onOutsideClick: () => setPostDropdownOpen(false)
  })

  const title = useMemo(
    () =>
      sanitizeTitle(
        initialTitle ||
          preview?.title ||
          getContentFromText(text) ||
          '',
        false
      ),
    [initialTitle, text, preview]
  )

  const onClickCard = (e: any) => {
    if (
      !['dropdown-btn', 'delete-post-btn', 'intro-post-btn'].includes(
        e.target.id
      ) &&
      !['svg', 'path', 'img'].includes(e.target.localName)
    ) {
      router.push(`/post/${postId}/${permalink}`)
    }
  }

  const { mutate, isLoading } = useMutation(
    (data: { userId: string }) => {
      return http.post(`/bookMarkPost/${postId}`, data)
    },
    {
      onSuccess: _data => {
        queryClient.invalidateQueries('getBookmarks')
      },
      onError: () => {
        toast.error('There was some error book post!')
      }
    }
  )

  const onClickBookmarkIcon = (e: any) => {
    e.stopPropagation()
    if (selectedAccount?._id)
      mutate({
        userId: selectedAccount._id
      })
  }

  const deletePostMutation = useMutation(
    () => {
      return http.delete(`/deletePost/${postId}`)
    },
    {
      onSuccess: () => {
        toast.success('Post has been deleted!')
        queryClient.invalidateQueries(selectedFilter)
      },
      onError: () => {
        toast.error('There was some error deleting post!')
      }
    }
  )

  const deletePost = () => {
    deletePostMutation.mutate()
  }

  const introductoryPostMutation = useMutation(
    (data: any) => {
      return http.put(`/introductoryPost`, data)
    },
    {
      onSuccess: () => {
        toast.success('Introductory post added!')
        queryClient.invalidateQueries(selectedFilter)
        queryClient.refetchQueries(['getUser', 1], {
          active: true,
          exact: true
        })
      },
      onError: () => {
        toast.error('There was some error!')
      }
    }
  )

  const introductoryPost = () => {
    introductoryPostMutation.mutate({ postId })
  }

  const cardText = useMemo(
    () => getCardText(title, text, preview),
    [title, text, preview]
  )

  return (
    <div
      onClick={(e: any) => {
        onClickCard(e)
      }}
      className={`flex flex-row items-center justify-between px-2 md:px-[30px] py-4 bg-baseWhite border-[1px] border-stroke rounded-lg gap-2 cursor-pointer`}
    >
      <div className='flex flex-col gap-2'>
        <Typography
          type='subtitle'
          className={`!text-base md:!text-[20px] text-body font-medium leading-5 md:leading-7 text-ellipsis break-words truncate max-w-[20ch] md:max-w-[40ch] xl:max-w-[70ch]`}
        >
          {cardText.title}
        </Typography>

        <div className='flex flex-row items-center gap-2'>
          {/* Comments */}
          <Icon
            name='comment'
            size={24}
            className='text-grayLight'
            raw
          />
          <Typography
            type='button'
            className='text-grayMd text-sm md:text-base !leading-[19px] font-medium'
          >
            {replies?.length}
          </Typography>

          {/* Seperator */}
          <div className='w-[0.3rem] h-[0.3rem] rounded-full bg-grayMd' />

          <VotesCounter
            postId={postId}
            posterID={userId._id}
            tips={tips}
            upvotes={upvotes}
            downvotes={downvotes}
            isTicket
          />

          {/* Separator */}
          <div className='w-[0.3rem] h-[0.3rem] rounded-full bg-grayMd' />

          {/* User Display name */}
          <Typography
            type='link'
            className='text-sm md:!text-base font-medium no-underline text-primary !leading-[19px]'
          >
            @
            {userId?.verified
              ? userId?.displayName
              : userId?.userIdHash}
          </Typography>

          {/* Separator */}
          <div className='hidden mobile:block w-[0.3rem] h-[0.3rem] rounded-full bg-grayMd' />

          {/* Time difference */}
          <Typography
            type='body'
            className='hidden mobile:flex items-center text-grayMd font-medium text-sm md:text-base !leading-[19px]'
          >
            {formatDistance(new Date(createdAt), new Date(), {
              addSuffix: true
            })}
          </Typography>
        </div>
      </div>
      {type === 'posts' ? (
        <div
          id='dropdown-btn'
          ref={dropdownRef}
          className='relative h-8 w-8 md:h-12 md:w-12 grid place-items-center bg-here-gray-50 rounded-[4px] md:rounded-[8px] border-[1px] border-[#E6E6E6] cursor-pointer'
          onClick={() => setPostDropdownOpen(!postDropdownOpen)}
        >
          <Image
            src={ThreeDots}
            alt='icon'
            height={16}
            width={4}
            className='w-[3px] h-[12px] md:h-[16px] md:w-[4px]'
          />
          {postDropdownOpen ? (
            <div
              className={`w-[241px] absolute z-10 top-10 md:top-12 right-0 divide-y-[1px] divide-[#e6e6e6] bg-white rounded-[8px] shadow-md`}
            >
              {selectedAccount?.verified &&
              selectedAccount?.introductoryPost !== postId ? (
                <button
                  id='intro-post-btn'
                  className={`w-full text-base font-[500] leading-[120%] text-gray5 bg-white h-12 md:h-16 rounded-[8px_8px_0_0] px-4 hover:bg-background py-2`}
                  onClick={introductoryPost}
                >
                  Make it Introductory Post
                </button>
              ) : null}
              <button
                id='delete-post-btn'
                className={`w-full text-base font-[500] leading-[120%] text-gray5 bg-white h-12 md:h-16 rounded-[0_0_8px_8px] px-4 hover:bg-background py-2`}
                onClick={deletePost}
              >
                Delete This Post
              </button>
            </div>
          ) : null}
        </div>
      ) : type === 'bookmark' ? (
        <Tooltip id='bookmarkPostBtn' message='Remove bookmark'>
          <Button
            icon={Bookmark}
            className={`!h-10 md:!h-12 w-10 md:!w-12 pl-1 !bg-historic ${
              isLoading ? 'cursor-not-allowed' : ''
            }`}
            onClick={onClickBookmarkIcon}
          />
        </Tooltip>
      ) : null}
    </div>
  )
}

export { PostCard }
