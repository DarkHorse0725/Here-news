import React from 'react'
import { useQuery } from 'react-query'
import { IPost, IUser } from 'types/interfaces'
import SinglePost from 'components/SinglePost/SinglePost'
import http from 'services/http-common'
import { BiLoader } from 'react-icons/bi'
import MiniPost from './MiniPost'
import Replies from './Replies'
import { useRouter } from 'next/router'

interface Props {
  latestCommentors: IUser[]
}

const PostPage = ({ latestCommentors }: Props) => {
  const { query } = useRouter()
  const { id } = query

  const getPostData = async () => {
    const response = await http.get(`/getSinglePost/${id}`)

    return {
      data: response.data.data
    }
  }

  const { isLoading, data } = useQuery({
    queryKey: ['getSinglePost', `getSinglePost/${id}`],
    queryFn: getPostData
  })

  const post = data?.data as IPost

  if (!post) {
    return <p>No data found</p>
  } else if (isLoading) {
    return <BiLoader />
  }

  return (
    <>
      {post.repliedTo && <MiniPost {...post.repliedTo} />}

      <div
        className={`w-full px-2 max-w-[57.75rem] ${
          post.repliedTo ? 'mt-[3.125rem]' : 'mt-4'
        }`}
      >
        <div className='flex flex-col items-stretch w-full bg-baseWhite sm:bg-transparent'>
          <SinglePost
            {...post}
            commentors={latestCommentors}
            focused={true}
          />

          <Replies postId={id as string} />
        </div>
      </div>
    </>
  )
}

export default PostPage
