import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Dropdown } from './Dropdown'
import useClickOutside from 'hooks/useClickOutside'
import UpdateProfilePopup from './UpdateProfilePopup'
import ImageCropPopup from './ImageCropPopup'
import { useRouter } from 'next/router'
import {
  DASHBOARD_DROPDOWN_OPTIONS,
  HEADER_ICONS,
  POST_DROPDOWN_OPTIONS
} from 'const'
import Icon from 'components/core/Icon'
import { Button } from './Button'
import http from 'services/http-common'
import { useQuery } from 'react-query'
import { useDispatch } from 'react-redux'
import {
  setBalance,
  setSelectedAccount
} from 'store/slices/auth.slice'
import { useAppSelector } from 'store/hooks'

// Icons / images
import VerifiedCheck from 'assets/dashboard/check-verified.svg'
import ThreeDots from 'assets/ThreeDots.svg'
import Edit from 'assets/Edit.svg'
import RepoBadge from 'assets/dashboard/badge-repo.svg'

const DashboardHeader = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { selectedAccount } = useAppSelector(
    (state: any) => state.auth
  )

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [postDropdownOpen, setPostDropdownOpen] =
    useState<boolean>(false)
  const [image, setImage] = useState('')
  const [imgAfterCrop, setImgAfterCrop] = useState('')
  const [isEditProfileVisible, setIsEditProfileVisible] =
    useState(false)
  const [isCropModalVisible, setIsCropModalVisible] = useState(false)

  const imageRef = useRef<HTMLButtonElement>()

  const { ref: dropdownRef } = useClickOutside({
    shouldRegister: dropdownOpen,
    onOutsideClick: () => setDropdownOpen(false)
  })

  const { ref: postDropdownRef } = useClickOutside({
    shouldRegister: postDropdownOpen,
    onOutsideClick: () => setPostDropdownOpen(false)
  })

  const toggleIsEditProfileVisible = () => {
    setIsEditProfileVisible(prev => !prev)
  }

  const toggleIsCropModalVisible = () => {
    setIsCropModalVisible(prev => !prev)
  }

  // Invoked when new image file is selected
  const onImageSelected = (selectedImg: any) => {
    setImage(selectedImg)
  }

  // Generating Cropped Image When Done Button Clicked
  const onCropDone = (imgCroppedArea: any) => {
    const canvasEle = document.createElement('canvas')
    canvasEle.width = imgCroppedArea.width
    canvasEle.height = imgCroppedArea.height

    const context: any = canvasEle.getContext('2d')

    const profileImageElement = document.createElement('img')
    profileImageElement.src = image
    profileImageElement.onload = function () {
      context.drawImage(
        profileImageElement,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      )

      const dataURL = canvasEle.toDataURL('image/jpeg')

      setImgAfterCrop(dataURL)
      toggleIsCropModalVisible()
      toggleIsEditProfileVisible()
    }
  }

  // Handle Cancel Button Click
  const onCropCancel = () => {
    toggleIsCropModalVisible()
    toggleIsEditProfileVisible()
    setImage('')
  }

  // Handle profile image change
  const handleOnImageChange = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = function (e) {
        onImageSelected(reader.result)
      }
      toggleIsEditProfileVisible()
      toggleIsCropModalVisible()
    }
  }

  // Handle Edit Profile Image Button Click
  const onChooseImg = () => {
    if (imageRef && imageRef.current) {
      imageRef.current.value = ''
      imageRef.current.click()
    }
  }

  // Get route last item to display in header
  const routeItems = router.pathname.split('/')
  const lastItem = routeItems[routeItems.length - 1]

  // Get current user profile
  const getUserProfile = async () => {
    const response = await http.get(`/getCurrentUser`)

    return response.data.data
  }

  const { data, refetch } = useQuery({
    queryKey: `getUser`,
    queryFn: getUserProfile,
    cacheTime: 0
  })

  useEffect(() => {
    if (data) {
      dispatch(setSelectedAccount(data))
      dispatch(setBalance(data?.balance))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data?.introductoryPost,
    data?.preferedLanguages,
    data?.avatar,
    data?.displayName
  ])

  return (
    <>
      <div
        className={`${
          !router.asPath.includes('dashboard/profile')
            ? 'h-[70px] md:h-[94px]'
            : ''
        } relative z-[25] flex flex-row items-center justify-between py-2 md:py-4 px-2 md:px-4 lg:px-[30px] rounded-[8px] md:rounded-[16px] backdrop-blur-[12.5px] border-[1px] border-baseWhite`}
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(218, 218, 218, 0.08) 0%, rgba(249, 250, 252, 0.08) 100%), rgba(255, 255, 255, 0.6)'
        }}
      >
        {router.asPath.includes('dashboard/profile') ? (
          <div className='flex flex-row items-center gap-2 md:gap-4'>
            <div className='relative'>
              <Image
                // @ts-ignore
                src={selectedAccount?.avatar}
                alt='profile'
                height={112}
                width={112}
                className='w-[50px] h-[50px] md:w-[138px] md:h-[138px] rounded-full bg-black border-[3px] border-white'
              />
              <div className='absolute right-0 bottom-0'>
                <Image
                  src={RepoBadge}
                  alt='profile'
                  height={44}
                  width={44}
                  className='relative w-[25px] h-[25px] md:w-[70px] md:h-[70px]'
                />
                <p className='absolute top-[3px] md:top-3 left-3 md:left-[26px] text-[10px] md:text-2xl text-primary font-bold'>
                  {selectedAccount?.reputation}
                </p>
              </div>
            </div>
            <div className='flex flex-col gap-0 md:gap-1'>
              <div className='flex flex-row items-center gap-1'>
                <p className='text-base md:text-[32px] font-[500] text-primary leading-[20px] md:leading-[38px]'>
                  {selectedAccount?.verified
                    ? selectedAccount?.displayName
                    : `@${selectedAccount?.userIdHash}`}
                </p>
                {selectedAccount?.verified ? (
                  <Image
                    src={VerifiedCheck}
                    alt='verifed'
                    height={25}
                    width={25}
                    className='w-[18px] h-[18px] md:w-[25px] md:h-[25px]'
                  />
                ) : null}
              </div>
              {selectedAccount?.verified ? (
                <>
                  <p className='hidden md:block text-xs md:text-[20px] font-[400] text-grayMd leading-4 md:leading-[32px]'>
                    @{selectedAccount?.userIdHash}
                  </p>
                  <p className='text-[10px] md:text-base font-[400] text-[#98A2B3] leading-3 md:leading-[25px]'>
                    {selectedAccount?.useremail}
                  </p>
                </>
              ) : null}
            </div>
          </div>
        ) : router.asPath.includes('dashboard/posts') ? (
          <div
            ref={postDropdownRef}
            className='relative flex flex-row items-center gap-2 cursor-pointer'
            onClick={() => setPostDropdownOpen(!postDropdownOpen)}
          >
            <div className='flex flex-row items-center gap-[0.625rem]'>
              <Icon
                raw
                size={30}
                // @ts-ignore
                name={HEADER_ICONS[lastItem]}
                color='#213642'
              />
              <p className='text-base md:text-[32px] font-[500] text-primary leading-[20px] md:leading-[38px] capitalize'>
                {lastItem}
              </p>
            </div>
            <Icon
              name='chevronDown'
              className=''
              size={30}
              color='#213642'
              raw
            />
            {postDropdownOpen ? (
              <Dropdown
                options={POST_DROPDOWN_OPTIONS}
                width='w-[10.375rem]'
                className='left-0'
              />
            ) : null}
          </div>
        ) : (
          <div className='flex flex-row items-center gap-[0.625rem]'>
            <Icon
              // @ts-ignore
              name={HEADER_ICONS[lastItem]}
              raw
              size={30}
            />
            <p className='text-base md:text-[32px] font-[500] text-[#213642] leading-[20px] md:leading-[38px] capitalize'>
              {lastItem}
            </p>
          </div>
        )}

        <div className='flex flex-row items-center gap-2'>
          {router.asPath.includes('dashboard/profile') &&
          selectedAccount?.verified ? (
            <Button
              text='Edit Profile'
              icon={Edit}
              className='!md:w-[132px] !bg-historic'
              textClassName='!text-primary'
              onClick={toggleIsEditProfileVisible}
            />
          ) : null}
          <div
            ref={dropdownRef}
            className='relative h-8 w-8 md:h-12 md:w-12 grid place-items-center bg-historic rounded-[4px] md:rounded-[8px] border-[1px] border-[#E6E6E6] cursor-pointer'
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Image
              src={ThreeDots}
              alt='icon'
              height={16}
              width={4}
              className='w-[3px] h-[12px] md:h-[16px] md:w-[4px]'
            />
            {dropdownOpen ? (
              <Dropdown options={DASHBOARD_DROPDOWN_OPTIONS} />
            ) : null}
          </div>
        </div>
      </div>
      <UpdateProfilePopup
        isEditProfileVisible={isEditProfileVisible}
        toggleIsEditProfileVisible={toggleIsEditProfileVisible}
        onChooseImg={onChooseImg}
        imageRef={imageRef}
        handleOnImageChange={handleOnImageChange}
        imgAfterCrop={imgAfterCrop}
        setImgAfterCrop={setImgAfterCrop}
        refetchProfile={refetch}
      />
      <ImageCropPopup
        isCropModalVisible={isCropModalVisible}
        toggleIsCropModalVisible={toggleIsCropModalVisible}
        image={image}
        onCropDone={onCropDone}
        onCropCancel={onCropCancel}
      />
    </>
  )
}

export { DashboardHeader }
