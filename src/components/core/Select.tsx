import { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

interface ISelectOptions {
  value: string
  label: string | ReactNode
}

interface ISelect {
  id?: string
  name?: string
  value?: string
  className?: string
  onChange?: (e: any) => any
  placeholder?: string
  hookToForm: boolean
  options: ISelectOptions[]
}

function Select({
  id,
  name,
  value,
  className,
  onChange,
  placeholder,
  hookToForm,
  options
}: ISelect) {
  const formContext = useFormContext()

  const isFullyHooked = name && hookToForm && formContext

  const fieldError =
    isFullyHooked && formContext?.formState?.errors?.[name]

  return (
    <label
      {...(id && { htmlFor: id })}
      className={'rounded-md text-sm w-full'}
    >
      <select
        {...(id && { id: id })}
        placeholder={placeholder}
        className={`
        w-full p-2 border-[1px] border-slate-300 text-gray-500
        ${className ? className : ''} ${
          hookToForm && fieldError && fieldError?.message
            ? 'border-red-600'
            : ''
        }`}
        {...(!hookToForm && {
          value: value,
          onChange: onChange
        })}
        {...(isFullyHooked ? formContext.register(name) : {})}
        name={name}
      >
        <option value=''>{placeholder || 'Select an option'}</option>
        {options.map(x => (
          <option key={x.value} value={x.value}>
            {x.label}
          </option>
        ))}
      </select>

      {isFullyHooked && fieldError && fieldError?.message && (
        <p className='text-red-600'>
          {fieldError?.message as string}
        </p>
      )}
    </label>
  )
}

Select.defaultProps = {
  hookToForm: false
}

export default Select
