import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import setLanguage from 'next-translate/setLanguage'

import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  logout,
  setBalance,
  setSelectedAccount
} from 'store/slices/auth.slice'
import {
  setSessionExpired,
  setLanguage as setAppLanguage
} from 'store/slices/app.slice'
import http from 'services/http-common'
import { getTokenFromCookies } from 'lib/token'

interface IWrapper {
  children: React.ReactNode
}
function Wrapper({ children }: IWrapper) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const sessionExpired = useAppSelector(
    state => state.app && state.app.sessionExpired
  )
  const language = useAppSelector(state =>
    state.app && state.app.language
      ? state.app.language
      : { code: 'en', loading: false }
  )

  const handleLogout = useCallback(() => {
    dispatch(logout())
    router.push('/')
    dispatch(setSessionExpired(false))
  }, [dispatch, router])

  //update user on refresh
  useEffect(() => {
    async function getUserData() {
      const userData = await http.get('/loginWithToken')
      if (userData && userData.data) {
        const { user } = userData.data.data
        dispatch(setSelectedAccount(user))
        dispatch(setBalance(user?.balance))
      }
    }

    const checkIfLoggedInUser = async () => {
      const token = getTokenFromCookies()
      if (token !== undefined) {
        getUserData()
      }
    }

    if (!router?.asPath.includes('registration')) {
      checkIfLoggedInUser()
    } else {
      dispatch(logout())
      dispatch(setSessionExpired(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  //check if session expired
  useEffect(() => {
    if (sessionExpired) {
      toast.error('Session has been expired. Please log in again!')
      handleLogout()
    }
  }, [sessionExpired, handleLogout])

  //set language
  useEffect(() => {
    setLanguage(language.code)
    dispatch(
      setAppLanguage({
        code: language.code,
        loading: false
      })
    )
  }, [dispatch, language.code])

  return <React.Fragment>{children}</React.Fragment>
}

export default Wrapper
