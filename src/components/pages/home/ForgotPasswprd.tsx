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
import mainIcon from 'assets/mail.svg'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { toggleIsForgotModalVisible } from 'store/slices/auth.slice'

interface ForgotPasswordModalProps {
  isForgotVisible: boolean
  toggleIsForgotVisible: () => void
}

interface IForgotUser {
  useremail: string
}

function ForgotPasswordModal({
  isForgotVisible,
  toggleIsForgotVisible
}: ForgotPasswordModalProps) {
  const [useremail, setUseremail] = useState('')
  const dispatch = useAppDispatch()
  const isGlobalModalVisible = useAppSelector(
    state => state.auth && state.auth.isForgotModalVisible
  )
  const handleUserEmailChange = (value: any) => {
    setUseremail(value?.target?.value)
  }

  const handleCloseModal = () => {
    setUseremail('')
    isGlobalModalVisible &&
      dispatch(toggleIsForgotModalVisible(false))
    isForgotVisible && toggleIsForgotVisible()
  }

  const forgotUser = useMutation(
    (user: IForgotUser) => {
      return http.post(`/send-resetpassword-link`, user)
    },
    {
      onSuccess: data => {
        if (data?.data?.success) {
          handleCloseModal()
          toast.success('Forgot password link sent successfully')
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
    forgotUser.mutate({ useremail: value.useremail })
  }

  return (
    <Modal
      isVisible={isForgotVisible || isGlobalModalVisible}
      onClose={handleCloseModal}
      showCloseButton
    >
      <div className='p-6 w-[480px] h-full rounded-lg'>
        <h2 className='mb-4 text-[#667085] text-[24px]'>
          Forgot your password?
        </h2>
        <Form
          onSubmit={async values => {
            create({ ...values })
          }}
          validationSchema={subscribeValidation}
          className='w-full mb-2'
          initialValues={''}
        >
          <p className='text-[#667085] font-light my-3'>
            Don’t worry, we will send you a password reset link.
          </p>
          <Input
            name='useremail'
            value={useremail}
            onChange={handleUserEmailChange}
            className={
              'text-black outline-none rounded-md h-[2.2rem] lg:h-[3rem] bg-[#F2F4F5] border-none italic text-body'
            }
            clasNameError={'border-bottom-red'}
            placeholder='Write your email'
            leftIcon={mainIcon}
            hookToForm
          />
          <Button
            type='submit'
            size='small'
            outlined={false}
            className='w-full mt-5'
          >
            <Typography type='button'>
              {forgotUser.isLoading ? 'Sending...' : 'Send'}
            </Typography>
          </Button>
        </Form>
      </div>
    </Modal>
  )
}

export default ForgotPasswordModal
