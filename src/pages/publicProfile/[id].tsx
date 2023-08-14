import Layout from 'components/Layouts'
import PublicProfilePage from 'components/pages/publicProfile'
import { GetServerSideProps } from 'next'
import React from 'react'
import { QueryClient, dehydrate } from 'react-query'
import http from 'services/http-common'
import { IPublicUser } from 'types/interfaces'

interface Props {
  data: IPublicUser
  dehydratedState: any
}

export default function PublicProfile({
  data: { user, totalDownvotes, totalPosts, totalUpvotes }
}: Props) {
  return (
    <Layout
      type='home'
      pageTitle={`${
        user.verified ? user.displayName : user.userIdHash
      }'s Profile - Here News`}
      className='bg-baseWhite sm:bg-background !pt-0'
    >
      <PublicProfilePage
        user={user}
        totalDownvotes={totalDownvotes}
        totalPosts={totalPosts}
        totalUpvotes={totalUpvotes}
      />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params
}) => {
  if (!params || !params.id) {
    return {
      notFound: true
    }
  }

  const limit = 30
  const { id } = params

  try {
    const queryClient = new QueryClient()
    const response = await http.get(`/getPublicProfile/${id}`)
    const userData = response.data

    if (!userData || !userData?.success) {
      throw userData?.error?.message || 'Profile not found'
    }

    const getUserPosts = async (page: number) => {
      const response = await http.get(
        `/getPublicPosts/${id}?perPage=${limit}&page=${page}`
      )

      return {
        result: response.data.data
      }
    }

    await queryClient.prefetchInfiniteQuery({
      queryKey: `getPublicPosts/${id}`,
      queryFn: ({ pageParam = 1 }) => getUserPosts(pageParam),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage: number = allPages.length + 1
        return lastPage.result.length === limit ? nextPage : undefined
      }
    })

    return {
      props: {
        data: userData.data,
        dehydratedState: JSON.parse(
          JSON.stringify(dehydrate(queryClient))
        )
      }
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}
