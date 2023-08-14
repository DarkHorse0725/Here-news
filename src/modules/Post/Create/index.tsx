import { useRouter } from 'next/router'
import React from 'react'
import { useQueryClient } from 'react-query'
import { useAppDispatch } from 'store/hooks'
import { resetEditor } from 'store/slices/editor.slice'
import PostForm from '../common/form'
import { deductBalance } from 'store/slices/auth.slice'
import { IPost } from 'types/interfaces'

function CreatePost() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const onAPICallSuccess = (data: IPost) => {
    // remove cache
    queryClient.invalidateQueries('getExplorePosts')
    queryClient.invalidateQueries('getTrendingPosts')
    queryClient.invalidateQueries('getSinglePost')

    dispatch(deductBalance(1))
    localStorage.removeItem('pickedFilesCount')
    dispatch(resetEditor())
    // redirect to post
    router.push(`/post/${data?.postId}/${data?.permalink}`)
  }

  return (
    <PostForm
      onAPICallSuccess={onAPICallSuccess}
      apiEndpoint='/createPost'
      actionLabel='Publish'
    />
  )
}

export default CreatePost
