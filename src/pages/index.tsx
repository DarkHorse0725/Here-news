import Layout from 'components/Layouts'
import Trending from 'components/pages/home/Trending'
import { GetServerSideProps } from 'next'
import React from 'react'
import { QueryClient, dehydrate } from 'react-query'
import http from 'services/http-common'

function Home() {
  return (
    <Layout pageTitle='POC - Here News' type='home'>
      <Trending />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<{}> = async ({
  req,
  resolvedUrl
}) => {
  const metaTags = {
    'og:title': 'Here.news - A new era of news platform',
    'og:description':
      'Here.news is a user-driven news platform where users share, vote and discuss news stories and earn from contributions. Join us and be part of a democratic news ecosystem.!',
    'og:image':
      'https://storage.googleapis.com/artifacts.phonic-jetty-356702.appspot.com/static/meta-thumbnail.png',
    'og:url': `${req.headers.host}${resolvedUrl}`
  }

  const queryClient = new QueryClient()
  const limit = 30

  const fetchTrendingPosts = async (page: number) => {
    const response = await http.get(
      `/getTrendingPosts?per_page=${limit}&page=${page}`
    )
    return {
      result: response.data.data
    }
  }

  await queryClient.prefetchInfiniteQuery({
    queryKey: 'getTrendingPosts',
    queryFn: ({ pageParam = 1 }) => fetchTrendingPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage: number = allPages.length + 1
      return lastPage.result.length === limit ? nextPage : undefined
    }
  })

  return {
    props: {
      metaTags,
      dehydratedState: JSON.parse(
        JSON.stringify(dehydrate(queryClient))
      )
    }
  }
}

export default Home
