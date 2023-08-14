import Layout from 'components/Layouts'
import Explore from 'components/pages/home/Explore'
import { GetServerSideProps } from 'next'
import React from 'react'
import { QueryClient, dehydrate } from 'react-query'
import http from 'services/http-common'

export default function explore() {
  return (
    <Layout
      pageTitle='Explore - Here News'
      type='home'
      className='!pt-0'
    >
      <Explore />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<{}> =
  async () => {
    const queryClient = new QueryClient()
    const limit = 30

    const fetchExplorePosts = async (page: number) => {
      const response = await http.get(
        `/getExplorePosts?per_page=${limit}&page=${page}`
      )
      return {
        result: response.data.data
      }
    }

    await queryClient.prefetchInfiniteQuery({
      queryKey: 'getExplorePosts',
      queryFn: ({ pageParam = 1 }) => fetchExplorePosts(pageParam),
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
  }
