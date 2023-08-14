import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Input from 'components/core/Input'
import Modal from 'components/core/Modal'
import http from 'services/http-common'
import Form from 'components/core/Form'
import Button from 'components/core/Button'
import { subscribeValidation } from './Validation'
import mailIcon from 'assets/mail.svg'
import Wallet from 'assets/Wallet.svg'
import { deductBalance } from 'store/slices/auth.slice'
import { useDispatch } from 'react-redux'
import { QueryClient } from 'react-query'

interface InviteModalProps {
  isInviteVisible: boolean
  toggleIsInviteVisible: () => void
  refetchInvites?: () => void
}

interface IInviteUser {
  useremail: string
  balance: number
}

function InviteModal({
  isInviteVisible,
  toggleIsInviteVisible,
  refetchInvites
}: InviteModalProps) {
  const dispatch = useDispatch()
  const queryClient = new QueryClient()
  const [useremail, setUseremail] = useState('')
  const [_balance, setBalance] = useState(10)
  const [message, setMessage] = useState({ status: '', text: '' })
  const [loading, setLoading] = useState(false)

  const handleUserEmailChange = useCallback(
    (name: string, value: any) => {
      if (name === 'useremail') {
        // Used replaceAll because the user might "Paste" an email address with spaces in there
        setUseremail(value.replaceAll(' ', ''))
      } else {
        setBalance(value)
      }
      setMessage({ status: '', text: '' })
    },
    []
  )

  const handleCloseModal = () => {
    setUseremail('')
    toggleIsInviteVisible()
    setMessage({ status: '', text: '' })
  }

  useEffect(() => {
    if (message?.status === 'success') {
      setTimeout(() => {
        setMessage({ status: '', text: '' })
        setUseremail('')
        handleCloseModal()
      }, 2000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message])

  function create({ ...value }) {
    const payload: IInviteUser = {
      useremail: value.useremail.trim().toLowerCase(),
      balance: 100
    }
    setLoading(true)
    http
      .post(`/send-invites`, payload)
      .then(res => {
        if (res?.data?.success) {
          setMessage({
            status: 'success',
            text: 'Great! You’ve invited a new person.'
          })
          refetchInvites && refetchInvites()
          queryClient.refetchQueries(['getUser'], {
            active: true,
            exact: true
          })
          dispatch(deductBalance(100))
          toast.success('Invite send successfully')
        } else {
          setMessage({
            status: 'error',
            text: res?.response?.data?.error?.message
          })
          toast.error(res?.response?.data?.error?.message)
        }
      })
      .catch(err => {
        toast.error('Error! Cannot send invitation')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal
      isVisible={isInviteVisible}
      onClose={handleCloseModal}
      showCloseButton
      className='bg-[#21364273] backdrop-blur-[2px]'
      closeBtnClass='right-8 top-8'
    >
      <div className='p-8 w-[18.75rem] sm:w-[31.25rem] flex flex-col gap-6 rounded-lg'>
        <h2 className='text-grayMedium text-xl sm:text-2xl font-medium leading-[140%]'>
          Invite your friend!
        </h2>

        <Form
          onSubmit={async values => {
            create({ ...values })
          }}
          validationSchema={subscribeValidation}
          className='w-full flex flex-col gap-6'
        >
          <div className='flex flex-col gap-2'>
            <p className='sm:text-base text-sm leading-[160%]'>
              Email of the person to be invited.
            </p>
            <Input
              name='useremail'
              value={useremail}
              onChange={(e: any) =>
                handleUserEmailChange('useremail', e.target.value)
              }
              className={`outline-none rounded-lg h-10 sm:h-12 border border-stroke italic text-sm sm:text-base leading-[140%] tracking-medium font-light text-grayMedium ${
                message?.status === 'error'
                  ? 'bg-[#F5F3FA]'
                  : 'bg-[#F9FAFB]'
              } ${
                message?.status === 'error' && 'border-bottom-red'
              }`}
              clasNameError={'border-bottom-red'}
              placeholder='Email'
              leftIcon={mailIcon}
              hookToForm
            />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='sm:text-base text-sm leading-[160%]'>
              Gift Token
            </p>
            <Input
              name='balance'
              value='100μ'
              onChange={(e: any) =>
                handleUserEmailChange('balance', e.target.value)
              }
              className={`outline-none rounded-lg h-10 sm:h-12 border border-stroke italic text-sm sm:text-base leading-[140%] tracking-medium font-light text-grayMedium disabled:bg-stroke ${
                message?.status === 'error'
                  ? 'bg-[#F5F3FA]'
                  : 'bg-[#F9FAFB]'
              } ${
                message?.status === 'error' && 'border-bottom-red'
              }`}
              clasNameError={'border-bottom-red'}
              placeholder='100μ'
              leftIcon={Wallet}
              hookToForm
              disabled
            />
          </div>
          {message.status && (
            <p
              className={`text-sm ${
                message.status === 'error'
                  ? 'text-[red]'
                  : 'text-[#59C591]'
              }`}
            >
              {message?.text}
            </p>
          )}

          <Button
            type='submit'
            className='w-full h-12 !px-6 !py-1 grid place-items-center !bg-primary !rounded-lg text-sm font-medium leading-[120%] tracking-medium text-baseWhite sm:text-base'
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Invite'}
          </Button>
        </Form>
      </div>
    </Modal>
  )
}

export default InviteModal
