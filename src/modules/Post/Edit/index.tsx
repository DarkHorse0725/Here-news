import { useRouter } from 'next/router'
import React from 'react'
import { useQueryClient } from 'react-query'
import { IPost } from 'types/interfaces'
import PostForm from '../common/form'
import { useAppDispatch } from 'store/hooks'
import { resetEditor } from 'store/slices/editor.slice'
import { deductBalance } from 'store/slices/auth.slice'

interface EditPostProps extends IPost {
  handleCloseModal?: () => void
}

function EditPost({
  postId,
  preview,
  text,
  title,
  permalink
}: EditPostProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const onAPICallSuccess = (data: any) => {
    // remove cache
    queryClient.invalidateQueries('getExplorePosts')
    queryClient.invalidateQueries('getTrendingPosts')
    queryClient.invalidateQueries('getSinglePost')

    dispatch(deductBalance(1))
    localStorage.removeItem('pickedFilesCount')
    dispatch(resetEditor())

    // redirect to post
    router.push(`/post/${postId}/${permalink}`)
  }

  return (
    <PostForm
      postId={postId}
      previewData={preview}
      initialValues={{
        content: text,
        title
      }}
      onAPICallSuccess={onAPICallSuccess}
      apiEndpoint={`/editPost/${postId}`}
    />
  )
}

export default EditPost
