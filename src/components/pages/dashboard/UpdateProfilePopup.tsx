import React, { useEffect, useState } from 'react'
import Form from 'components/core/Form'
import Input from 'components/core/Input'
import Modal from 'components/core/Modal'
import Button from 'components/core/Button'
import Typography from 'components/core/Typography'
import Image from 'next/image'
import { updateProfileValidation } from './validations'
import { useAppSelector } from 'store/hooks'
import http from 'services/http-common'
import { toast } from 'react-toastify'

// images / icons
import PlaceholderImg from 'assets/PlaceholderProfileImg.png'
import Edit from 'assets/Edit.svg'
import User from 'assets/user1.svg'
import Mail from 'assets/mail.svg'
import UsernameIcon from 'assets/Person.svg'

interface EditProfileModalProps {
  isEditProfileVisible: boolean
  toggleIsEditProfileVisible: () => void
  handleOnImageChange?: any
  imageRef?: any
  onChooseImg?: any
  imgAfterCrop?: any
  refetchProfile?: () => void
  setImgAfterCrop?: any
}

function UpdateProfilePopup({
  isEditProfileVisible,
  toggleIsEditProfileVisible,
  handleOnImageChange,
  imageRef,
  onChooseImg,
  imgAfterCrop,
  refetchProfile,
  setImgAfterCrop
}: EditProfileModalProps) {
  const { selectedAccount } = useAppSelector(state => state.auth)

  const [displayName, setDisplayName] = useState<string | undefined>(
    selectedAccount?.displayName || ''
  )
  const [useremail, setUseremail] = useState<string | undefined>(
    selectedAccount?.useremail || ''
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUseremail(selectedAccount?.useremail)
    setDisplayName(selectedAccount?.displayName)
  }, [selectedAccount?.useremail, selectedAccount?.displayName])

  const handleCloseModal = () => {
    isEditProfileVisible && toggleIsEditProfileVisible()
    setUseremail(selectedAccount?.useremail)
    setDisplayName(selectedAccount?.displayName)
    setImgAfterCrop('')
  }

  function create({ ...value }) {
    setLoading(true)
    const payload = {
      useremail: useremail?.trim().toLowerCase(),
      displayName,
      avatar: imgAfterCrop ? imgAfterCrop : selectedAccount?.avatar
    }
    http
      .put(`/updateProfile`, payload)
      .then(res => {
        refetchProfile && refetchProfile()
        handleCloseModal()
        toast.success('Profile Updated Successfully!')
      })
      .catch(err => {
        toast.success(err.message || 'Something went wrong!')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal
      isVisible={isEditProfileVisible}
      onClose={handleCloseModal}
      showCloseButton
      className='bg-[#21364273] backdrop-blur-[2px]'
      closeBtnClass='right-3 top-3 md:right-6 md:top-6'
    >
      <div className='p-3 md:p-6 w-[300px] md:w-[500px] h-full rounded-lg flex flex-col gap-6'>
        <p className='text-[#5A6B74] font-[500] leading-[33px] text-[24px]'>
          Edit Profile
        </p>
        <div>
          <div>
            <input
              type='file'
              className='hidden'
              accept='image/*'
              ref={imageRef}
              onChange={handleOnImageChange}
            />
            <div className='relative m-auto w-[70px] h-[70px] md:w-[169px] md:h-[169px]'>
              <Image
                src={
                  imgAfterCrop
                    ? imgAfterCrop
                    : selectedAccount?.avatar
                    ? selectedAccount?.avatar
                    : PlaceholderImg
                }
                alt='profile'
                height={112}
                width={112}
                className='w-full rounded-full m-auto'
              />
              <button
                onClick={onChooseImg}
                className='absolute right-0 top-[70%] w-5 h-5 md:w-10 md:h-10 rounded-full bg-pearl grid place-items-center cursor-pointer'
              >
                <Image
                  src={Edit}
                  alt='profile'
                  height={15}
                  width={15}
                  className=''
                />
              </button>
            </div>
          </div>
        </div>
        <Form
          onSubmit={async values => {
            create({ ...values })
          }}
          validationSchema={updateProfileValidation}
          className='w-full flex flex-col gap-6'
        >
          <div className='flex flex-col gap-2'>
            <p className='text-base font-[400] text-[#5A6B74]'>
              User Name
            </p>
            <Input
              name='displayName'
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className={
                'outline-none rounded-md h-[2.2rem] lg:h-[3rem] bg-[#F9FAFB] border-[1px] border-[#F2F4F5] italic text-body placeholder:text-[#e0dfdf]'
              }
              clasNameError={'border-bottom-red'}
              placeholder='Username'
              leftIcon={User}
              hookToForm
            />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-base font-[400] text-[#5A6B74]'>
              User ID
            </p>
            <Input
              name='userIdHash'
              value={selectedAccount?.userIdHash}
              className={
                'outline-none rounded-md h-[2.2rem] lg:h-[3rem] bg-[#F9FAFB] border-[1px] border-[#F2F4F5] disabled:bg-[#e6e6e6] italic text-body placeholder:text-[#e0dfdf]'
              }
              clasNameError={'border-bottom-red'}
              placeholder='12345678'
              leftIcon={UsernameIcon}
              hookToForm
              disabled
            />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-base font-[400] text-[#5A6B74]'>
              Email
            </p>
            <Input
              name='useremail'
              value={useremail}
              onChange={e => setUseremail(e.target.value)}
              className={
                'outline-none rounded-md h-[2.2rem] lg:h-[3rem] bg-[#F9FAFB] border-[1px] border-[#F2F4F5] italic text-body disabled:bg-[#e6e6e6] placeholder:text-[#e0dfdf]'
              }
              clasNameError={'border-bottom-red'}
              placeholder='Email'
              leftIcon={Mail}
              hookToForm
              disabled={selectedAccount?.useremail ? true : false}
            />
          </div>
          <div className='flex flex-row gap-4'>
            <Button
              type='submit'
              size='small'
              outlined={false}
              className='w-full h-[2.2rem] lg:h-[3rem]'
              isLoading={loading}
              disabled={loading}
            >
              <Typography type='button'>Save</Typography>
            </Button>
            <Button
              size='small'
              outlined={true}
              className='w-full bg-white !border-[#e6e6e6] !text-[#667085] h-[2.2rem] lg:h-[3rem]'
              onClick={handleCloseModal}
              disabled={loading}
            >
              <Typography type='button'>Cancel</Typography>
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default UpdateProfilePopup
