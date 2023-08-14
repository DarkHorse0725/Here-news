import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import Input from 'components/core/Input'
import Modal from 'components/core/Modal'
import http from 'services/http-common'
import Form from 'components/core/Form'
import Button from 'components/core/Button'
import Typography from 'components/core/Typography'
import { subscribeValidation } from './Validation'
import lockIcon from 'assets/lock.svg'
import { useRouter } from 'next/router'

interface ChangePasswordModalProps {
  isChangeVisible: boolean
  toggleIsChangeVisible: () => void
}

interface IChangePassword {
  username: any
  resetToken: any
  password: string
}

function ChangePasswordModal({
  isChangeVisible,
  toggleIsChangeVisible
}: ChangePasswordModalProps) {
  const [password, setPassword] = useState('')
  const [reTypePassword, setReTypePassword] = useState('')

  let router = useRouter()
  const handlePasswordChange = (value: any) => {
    setPassword(value?.target?.value)
  }
  const handleReTypePasswordChange = (value: any) => {
    setReTypePassword(value?.target?.value)
  }

  const handleCloseModal = () => {
    setPassword('')
    setReTypePassword('')
    toggleIsChangeVisible()
    router.replace('/')
  }

  const forgotUser = useMutation(
    (user: IChangePassword) => {
      return http.put(`/change-user-password`, user)
    },
    {
      onSuccess: data => {
        if (data?.data?.success) {
          handleCloseModal()
          toast.success('Password update successfully')
        } else {
          toast.error(data?.response?.data?.error?.message)
        }
      },
      onError: err => {
        toast.error('Error! Cannot send invitation')
      }
    }
  )

  function create({ ...value }) {
    forgotUser.mutate({
      username: router?.query?.username,
      resetToken: router?.query?.forgottoken,
      password: password
    })
  }

  return (
    <Modal
      isVisible={isChangeVisible}
      onClose={handleCloseModal}
      showCloseButton
    >
      <div className='p-6 w-[400px] h-full rounded-lg'>
        <h2 className='mb-4 text-[#667085] text-[24px]'>
          Welcome to Here!
        </h2>
        <Form
          onSubmit={async values => {
            create({ ...values })
          }}
          validationSchema={subscribeValidation}
          className='w-full mb-2'
          initialValues={''}
        >
          <div className='mb-6'>
            <div className='mb-2'>
              <p className='text-[#667085]'>New Password</p>
            </div>
            <Input
              name='password'
              value={password}
              onChange={handlePasswordChange}
              className={
                'text-black outline-none rounded-md h-[2.2rem] lg:h-[3rem] bg-[#F2F4F5] border-none italic text-body'
              }
              type='password'
              clasNameError={'border-bottom-red'}
              placeholder='Password'
              leftIcon={lockIcon}
              hookToForm
            />
          </div>
          <div className='mb-6'>
            <div className='mb-2'>
              <p className='text-[#667085]'>Repeat New Password</p>
            </div>
            <Input
              name='retypepassword'
              value={reTypePassword}
              onChange={handleReTypePasswordChange}
              className={
                'text-black outline-none rounded-md h-[2.2rem] lg:h-[3rem] bg-[#F2F4F5] border-none italic text-body'
              }
              type='password'
              clasNameError={'border-bottom-red'}
              placeholder='Password'
              leftIcon={lockIcon}
              hookToForm
            />
          </div>

          <Button
            type='submit'
            size='small'
            outlined={false}
            className='w-full mt-5'
          >
            <Typography type='button'>
              {forgotUser.isLoading ? 'Changing password' : 'Change'}
            </Typography>
          </Button>
        </Form>
      </div>
    </Modal>
  )
}

export default ChangePasswordModal
