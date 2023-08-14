import Modal from 'components/core/Modal'
import Typography from 'components/core/Typography'
import React, { useCallback } from 'react'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton
} from 'react-share'
import { toast } from 'react-toastify'
import { AiOutlineLink } from 'react-icons/ai'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { hideShareModal } from 'store/slices/app.slice'
import Image from 'next/image'
import crossIcon from 'assets/cross.svg'
import Icon from 'components/core/Icon'
import Pattern from 'assets/pattern.png'
import FacebookIcon from 'assets/facebook.svg'
import LinkedinIcon from 'assets/linkedin.svg'
import TwitterIcon from 'assets/twitter.svg'
import WhatsappIcon from 'assets/whatsapp.svg'
import TelegramIcon from 'assets/telegram.svg'

const ShareModal = () => {
  const { isShareModalVisible, shareModalData } = useAppSelector(
    state => state.app
  )
  const dispatch = useAppDispatch()

  const handleCopyURL = useCallback(async () => {
    await navigator.clipboard.writeText(
      shareModalData && typeof shareModalData === 'string'
        ? shareModalData
        : location.href
    )
    toast.success('Copied successfully')
  }, [shareModalData])

  const onClose = useCallback(() => {
    dispatch(hideShareModal())
  }, [dispatch])

  const onHandleMore = useCallback(() => {
    const data: ShareData = {
      url:
        shareModalData && typeof shareModalData === 'string'
          ? shareModalData
          : location.href
    }

    if (navigator.canShare && navigator?.canShare(data)) {
      navigator.share(data)
    } else {
      toast.error('This option is not supported')
    }
  }, [shareModalData])

  return (
    <Modal isVisible={isShareModalVisible} onClose={onClose}>
      <div
        className='flex flex-col items-stretch gap-4 rounded-lg p-8 border border-stroke bg-blend-luminosity'
        style={{
          background: `url("${Pattern.src}"), #FFFFFF;`
        }}
      >
        <div className='flex flex-row items-center justify-between'>
          <Typography
            type='subtitle-small'
            className='!text-2xl font-semibold !leading-[2.1rem] text-grayMedium'
          >
            Boost your traffic
          </Typography>

          <Image
            alt='cross'
            src={crossIcon}
            onClick={onClose}
            height={32}
            width={32}
            className='border rounded-[0.5rem] cursor-pointer'
          />
        </div>

        <Typography
          type='body'
          className='my-2 !text-base !leading-[1.6rem] text-grayMedium'
        >
          Share your content to grow your community
        </Typography>

        <div className='grid grid-cols-5 gap-6'>
          <ShareIcon
            IconWrapper={FacebookShareButton}
            Icon={FacebookIcon}
            text='Facebook'
          />

          <ShareIcon
            text='Linkedin'
            IconWrapper={LinkedinShareButton}
            Icon={LinkedinIcon}
          />

          <ShareIcon
            text='Twitter'
            IconWrapper={TwitterShareButton}
            Icon={TwitterIcon}
          />

          <ShareIcon
            text='Whatsapp'
            IconWrapper={WhatsappShareButton}
            Icon={WhatsappIcon}
          />

          <ShareIcon
            text='Telegram'
            IconWrapper={TelegramShareButton}
            Icon={TelegramIcon}
          />
          {/* @ts-ignore */}
          {navigator.canShare && (
            <div
              className='col-span-1 flex flex-col items-center gap-[0.625rem] cursor-pointer'
              onClick={onHandleMore}
            >
              <div className='w-[2.8125rem] aspect-square rounded-full border border-stroke grid place-items-center'>
                <Icon name='share2' className='text-body' raw />
              </div>

              <Typography
                type='body'
                className='!text-xs !leading-[1.05rem] tracking-medium text-grayMedium'
              >
                More
              </Typography>
            </div>
          )}

          {/* Copy Link Button */}
          <div
            className='col-span-1  flex flex-col items-center gap-[0.625rem] cursor-pointer'
            onClick={handleCopyURL}
          >
            <div className='bg-transparent w-[2.8125rem] aspect-square rounded-full border border-stroke grid place-items-center'>
              <AiOutlineLink className='text-body' size={28} />
            </div>

            <Typography
              type='body'
              className='!text-xs !leading-[1.05rem] tracking-medium text-grayMedium'
            >
              Copy URL
            </Typography>
          </div>
        </div>
      </div>
    </Modal>
  )
}

function ShareIcon({
  IconWrapper,
  Icon,
  text
}: {
  IconWrapper: typeof FacebookShareButton
  Icon: any
  text: string
}) {
  return (
    <IconWrapper url={location.href} className='col-span-1'>
      <div className='flex flex-col items-center gap-[0.625rem]'>
        <Image
          src={Icon}
          alt={`Share this page to ${text}`}
          width={45}
          height={45}
        />

        <Typography
          type='body'
          className='!text-xs !leading-[1.05rem] tracking-medium text-grayMedium'
        >
          {text}
        </Typography>
      </div>
    </IconWrapper>
  )
}

export default ShareModal
