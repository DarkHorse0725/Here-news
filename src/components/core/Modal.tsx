import React, { ReactNode } from 'react'
import Image from 'next/image'
import crossIcon from 'assets/cross.svg'
import Pattern from 'assets/pattern.png'

interface IModal {
  onClose: () => any
  showCloseButton?: boolean
  children: ReactNode
  isVisible: Boolean
  className?: string
  closeBtnClass?: string
}

function Modal({
  onClose,
  showCloseButton,
  children,
  isVisible,
  className,
  closeBtnClass
}: IModal) {
  return (
    isVisible && (
      <div
        className={`
        fixed top-0 left-0 w-screen h-screen items-center justify-center z-40 bg-[rgba(0,0,0,0.4)]
        ${isVisible ? 'flex' : 'hidden'} ${className}
      `}
        onClick={async e =>
          e.target === e.currentTarget ? await onClose() : () => {}
        }
      >
        <div className='rounded-lg bg-white relative'>
          {showCloseButton && (
            <button
              className={`cursor-pointer text-black absolute z-40 right-6 top-4 h-6 w-6 bg-stroke rounded-[0.25rem] ${closeBtnClass}`}
              onClick={onClose}
            >
              <Image alt='cross' src={crossIcon} />
            </button>
          )}

          <div
            className='absolute w-full h-full opacity-[0.15]'
            style={{
              background: `url(${Pattern.src})`,
              backgroundBlendMode: 'color-burn'
            }}
          />
          <div className='sticky z-39'>{children}</div>
        </div>
      </div>
    )
  )
}

export default Modal
