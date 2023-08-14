import CustomImage from 'components/core/Image'
import React from 'react'

interface Props {
  cardImage?: {
    src?: string
    isVideo: boolean
  }
}

const ItemImage = ({ cardImage }: Props) => {
  if (!cardImage?.src) {
    return <></>
  }

  return (
    <div className='relative w-full h-[9.1875rem] rounded-[0.5375rem] overflow-hidden bg-pearl'>
      {!cardImage?.isVideo ? (
        <CustomImage
          alt='Image for a search card'
          fill
          sizes='30vw'
          src={cardImage.src}
          className='h-full w-full object-cover object-center'
          fallbackClassName='h-full w-full bg-cover bg-center'
        />
      ) : (
        <div className='absolute top-0 left-0 right-0 bottom-0'>
          <video autoPlay={false}>
            <source src={cardImage?.src} />
          </video>

          {/* Overlay to prevent video */}
          <div className='absolute top-0 left-0 right-0 bottom-0' />
        </div>
      )}
    </div>
  )
}

export default ItemImage
