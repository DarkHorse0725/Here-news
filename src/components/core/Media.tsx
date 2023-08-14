import Image from 'next/image'
import { DetailedHTMLProps, VideoHTMLAttributes } from 'react'
import { IoClose } from 'react-icons/io5'
import Loader from 'react-loading'

interface IMedia {
  isRemoveable?: boolean
  isProcessing?: boolean
  onRemove?: () => void
  // size: cover will take full width and auto height
  // size: tile will take 48x48 size
  size: 'tile' | 'cover' | 'icon'
  type: 'video' | 'image'
  link?: string
  containerClasses?: string
  className?: string
  videoProps?: DetailedHTMLProps<
    VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >
}

const sizes = {
  tile: {
    container: 'w-fit',
    media: 'w-12 h-12 rounded-2xl bg-black',
    removeButton: 'p-1 -top-2 -right-2',
    processOverlay: 'rounded-2xl'
  },
  cover: {
    container: 'w-full',
    media: 'w-full bg-black',
    removeButton: '-top-4 -right-4 p-2 text-2xl',
    processOverlay: ''
  },
  icon: {
    container: 'w-fit',
    media: 'w-4 h-4',
    removeButton: false,
    processOverlay: false
  }
}

function Media({
  type,
  link,
  isRemoveable,
  isProcessing,
  onRemove,
  size,
  className,
  videoProps,
  containerClasses
}: IMedia) {
  return (
    <div
      className={
        containerClasses
          ? containerClasses
          : `flex relative ${sizes[size].container}`
      }
    >
      {isProcessing && (
        <div
          className={`absolute bg-[rgba(0,0,0,0.5)] top-0 left-0 w-full h-full z-[1] flex justify-center items-center ${sizes[size].processOverlay}`}
        >
          <Loader type='spin' color='white' width={25} height={25} />
        </div>
      )}
      {isRemoveable && (
        <button
          type='button'
          className={`absolute z-[1] bg-black text-white rounded-full ${sizes[size].removeButton}`}
          onClick={onRemove}
        >
          <IoClose className='text-white fill-white' />
        </button>
      )}
      {type === 'video' && link && (
        <video
          muted
          {...(size === 'cover' && { controls: true })}
          className={`${sizes[size].media} ${
            className ? className : ''
          }`}
          {...videoProps}
        >
          <source src={link}></source>
        </video>
      )}
      {type === 'image' && link && (
        <div className={`relative ${sizes[size].media}`}>
          <Image
            src={link}
            fill
            alt='media file'
            className={sizes[size].media}
          />
        </div>
      )}
    </div>
  )
}

Media.defaultProps = {
  isRemoveable: false,
  size: 'cover'
}

export default Media
