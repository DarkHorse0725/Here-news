import React, { useState } from 'react'
import { toast } from 'react-toastify'

import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  setSelectedAccount,
  toggleIsLoginModalVisible,
  toggleIsForgotModalVisible,
  setBalance
} from 'store/slices/auth.slice'
import lockIcon from 'assets/lock.svg'
import userIcon from 'assets/username.svg'
import Input from 'components/core/Input'
import Modal from 'components/core/Modal'
import { setTokenInCookies } from 'lib/token'
import http from 'services/http-common'
import Form from 'components/core/Form'
import { loginValidation } from './Validation'
import Button from 'components/core/Button'
import Typography from 'components/core/Typography'

interface LoginModalProps {
  isLoginVisible: boolean
  toggleIsLoginVisible: () => void
}

interface ILoginUser {
  username: string
  password: string
}

function LoginModal({
  isLoginVisible,
  toggleIsLoginVisible
}: LoginModalProps) {
  const dispatch = useAppDispatch()
  const isGlobalModalVisible = useAppSelector(
    state => state.auth && state.auth.isLoginModalVisible
  )

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberBe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUsernameChange = (value: any) => {
    setUsername(value?.target?.value)
  }

  const handlePasswordChange = (value: any) => {
    setPassword(value?.target?.value)
  }

  const handleCloseModal = () => {
    setUsername('')
    setPassword('')
    isGlobalModalVisible && dispatch(toggleIsLoginModalVisible(false))
    isLoginVisible && toggleIsLoginVisible()
  }

  function create({ ...value }) {
    setLoading(true)
    const payload: ILoginUser = {
      username: username.trim(),
      password: password.trim()
    }
    http
      .post(`/login`, payload)
      .then(data => {
        if (data?.data?.success) {
          const { user, token } = data?.data?.data
          if (rememberBe) {
            setTokenInCookies(token, 7)
          } else {
            setTokenInCookies(token)
          }
          dispatch(setSelectedAccount(user))
          dispatch(setBalance(user?.balance))
          handleCloseModal()
        } else {
          toast.error(data?.response?.data?.error.message)
        }
      })
      .catch(err => {
        toast.error('Username or password incorrect!')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal
      isVisible={isLoginVisible || isGlobalModalVisible}
      onClose={handleCloseModal}
      showCloseButton
      closeBtnClass='top-4 lg:top-8 right-4 lg:right-8 '
    >
      <div className='p-4 lg:p-8 w-[300px] sm:w-[500px] h-full max-h-[90vh] overflow-y-auto bg-white rounded-lg'>
        <p className='text-[#667085] text-2xl lg:text-[1.5rem] leading-[140%] font-medium mb-4 lg:mb-7'>
          Welcome to Here!
        </p>
        <Form
          onSubmit={async values => {
            create({ ...values })
          }}
          validationSchema={loginValidation}
          className='w-full flex flex-col gap-4 lg:gap-6'
          initialValues={''}
        >
          <div className='flex flex-col gap-1 md:gap-2'>
            <p className='text-sm lg:text-base text-grayMedium'>
              Email
            </p>
            <Input
              name='username'
              value={username}
              onChange={handleUsernameChange}
              className={
                'outline-none rounded-md h-[2.2rem] lg:h-[3rem] bg-[#F2F4F5] border-none italic text-body'
              }
              clasNameError={'border-bottom-red'}
              placeholder='Username or Email'
              leftIcon={userIcon}
              hookToForm
            />
          </div>

          <div className='flex flex-col gap-1 md:gap-2'>
            <p className='text-sm lg:text-base text-grayMedium'>
              Password
            </p>
            <Input
              name='password'
              value={password}
              onChange={handlePasswordChange}
              className={
                'outline-none rounded-md h-[2.2rem] lg:h-[3rem] bg-[#F2F4F5] border-none italic text-body'
              }
              type='password'
              clasNameError={'border-bottom-red'}
              placeholder='Password'
              leftIcon={lockIcon}
              hookToForm
            />
          </div>

          <div className='flex items-center justify-between'>
            <label className='flex items-center gap-2'>
              <input
                name='checkbox'
                type='checkbox'
                checked={rememberBe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <div>
                <p className='text-xs lg:text-base text-grayLight'>
                  Remember me
                </p>
              </div>
            </label>
            <div
              className='cursor-pointer'
              onClick={() => {
                toggleIsLoginVisible()
                dispatch(toggleIsForgotModalVisible(true))
              }}
            >
              <p className='text-xs lg:text-base text-grayLight underline'>
                Forgot my password
              </p>
            </div>
          </div>

          <Button
            type='submit'
            size='small'
            outlined={false}
            className='w-full mt-2 h-[2.2rem] lg:h-[3rem]'
          >
            <Typography type='button'>
              {loading ? 'Login...' : 'Login'}
            </Typography>
          </Button>
          <div className='flex flex-col gap-2 md:gap-6'>
            <div className='flex flex-row items-center gap-4'>
              <hr className='w-full bg-stroke' />
              <p className='text-sm md:text-base text-grayMd leading-[160%]'>
                or
              </p>
              <hr className='w-full bg-stroke' />
            </div>
            <p className='text-xs md:text-base text-center text-grayMd leading-[160%]'>
              If you want to join us, Contact here{' '}
            </p>
            <div className='flex flex-col gap-2 lg:gap-4'>
              <Button
                href='https://twitter.com/heresnews'
                variant='light'
                className='w-full mt-2 flex items-center justify-center h-[2.2rem] lg:h-[3rem]'
                leftIcon='twitter'
              >
                <Typography type='button'>Twitter</Typography>
              </Button>
              {/* <Button
                variant='light'
                className='w-full mt-2 flex items-center justify-center h-[2.2rem] lg:h-[3rem]'
                leftIcon='telegram'
              >
                <Typography type='button'>Telegram</Typography>
              </Button> */}
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default LoginModal
