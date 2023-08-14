import Image from 'next/image'
import { ChangeEventHandler, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import Icon from '../core/Icon'

interface IInput {
  id?: string
  name?: string
  value?: any
  className?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  hookToForm: boolean
  type: 'text' | 'password' | 'url'
  clasNameError?: string
  leftIcon?: any
  rightIcon?: any
  disabled?: boolean
}

function Input({
  id,
  name,
  value,
  type = 'text',
  placeholder,
  hookToForm,
  onChange,
  className,
  clasNameError,
  disabled,
  leftIcon,
  rightIcon
}: IInput) {
  const formContext = useFormContext()
  const isFullyHooked = name && hookToForm && formContext

  const fieldError =
    isFullyHooked && formContext?.formState?.errors?.[name]
  const [isPassVisible, setIsPassVisible] = useState(false)
  const togglePassVisible = () => setIsPassVisible(prev => !prev)

  useEffect(() => {
    if (name && hookToForm) {
      formContext.setValue(name, value)
    }
  }, [value, name, formContext, hookToForm])

  return (
    <label
      {...(id && { htmlFor: id })}
      className={'text-sm w-full h-full'}
    >
      <div className='relative flex items-stretch border-stroke bg-historic border-[1px] rounded-md '>
        {leftIcon && (
          <div className='absolute left-3 top-[50%] translate-y-[-50%]'>
            <Image
              alt='lefticon'
              src={leftIcon}
              className='h-4 lg:h-6 w-4 lg:w-6'
            />
          </div>
        )}

        {rightIcon && (
          <div className=' absolute right-3 top-[25%]'>
            <Image
              alt='righticon'
              src={rightIcon}
              className='h-4 lg:h-6 w-4 lg:w-6'
            />
          </div>
        )}

        {type === 'password' && (
          <div
            className='absolute top-0 right-4 h-full row items-center'
            onClick={togglePassVisible}
          >
            <Icon
              name={isPassVisible ? 'eyeClose' : 'eyeOpen'}
              size={24}
              raw
              className='h-4 lg:h-6 w-4 lg:w-6 text-landing-gray_11'
            />
          </div>
        )}

        <input
          {...(id && { id: id })}
          type={isPassVisible ? 'text' : type}
          value={value}
          placeholder={placeholder}
          className={`
        w-full p-2 border-[1px] border-slate-300 ${
          leftIcon ? 'px-10' : ''
        }
        ${className ? className : ''} ${
            hookToForm && fieldError && fieldError?.message
              ? clasNameError
              : ''
          }`}
          {...(!hookToForm && {
            value: value,
            onChange: onChange
          })}
          {...(isFullyHooked
            ? formContext.register(name, {
                onChange: e => onChange && onChange(e)
              })
            : {})}
          name={name}
          disabled={disabled}
        />
      </div>

      {isFullyHooked && fieldError && fieldError?.message && (
        <p className='text-red-600'>
          {fieldError?.message as string}
        </p>
      )}
    </label>
  )
}

Input.defaultProps = {
  hookToForm: false,
  type: 'text'
}

export default Input
