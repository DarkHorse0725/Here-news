import React from 'react'

const FiltersDropdown = ({ options }: any) => {
  return (
    <div
      className={`absolute top-10 md:top-12 w-[126px] right-0 divide-y-[1px] divide-[#e6e6e6] bg-white rounded-[8px] shadow-md`}
    >
      {options.map((item: any, i: number) => (
        <button
          key={i}
          className={`w-full flex items-center px-4 bg-white hover:bg-background py-2 gap-2 h-16 text-base font-[500] leading-[120%] text-gray5 ${
            i === 0
              ? 'rounded-[8px_8px_0_0]'
              : i === 1
              ? 'rounded-[0_0_8px_8px]'
              : ''
          }`}
          onClick={item.onClick}
        >
          {item.name}
        </button>
      ))}
    </div>
  )
}

export { FiltersDropdown }
