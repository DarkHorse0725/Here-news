import Typography from 'components/core/Typography'
import React, { PropsWithChildren } from 'react'

interface Props {
  title: string
  subtitle?: string
  className?: string

  // TODO: Remove this when the sections are available
  isAvailable?: boolean
}

const SettingSubSection = ({
  title,
  subtitle,
  className = '',
  isAvailable = true,
  children
}: PropsWithChildren<Props>) => (
  <div
    className={`flex flex-row justify-between items-center ${className}`}
  >
    {/* Title and subtitle */}
    <div className='flex flex-col gap-2'>
      <Typography
        type='button'
        className={`font-medium text-sm md:!text-base !leading-[1.2rem] tracking-medium ${
          isAvailable ? 'text-body' : 'text-grayL'
        }`}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          type='small'
          className={`text-xs md:!text-sm font-[400] leading-[1rem] md:!leading-[1.4rem] text-grayLight ${
            isAvailable ? 'text-body' : 'text-grayL'
          }`}
        >
          {subtitle}
        </Typography>
      )}
    </div>

    {/* Right section */}
    {children}
  </div>
)

export { SettingSubSection }
