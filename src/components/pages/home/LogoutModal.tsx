import Modal from 'components/core/Modal'
import Button from 'components/core/Button'
import Typography from 'components/core/Typography'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { useQueryClient } from 'react-query'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { setIsLogoutModalVisible } from 'store/slices/app.slice'
import { logout } from 'store/slices/auth.slice'
import Pattern from 'assets/pattern.png'

const LogoutModal = () => {
  const isLogoutModalVisible = useAppSelector(
    state => state.app.isLogoutModalVisible
  )
  const dispatch = useAppDispatch()
  const router = useRouter()
  const queryClient = useQueryClient()

  const closeModal = useCallback(() => {
    dispatch(setIsLogoutModalVisible(false))
  }, [dispatch])

  const logoutUser = useCallback(() => {
    dispatch(logout())
    dispatch(setIsLogoutModalVisible(false))
    queryClient.invalidateQueries()
    router.asPath !== '/' && router.push('/')
  }, [dispatch, queryClient, router])

  return (
    <Modal isVisible={isLogoutModalVisible} onClose={closeModal}>
      <div
        className='flex flex-col items-center gap-4 rounded-lg p-8 border border-stroke bg-blend-luminosity'
        style={{
          background: `url("${Pattern.src}"), #FFFFFF;`
        }}
      >
        <Typography
          type='subtitle'
          className='!text-2xl !leading-[2.1rem] font-medium text-grayMedium'
        >
          Logout Confirmation
        </Typography>
        <Typography
          type='body'
          className='!text-base !leading-[1.6rem] text-grayMd'
        >
          Are you sure you want to logout?
        </Typography>
        <div className='flex flex-row items-stretch gap-4'>
          <Button
            onClick={closeModal}
            className='!bg-baseWhite flex-1 sm:w-[11.5625rem] !h-12 !text-primary !text-base !leading-[1.2rem] tracking-medium !font-medium !border !border-stroke grid place-items-center rounded-lg !px-6 !py-2'
          >
            Cancel
          </Button>

          <Button
            onClick={logoutUser}
            className='bg-primary flex-1 sm:w-[11.5625rem] !h-12 !text-baseWhite !text-base !leading-[1.2rem] tracking-medium !font-medium !border !border-stroke grid place-items-center rounded-lg !px-6 !py-2'
          >
            Logout
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default LogoutModal
