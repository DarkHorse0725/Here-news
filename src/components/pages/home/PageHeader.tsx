import React from 'react'

const pages = [
  {
    name: 'Trending',
    value: 'trending'
  },
  {
    name: 'Explore',
    value: 'explore'
  }
]

interface PageHeaderProps {
  activePage: string
  changeActivePage: (page: string) => void
}

function PageHeader({
  activePage,
  changeActivePage
}: PageHeaderProps) {
  return (
    <div className='mb-2 h-12'>
      <header className='flex z-[2] items-center justify-center p-0 fixed left-0 right-0 top-0 h-12 my-12'>
        <div
          className='grid h-full max-w-[40rem]'
          style={{
            flex: '1 1 0%'
          }}
        >
          <div className='bg-white flex justify-evenly items-center'>
            {pages.map(page => {
              return (
                <button
                  key={page.value}
                  className={`${
                    activePage === page.value
                      ? 'border-b-2 border-blue-600 border-[inset]'
                      : 'cursor-pointer hover:border-b-2 hover:border-blue-600 hover:border-opacity-50'
                  } flex items-center justify-center flex-1 h-full`}
                  onClick={() =>
                    activePage !== page.value
                      ? changeActivePage(page.value)
                      : {}
                  }
                >
                  <b
                    className={`text-sm font-semibold ${
                      activePage === page.value
                        ? 'text-blue-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {page.name}
                  </b>
                </button>
              )
            })}
          </div>
        </div>
      </header>
    </div>
  )
}

export default PageHeader
