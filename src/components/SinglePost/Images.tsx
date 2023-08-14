import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { getTypeMedia } from 'utils'
import ShowImagesModal from 'components/pages/home/ShowImagesModal'

interface ImagesProps {
  height?: string
  images: string[] | undefined
}

function Images({ images, height }: ImagesProps) {
  const [center_video_url, setCenterVideoUrl] = useState<string>('')
  const [all_images, setAllImages] = useState<string[] | null>(null)
  const [selectedImage, setSelectedImage] = useState<number>()

  const toggleImageModal = useCallback(
    () => setSelectedImage(undefined),
    []
  )

  useEffect(() => {
    if (images) {
      const videoArray = images.filter(
        item => getTypeMedia(item) === 'video'
      )

      if (videoArray?.length) {
        setCenterVideoUrl(videoArray[0])
      } else setCenterVideoUrl('')

      const imageArray = images.filter(
        item => getTypeMedia(item) === 'image'
      )

      setAllImages([...imageArray])
    }
  }, [images])

  const handleImageError = (index: number) => {
    if (!all_images) return
    const tempImages = [...all_images]
    tempImages[
      index
    ] = `https://dummyimage.com/600x400/53389e/ffffff&text=${encodeURIComponent(
      'Image not found'
    )}`
    setAllImages(tempImages)
  }

  return (
    <>
      <div className='flex flex-row flex-wrap gap-2 justify-between items-center'>
        {center_video_url && (
          <video className='w-full' controls>
            <source src={center_video_url} />
          </video>
        )}
        {images && all_images && all_images.length <= 4
          ? all_images
              .slice(0, all_images.length)
              .map((item, index) => (
                <div
                  className='cursor-pointer flex-[41%] p-1 relative'
                  key={item + ' ' + index}
                  onClick={() => setSelectedImage(index)}
                >
                  <div
                    className={`w-full ${
                      all_images.length === 1
                        ? 'h-[100px] md:h-[250px]'
                        : 'h-[100px] md:h-[250px]'
                    } ${height || ''}`}
                  >
                    {getTypeMedia(item) === 'image' && (
                      <Image
                        src={item}
                        fill
                        alt='post image'
                        quality={20}
                        className='object-cover'
                        onError={() => handleImageError(index)}
                      />
                    )}
                  </div>
                </div>
              ))
          : images &&
            all_images &&
            all_images.slice(0, 4).map((item, index) => (
              <div
                className='cursor-pointer flex-[41%] p-1 relative'
                key={item + ' ' + index}
                onClick={() => setSelectedImage(index)}
              >
                <div
                  className={`w-full ${
                    all_images.length === 1
                      ? 'h-[100px] md:h-[250px]'
                      : 'h-[100px] md:h-[250px]'
                  }${height || ''}`}
                >
                  {getTypeMedia(item) === 'image' && (
                    <Image
                      src={item}
                      fill
                      alt='post image'
                      quality={20}
                      className='object-cover'
                    />
                  )}
                </div>
                {index == 3 && (
                  <div className='flex flex-row absolute bg-[rgba(0,0,0,0.5)] justify-center items-center top-0 left-0 w-full h-full'>
                    <p className='font-bold text-4xl text-white'>
                      +{all_images.length - 4}
                    </p>
                  </div>
                )}
              </div>
            ))}
      </div>

      {selectedImage !== undefined && all_images && (
        <ShowImagesModal
          images={all_images}
          initialIndex={selectedImage}
          showImagesVisible={selectedImage !== undefined}
          toggleShowImagesVisible={toggleImageModal}
        />
      )}
    </>
  )
}

export default Images
