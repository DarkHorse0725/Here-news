import useClickOutside from 'hooks/useClickOutside'
import * as React from 'react'

interface IPopoverFucChild {
  toggleModal: () => void
}

interface PopoverProps {
  children?: [React.ReactNode, (props: IPopoverFucChild) => any]
  className?: string
}

export default function Popover({
  children,
  className
}: PopoverProps) {
  const [openModal, setOpenModal] = React.useState(false)

  const toggleModal = (e: any) => {
    e.stopPropagation()
    if (openModal) return setOpenModal(false)
    setOpenModal(prev => !prev)
  }

  const { ref: modalRef } = useClickOutside({
    shouldRegister: openModal,
    onOutsideClick: () => setOpenModal(false)
  })

  return (
    <div className='relative grid place-items-center' ref={modalRef}>
      <div
        className='grid place-items-center cursor-pointer'
        onClick={toggleModal}
      >
        {children && children[0]}
      </div>
      {openModal && (
        <div
          className={`${
            className || ''
          } absolute top-[30px] w-max z-10`}
        >
          {children &&
            typeof children[1] !== 'function' &&
            children[1]}
          {children &&
            typeof children[1] === 'function' &&
            (children[1] as any)({
              toggleModal
            })}
        </div>
      )}
    </div>
  )
}
