import { GetServerSideProps } from 'next'
import http from 'services/http-common'
import { IPost } from 'types/interfaces'

// Note: This file only exists to provide redirections for older url schemes
// i.e. the posts that were shared on social media, etc.
export default function Post() {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async ({
  params
}) => {
  if (!params || !params.id || params.id.length !== 24) {
    return {
      notFound: true
    }
  }

  const { id } = params

  try {
    const response = await http.get(`/getPostID/${id}`)

    if (response.response?.data?.error) {
      throw response.response?.data?.error?.message
    }

    const post: IPost = response.data.data

    if (!post) {
      return {
        notFound: true
      }
    }

    const { postId, permalink } = post
    return {
      redirect: {
        permanent: true,
        destination: `/post/${postId}/${encodeURIComponent(
          permalink
        )}`
      }
    }
  } catch (error) {
    throw error
  }
}
