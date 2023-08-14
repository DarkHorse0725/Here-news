import React, { ReactNode, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

interface ModalProps {
  isVisible: boolean
  toggleVisible: () => void
  hasCloseButton?: boolean
  whiteCloseButton?: boolean
  children: ReactNode
  className?: string
}
function Modal({
  isVisible,
  toggleVisible,
  hasCloseButton,
  whiteCloseButton,
  className,
  children
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto'
  }, [isVisible])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        toggleVisible()
      }
    }

    if (isVisible) window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [toggleVisible, isVisible])

  return (
    <div
      className='fixed top-0 left-0 w-screen h-screen items-center justify-center z-40'
      style={{
        display: isVisible ? 'flex' : 'none'
      }}
    >
      <div
        className={`bg-[rgba(0,0,0,0.4)] w-screen h-screen z-20 fixed top-0 left-0 ${className}`}
        onClick={toggleVisible}
      />
      <div className='rounded-lg z-30'>
        <div className='relative rounded-md'>
          {hasCloseButton && (
            <div
              className='absolute top-3 right-3 cursor-pointer z-20'
              onClick={toggleVisible}
            >
              <AiOutlineClose
                className={`h-6 w-6 ${
                  whiteCloseButton ? 'text-white' : ''
                }`}
              />
            </div>
          )}
          {isVisible && children}
        </div>
      </div>
    </div>
  )
}

export default Modal
