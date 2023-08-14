import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import http from 'services/http-common'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { showEditorModal } from 'store/slices/editor.slice'
import { MdDelete } from 'react-icons/md'
import { BiEdit } from 'react-icons/bi'
import Popover from 'components/Popover'
import Icon from 'components/core/Icon'
import { IPost } from 'types/interfaces'
import Tooltip from 'components/Tooltip'

interface Props {
  post: IPost
}

const OptionsButton = ({ post }: Props) => {
  const {
    userId: { _id: userId },
    repliedTo,
    postId
  } = post

  const router = useRouter()

  const dispatch = useAppDispatch()
  const selectedAccount = useAppSelector(
    state => state.auth.selectedAccount?._id
  )

  // TODO: update this logic
  const isEditAllowed = useMemo(
    () => selectedAccount === userId,
    [selectedAccount, userId]
  )

  const isDeleteAllowed = useMemo(
    () => selectedAccount === userId,
    [selectedAccount, userId]
  )

  const shouldRenderMenu = useMemo(
    () => isEditAllowed || isDeleteAllowed,
    [isEditAllowed, isDeleteAllowed]
  )

  const { isLoading, mutate } = useMutation(
    () => {
      return http.delete(`/deletePost/${postId}`)
    },
    {
      onSuccess: () => {
        toast.success('Successfully deleted post!')

        router.push(
          router.query.id && router.query.id !== postId
            ? `/post/${router.query.id}/${router.query.permalink}`
            : repliedTo?.postId
            ? `/post/${repliedTo.postId}/${repliedTo.permalink}`
            : '/'
        )
      },
      onError: () => {
        toast.error('There was some error deleting post!')
      }
    }
  )

  const editPost = () => {
    dispatch(showEditorModal(post))
  }

  const deletePost = () => {
    mutate()
  }

  return shouldRenderMenu ? (
    <Popover>
      <Tooltip id='optionsButton' message='Edit or delete this post'>
        <Icon
          name='dots'
          className='rotate-90 !p-1 sm:!p-3'
          noShadow
        />
      </Tooltip>

      {() => (
        <div className='z-[1] bg-white shadow-lg min-w-[7.5rem] absolute bottom-0 right-4 rounded-lg py-2'>
          {isEditAllowed && (
            <div
              className='px-2 flex items-center hover:bg-slate-100 active:bg-slate-200'
              onClick={editPost}
            >
              <BiEdit className='text-lg' />
              <p className='text-sm px-2 py-3 cursor-pointer'>Edit</p>
            </div>
          )}

          {isDeleteAllowed && (
            <div
              className={`px-2 flex items-center ${
                isLoading ? 'text-red-200' : 'text-red-600'
              } hover:bg-slate-100 active:bg-slate-200`}
              onClick={() => (isLoading ? {} : deletePost())}
            >
              <MdDelete className='text-lg' />
              <p className='text-sm px-2 py-3 cursor-pointer'>
                Delete
              </p>
            </div>
          )}
        </div>
      )}
    </Popover>
  ) : (
    <></>
  )
}

export default OptionsButton
