import Cookies from 'js-cookie'

export const getToken = async () => {
  try {
    const token = await localStorage.getItem('token')
    return token
  } catch (error) {
    return
  }
}

export const getUserId = () => {
  try {
    const userId = localStorage.getItem('userId')
    return userId
  } catch (error) {
    return
  }
}

export function setToken(token: string) {
  localStorage.setItem('token', token)
}

export function removeToken() {
  localStorage.removeItem('token')
}

export const setTokenInCookies = (
  token: string,
  expires?: number
) => {
  Cookies.set('token', token, {
    expires,
    secure: true,
    sameSite: 'Strict'
  })
}

export function getTokenFromCookies() {
  const token = Cookies.get('token')
  return token
}

export function removeTokenFromCookies() {
  Cookies.remove('token')
}

export default setToken
