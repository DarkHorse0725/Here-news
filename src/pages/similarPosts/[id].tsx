import axios from 'axios'
import Layout from 'components/Layouts'
import SimilarPostsPage from 'components/pages/similarPosts'
import { SearchOrderBy, SearchSort } from 'const'
import { GetServerSideProps } from 'next'
import React from 'react'
import { QueryClient, dehydrate } from 'react-query'

export default function SimilarPosts() {
  return (
    <Layout type='home' pageTitle='Similar Posts' className='!pt-0'>
      <SimilarPostsPage />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<{}> = async ({
  query,
  params
}) => {
  if (!params || !params.id || typeof params.id !== 'string') {
    return {
      notFound: true
    }
  }

  const { id } = params
  const { sort, orderBy } = query

  if (
    sort &&
    (typeof sort !== 'string' ||
      !Object.keys(SearchSort).includes(sort))
  ) {
    throw 'Invalid sort value provided'
  } else if (
    orderBy &&
    (typeof orderBy !== 'string' ||
      !Object.keys(SearchOrderBy).includes(orderBy))
  ) {
    throw 'Invalid orderBy provided'
  }

  const queryClient = new QueryClient()
  const limit = 30

  try {
    const fetchPosts = async (page: number) => {
      const response = await axios.post(
        'https://us-central1-phonic-jetty-356702.cloudfunctions.net/getSimilarPosts',
        {
          post_id: id,
          step: limit,
          offset: page,
          orderBy: orderBy ? SearchOrderBy[orderBy] : undefined,
          sort: sort ? SearchSort[sort] : undefined
        }
      )

      return {
        result: response.data
      }
    }

    await queryClient.prefetchInfiniteQuery({
      queryKey: `similarPosts: ${id}`,
      queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage: number = allPages.length + 1
        return lastPage.result.length === limit ? nextPage : undefined
      }
    })

    return {
      props: {
        dehydratedState: JSON.parse(
          JSON.stringify(dehydrate(queryClient))
        )
      }
    }
  } catch (e) {
    return {
      notFound: true
    }
  }
}
