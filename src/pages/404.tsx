import Layout from 'components/Layouts'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Custom404 = () => {
  const router = useRouter()

  return (
    <Layout pageTitle='404 Not Found' type='home'>
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold mb-4'>404 - Not Found</h1>
        <p className='text-lg mb-4'>
          {router.asPath.startsWith('/post')
            ? 'Post not found. Seems like it was deleted by the owner.'
            : 'The page you are looking for does not exist.'}
        </p>
        <Link href='/'>
          <p className='text-primary hover:underline'>
            Go back to the homepage
          </p>
        </Link>
      </div>
    </Layout>
  )
}

export default Custom404
