import React from 'react'
import Link from 'next/link'
import { IconType } from 'react-icons'

interface ISocial {
  name: string
  link: string
  Icon: IconType
}
function Social({ name, link, Icon }: ISocial) {
  return (
    <Link
      passHref={true}
      href={link}
      key={link}
      target='_blank'
      rel='noreferrer'
      aria-label='here.news Email'
    >
      <Icon className='w-4 h-4 md:w-6 md:h-6 text-landing-black_6' />
    </Link>
  )
}

export default Social
