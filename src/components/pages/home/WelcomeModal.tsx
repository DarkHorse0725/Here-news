import Modal from 'components/core/Modal'
import React from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { toggleIsWelcomeModalVisible } from 'store/slices/auth.slice'
import CheckCircle from 'assets/check-circle.svg'
import Image from 'next/image'
import Button from 'components/core/Button'
import Typography from 'components/core/Typography'

interface WelcomeModalProps {
  isWelcomeVisible: boolean
  toggleIsWelcomeVisible: () => void
}

const WelcomeModal = ({
  isWelcomeVisible,
  toggleIsWelcomeVisible
}: WelcomeModalProps) => {
  const dispatch = useAppDispatch()
  const isGlobalModalVisible = useAppSelector(
    state => state.auth && state.auth.isWelcomeModalVisible
  )
  const { balance } = useAppSelector(
    state => state.auth && state.auth
  )
  const handleCloseModal = () => {
    isGlobalModalVisible &&
      dispatch(toggleIsWelcomeModalVisible(false))
    isWelcomeVisible && toggleIsWelcomeVisible()
  }
  return (
    <Modal
      isVisible={isWelcomeVisible || isGlobalModalVisible}
      onClose={handleCloseModal}
      className='bg-primary bg-opacity-[0.45] backdrop-blur-xs'
    >
      <div className='w-[18.75rem] sm:w-[31.25rem] flex flex-col items-center justify-center gap-4 p-8'>
        <Image src={CheckCircle} alt='checl' height={46} width={46} />
        <p className='text-xl sm:text-2xl font-medium text-grayMedium leading-[140%]'>
          Welcome to Here!
        </p>
        <p className='text-sm sm:text-base mt-2 text-grayMd leading-[160%]'>
          You have received {balance} Micro tokens to get started.
        </p>
        <Button
          type='submit'
          size='small'
          outlined={false}
          className='py-1 mt-4 px-6 rounded-lg w-full h-10 sm:h-12 !bg-primary'
          onClick={handleCloseModal}
        >
          <Typography
            type='button'
            className='text-baseWhite !text-sm sm:!text-base leading-[1.2rem] tracking-medium font-medium'
          >
            Continue
          </Typography>
        </Button>
      </div>
    </Modal>
  )
}

export default WelcomeModal
