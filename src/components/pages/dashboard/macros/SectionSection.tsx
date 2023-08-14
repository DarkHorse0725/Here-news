import Typography from 'components/core/Typography'
import React, { PropsWithChildren } from 'react'

interface Props {
  title: string
  subtitle: string
  className?: string

  // TODO: Remove this when the sections are available
  isAvailable?: boolean
}

const SettingSection = ({
  title,
  subtitle,
  className = '',
  isAvailable = true,
  children
}: PropsWithChildren<Props>) => (
  <div
    className={`flex bg-baseWhite rounded-lg border-stroke py-2 md:py-4 px-2 md:px-4 lg:px-[30px] flex-col md:flex-row md:justify-between gap-2 items-start ${className}`}
  >
    {/* Title and subtitle */}
    <div className='flex flex-col gap-2 w-full max-w-[23rem]'>
      <Typography
        type='subtitle-small'
        className={`text-base md:!text-xl font-medium ${
          isAvailable ? 'text-grayMedium' : 'text-grayL'
        }`}
      >
        {title}
      </Typography>

      <Typography
        type='small'
        className={`text-xs md:!text-sm font-[400] leading-[1rem] md:!leading-[1.4rem] ${
          isAvailable ? 'text-body' : 'text-grayL'
        }`}
      >
        {subtitle}
      </Typography>
    </div>

    {/* Right section */}
    <div className='flex flex-col gap-4 w-full h-full max-w-[36.8125rem]'>
      {children}
    </div>
  </div>
)

export { SettingSection }
