import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import http from 'services/http-common'
import { useAppSelector } from 'store/hooks'
import RegisterModal from 'components/pages/home/RegisterModal'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Logo from '../assets/logo.png'
import { useDispatch } from 'react-redux'
import { logout, setBalance } from 'store/slices/auth.slice'

interface IInviteAccept {
  inviteToken: string
  useremail: string
}

export default function Registration() {
  const { selectedAccount } = useAppSelector(state => state.auth)
  const [data, setData] = useState({})

  let router = useRouter()
  const dispatch = useDispatch()

  let checkInvite = useMutation(
    (user: IInviteAccept) => {
      return http.post(`/invite-check`, user)
    },
    {
      onSuccess: data => {
        if (!data?.data?.success) {
          toast.error(data?.response?.data?.error?.message)
          router.push('/')
        }
      },
      onError: () => {
        toast.error('Invite is not valid or expire')
        router.push('/')
      }
    }
  )

  let chkInvite = () => {
    checkInvite.mutate({
      useremail: router?.query?.email as string,
      inviteToken: router?.query?.token as string
    })
  }
  const [inviteChecked, setInviteChecked] = useState(false)

  useEffect(() => {
    if (
      router?.query?.email &&
      router?.query?.token &&
      selectedAccount?.displayName
    ) {
      dispatch(logout())
    }
    if (
      router?.query?.email &&
      router?.query?.token &&
      !selectedAccount?.displayName &&
      !inviteChecked
    ) {
      setData(router?.query)
      dispatch(setBalance(Number(router?.query?.balance)))
      chkInvite()
      setInviteChecked(true)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return (
    <div className='min-h-screen w-screen'>
      <div className='w-screen flex justify-center items-center h-[60px] sm:h-[72px] bg-white'>
        <Image src={Logo} alt='Logo' height={32} width={76} />
      </div>
      <div className='w-full mt-[44px] mb-[116px] grid place-items-center'>
        <RegisterModal data={data} />
      </div>
    </div>
  )
}
