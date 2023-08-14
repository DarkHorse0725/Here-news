import React from 'react'
import Link from 'next/link'
import Icon from 'components/core/Icon'

const Dropdown = ({ options, width, className }: any) => {
  return (
    <div
      className={`absolute top-10 md:top-12 right-0 ${
        width ? width : 'w-[218px]'
      }  divide-y-[1px] divide-[#e6e6e6] bg-white rounded-[8px] shadow-md ${className}`}
    >
      {options.map((item: any, i: number) => (
        <Link
          href={item.route}
          key={i}
          className={`w-full flex items-center px-4 bg-white hover:bg-background py-2 gap-2 h-16 cursor-pointer no-underline ${
            i === 0
              ? 'rounded-[8px_8px_0_0]'
              : i === options.length - 1
              ? 'rounded-[0_0_8px_8px]'
              : ''
          }`}
        >
          <>
            {item?.icon ? (
              <Icon raw name={item.icon} size={24} color='#667085' />
            ) : null}
            <p
              className={`text-base font-[500] leading-[120%] text-grayMedium`}
            >
              {item.name}
            </p>
          </>
        </Link>
      ))}
    </div>
  )
}

export { Dropdown }
