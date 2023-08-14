import axios from 'axios'
import Layout from 'components/Layouts'
import SearchPage from 'components/pages/search'
import { SearchOrderBy, SearchSort } from 'const'
import { GetServerSideProps } from 'next'
import React from 'react'
import { QueryClient, dehydrate } from 'react-query'

export default function Search() {
  return (
    <Layout type='home' pageTitle='Search Page' className='!pt-0'>
      <SearchPage />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<{}> = async ({
  query
}) => {
  const { q: searchQuery, sort, orderBy } = query

  if (!searchQuery || typeof searchQuery !== 'string') {
    throw 'No search query provided'
  } else if (
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

  const fetchSearchResults = async (page: number) => {
    const response = await axios.post(
      'https://us-central1-phonic-jetty-356702.cloudfunctions.net/getSearchQuery',
      {
        search: searchQuery,
        step: limit,
        offset: page,
        orderBy: orderBy ? SearchOrderBy[orderBy] : undefined,
        sort: sort ? SearchSort[sort] : undefined
      }
    )

    return {
      result: response.data.result
    }
  }

  await queryClient.prefetchInfiniteQuery({
    queryKey: `searchResults: ${searchQuery}`,
    queryFn: ({ pageParam = 0 }) => fetchSearchResults(pageParam),
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
