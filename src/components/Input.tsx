import React, { useState } from 'react'
import Icon, { IconsType } from './core/Icon'
import Typography from './core/Typography'

interface InputProps {
  label?: string
  icon?: IconsType
  iconSize?: number
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  onKeyUp?: () => void
  type: string
  placeholder: string
  className?: string
  inputClassName?: string
  iconClassName?: string
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
}

function Input({
  label,
  icon,
  iconSize,
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyUp,
  type,
  placeholder,
  className,
  inputClassName,
  inputProps,
  iconClassName
}: InputProps) {
  const [isPassVisible, setIsPassVisible] = useState(false)
  const togglePassVisible = () => setIsPassVisible(prev => !prev)
  return (
    <div className={className}>
      {label && (
        <Typography
          type='button'
          className='text-landing-black_7 mb-4 font-medium'
        >
          {label}
        </Typography>
      )}
      <div className='relative'>
        {icon && (
          <div className='absolute top-0 left-4 h-full row items-center'>
            <Icon
              name={icon}
              size={iconSize}
              raw
              className='text-landing-gray_10'
            />
          </div>
        )}
        <input
          className={`${
            icon ? 'pl-12' : ''
          } border-[1px] outline-none border-slate-300 p-2 rounded-md text-sm w-full ${
            inputClassName ? inputClassName : ''
          }`}
          type={isPassVisible ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => onFocus && onFocus()}
          onBlur={() => onBlur && onBlur()}
          onKeyUp={e => onKeyUp && onKeyUp()}
          {...inputProps}
        />

        {type === 'password' && (
          <div
            className='absolute top-0 right-4 h-full row items-center'
            onClick={togglePassVisible}
          >
            <Icon
              name={isPassVisible ? 'eyeOpen' : 'eyeClose'}
              size={24}
              raw
              className={`text-landing-gray_11 ${iconClassName}`}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Input
