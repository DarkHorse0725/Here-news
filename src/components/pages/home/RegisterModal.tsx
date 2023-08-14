import React, { ChangeEventHandler, useState } from 'react'
import { toast } from 'react-toastify'
import {
  setBalance,
  setSelectedAccount
} from 'store/slices/auth.slice'
import { useAppDispatch } from 'store/hooks'
import http from 'services/http-common'
import { setTokenInCookies } from 'lib/token'
import Typography from 'components/core/Typography'
import Button from 'components/core/Button'
import Form from 'components/core/Form'
import { subscribeValidation } from './Validation'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'
import Icon from 'components/core/Icon'
import PlaceholderImg from 'assets/PlaceholderProfileImg.png'
import Pattern from 'assets/AuthBg.png'
import { toggleIsWelcomeModalVisible } from 'store/slices/auth.slice'

interface RegisterModalProps {
  data: any
}
interface IRegisterUser {
  username: string
  useremail: string
  displayName: string
  balance: number
  password: string
  userId: string
  userIdHash: string
}

function RegisterModal({ data }: RegisterModalProps) {
  const dispatch = useAppDispatch()

  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [retypepassword, setRetypepassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  function create({ ...value }) {
    setLoading(true)

    const payload: IRegisterUser = {
      username: data?.email,
      useremail: data?.email,
      balance: Number(data?.balance),
      password: value.password,
      displayName: value.displayName,
      userId: data?.userId,
      userIdHash: data?.userIdHash
    }
    http
      .post(`/register`, payload)
      .then(res => {
        if (res?.data?.success) {
          const { newUser, token } = res?.data?.data
          setTokenInCookies(token, 7)
          dispatch(setSelectedAccount(newUser))
          dispatch(setBalance(newUser?.balance))
          toast.success('Registered Successfully')
          router.push('/')
          dispatch(toggleIsWelcomeModalVisible(true))
        } else {
          toast.error(res?.response?.data?.error?.message)
        }
      })
      .catch(err => {
        toast.error('There was an error registering user!')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div
      className='w-[300px] sm:w-[500px] m-auto flex flex-col gap-6 p-4 sm:p-8 rounded-[8px] bg-cover'
      style={{
        backgroundImage: `url(${Pattern.src})`
      }}
    >
      <Typography
        type='subtitle-2'
        className='text-left !text-[24px] !leading-[33px] font-medium text-grayMedium'
      >
        Create Account
      </Typography>
      <div className='flex flex-col gap-4 items-center justify-center'>
        <Image
          src={PlaceholderImg}
          height={150}
          width={150}
          alt='profile'
          className='rounded-full m-auto'
        />
        <Typography
          type='body'
          className='text-center sm:!text-base font-thin text-grayMd italic'
        >
          @{data?.userIdHash}
        </Typography>
      </div>

      <Form
        onSubmit={async values => {
          create({ ...values })
        }}
        validationSchema={subscribeValidation}
        className='flex flex-col gap-4'
      >
        <div className='flex flex-col gap-2'>
          <label
            htmlFor='displayName'
            className='text-grayMedium text-sm sm:text-base '
          >
            Display Name
          </label>
          <RegistrationInput
            id='displayName'
            name='displayName'
            value={displayName}
            onChange={(e: any) => setDisplayName(e.target.value)}
            className={`h-10 sm:h-12 bg-[#F9FAFB]`}
            clasNameError={'border-bottom-red'}
            placeholder='Display name'
            leftIcon={<Icon name='user' raw />}
            hookToForm
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label
            htmlFor='email'
            className='text-grayMedium text-sm sm:text-base '
          >
            Email
          </label>
          <RegistrationInput
            id='email'
            name='useremail'
            value={data && data?.email}
            disabled
            className={`h-10 sm:h-12 bg-[#F9FAFB]`}
            clasNameError={'border-bottom-red'}
            placeholder='Email'
            leftIcon={<Icon name='mail' raw />}
            hookToForm
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label
            className='text-grayMedium text-sm sm:text-base '
            htmlFor='password'
          >
            Password
          </label>
          <RegistrationInput
            id='password'
            name='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='h-10 sm:h-12 bg-[#F9FAFB]'
            clasNameError={'border-bottom-red'}
            placeholder='Password'
            leftIcon={<Icon name='lock' raw />}
            type='password'
            hookToForm
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label
            className='text-grayMedium text-sm sm:text-base '
            htmlFor='retypePassword'
          >
            Confirm Password
          </label>
          <RegistrationInput
            id='retypePassword'
            name='retypepassword'
            value={retypepassword}
            className='h-10 sm:h-12 bg-[#F9FAFB]'
            onChange={e => setRetypepassword(e.target.value)}
            clasNameError={'border-bottom-red'}
            placeholder='Re-type Password'
            leftIcon={<Icon name='lock' raw />}
            type='password'
            hookToForm
          />
        </div>

        <Button
          type='submit'
          size='small'
          outlined={false}
          className='py-1 px-6 mt-4 rounded-lg h-10 sm:h-12 !bg-primary'
          disabled={loading}
        >
          <Typography
            type='button'
            className='text-baseWhite !text-base leading-[1.2rem] tracking-medium font-medium'
          >
            {loading ? 'Registering...' : 'Register'}
          </Typography>
        </Button>
      </Form>
    </div>
  )
}

export default RegisterModal

// TODO: Replace components/core/input.tsx with this implementation
// Note: This input is the improved implementation of the components/core/input.tsx, but since that input is being used in several places
// it felt better to create it locally in the file... later we will need to replace AND test the original implementation
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
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  disabled?: boolean
}

export function RegistrationInput({
  id,
  name,
  value,
  type = 'text',
  placeholder,
  hookToForm,
  onChange,
  className,
  clasNameError,
  leftIcon,
  rightIcon,
  disabled
}: IInput) {
  const formContext = useFormContext()
  const isFullyHooked = name && hookToForm && formContext

  const fieldError =
    isFullyHooked && formContext?.formState?.errors?.[name]
  const [isPassVisible, setIsPassVisible] = useState(false)
  const togglePassVisible = () => setIsPassVisible(prev => !prev)

  return (
    <div className={`text-sm w-full h-full`}>
      <div
        className={`flex flex-row items-center px-4 gap-2 bg-historic border border-stroke rounded-lg ${
          hookToForm && fieldError && fieldError?.message
            ? clasNameError
            : ''
        }`}
      >
        {leftIcon !== undefined && leftIcon}

        <input
          {...(id && { id: id })}
          type={isPassVisible ? 'text' : type}
          value={value}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none placeholder:italic placeholder:text-base placeholder:font-light placeholder:tracking-medium placeholder:!leading-[1.4rem] ${
            className ? className : ''
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

        {rightIcon !== undefined
          ? rightIcon
          : type === 'password' && (
              <div onClick={togglePassVisible}>
                <Icon
                  name={isPassVisible ? 'eyeClose' : 'eyeOpen'}
                  size={24}
                  raw
                  className='text-grayLight'
                />
              </div>
            )}
      </div>

      {isFullyHooked && fieldError && fieldError?.message && (
        <p className='text-red-600'>
          {fieldError?.message as string}
        </p>
      )}
    </div>
  )
}

RegistrationInput.defaultProps = {
  hookToForm: false,
  type: 'text'
}
