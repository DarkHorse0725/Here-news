import Modal from 'components/core/Modal'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import { getTypeMedia } from 'utils'

interface ShowImagesModalProps {
  showImagesVisible: boolean
  toggleShowImagesVisible: () => void
  images: string[]
  initialIndex: number
}

function ShowImagesModal({
  showImagesVisible,
  toggleShowImagesVisible,
  images,
  initialIndex
}: ShowImagesModalProps) {
  const [allImages, setAllImages] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleImageError = (index: number) => {
    if (!allImages) return
    const tempImages = [...allImages]
    tempImages[
      index
    ] = `https://dummyimage.com/900x700/53389e/ffffff&text=${encodeURIComponent(
      'Image not found'
    )}`
    setAllImages(tempImages)
  }

  useEffect(() => {
    if (showImagesVisible) {
      setAllImages(images)
      setSelectedIndex(initialIndex)
    }
  }, [showImagesVisible, initialIndex, images])

  const goBack = useCallback(() => {
    if (selectedIndex <= 0) return
    setSelectedIndex(selectedIndex - 1)
  }, [selectedIndex])

  const goForward = useCallback(() => {
    if (selectedIndex >= images.length - 1) return
    setSelectedIndex(selectedIndex + 1)
  }, [selectedIndex, images])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        toggleShowImagesVisible()
      } else if (event.code === 'ArrowLeft') {
        goBack()
      } else if (event.code === 'ArrowRight') {
        goForward()
      }
    }

    if (showImagesVisible)
      window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showImagesVisible, goBack, goForward, toggleShowImagesVisible])

  return (
    <Modal
      isVisible={showImagesVisible}
      onClose={toggleShowImagesVisible}
      showCloseButton
    >
      <div className='w-screen h-screen overflow-y-scroll rounded-lg flex flex-row'>
        <div className='w-12 flex items-center justify-center'>
          <div
            className={`${
              selectedIndex === 0 ? 'hidden' : 'flex'
            } cursor-pointer rounded-full bg-black flex-row items-center justify-center w-8 h-8`}
            onClick={goBack}
          >
            <p className='text-lg text-white'>&lt;</p>
          </div>
        </div>
        <div className='relative w-[calc(100%-96px)] my-2 flex justify-center items-center'>
          <div className='absolute bottom-0 w-full z-[1]'>
            <div className='flex items-center justify-center p-4 z-[1]'>
              <p className='text-white bg-[rgba(0,0,0,0.7)] px-4 py-2 rounded-lg font-semibold'>
                {selectedIndex + 1} / {allImages.length}
              </p>
            </div>
          </div>
          {allImages && allImages.length ? (
            getTypeMedia(allImages[selectedIndex]) === 'image' ||
            allImages[selectedIndex].includes(
              'Image%20not%20found'
            ) ? (
              <Image
                src={allImages[selectedIndex]}
                fill
                className='object-contain'
                alt='show image'
                onError={() => handleImageError(selectedIndex)}
              />
            ) : getTypeMedia(allImages[selectedIndex]) === 'video' ? (
              <video
                style={{
                  width: 'fit-content',
                  height: 'fit-content'
                }}
                controls
              >
                <source src={allImages[selectedIndex]} />
              </video>
            ) : (
              <React.Fragment />
            )
          ) : (
            ''
          )}
        </div>
        <div className='w-12 flex items-center justify-center'>
          <div
            className={`${
              selectedIndex === allImages.length - 1
                ? 'hidden'
                : 'flex'
            } cursor-pointer rounded-full bg-black flex-row items-center justify-center w-8 h-8`}
            onClick={goForward}
          >
            <p className='text-lg text-white'>&gt;</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ShowImagesModal
