import Icon from 'components/core/Icon'
import Link from 'next/link'
import React from 'react'

interface IActivitiesItemProps {
  name: string
  title: string
  icon: any
  desc: string
  isLink?: boolean
  href?: any
}

const ActivitiesItem = ({
  name,
  title,
  icon,
  desc,
  isLink,
  href
}: IActivitiesItemProps) => (
  <div
    className='w-[9.875rem] flex flex-col gap-3 justify-between items-start p-2 rounded-[0.625rem] bg-historic'
    style={{
      boxShadow:
        '0px 2.6701173782348633px 8.01035213470459px 0px rgba(0, 0, 0, 0.10)'
    }}
  >
    <div className='w-full flex flex-row items-center justify-between'>
      {isLink ? (
        <Link
          href={href}
          className='text-sm leading-[140%] font-[400] text-primary no-underline'
        >
          {name}
        </Link>
      ) : (
        <p className='text-sm leading-[140%] font-[400] text-primary'>
          {name}
        </p>
      )}

      <Icon raw name={icon} size={20} />
    </div>
    <div className='w-full flex flex-col gap-1'>
      <p className='text-[30px] font-medium text-primary leading-[120%]'>
        {title}
      </p>
      <hr className='bg-[#D8D8D8] w-ful' />
      <p className='text-[10px] font-[400] leading-[160%] italic text-grayMd'>
        {desc}
      </p>
    </div>
  </div>
)

export { ActivitiesItem }
