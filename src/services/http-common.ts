import axios, { AxiosRequestConfig } from 'axios'
import { ENV } from 'lib/env'
import { getTokenFromCookies } from 'lib/token'
import { setSessionExpired } from 'store/slices/app.slice'
import { store } from '../store'

const API_URL = ENV.API_URL

// set headers
const setHeaders = async () => {
  let token = getTokenFromCookies()
  const headers: {
    'Content-type': string
    Authorization?: string
  } = {
    'Content-type': 'application/json'
  }
  if (token !== undefined) {
    headers['Authorization'] = `Bearer ${token}`
  }
  //force logout if user is logged in and doesnot have token
  else if (
    store.getState().auth?.selectedAccount &&
    token !== undefined
  ) {
    sessionExpired()
  }
  axios.defaults.headers.common = headers
}

const sessionExpired = () => {
  store.dispatch(setSessionExpired(true))
}

// global api
const http = {
  async get(endpoint: string, config?: AxiosRequestConfig<any>) {
    await setHeaders()

    try {
      const req = await axios.get(`${API_URL}${endpoint}`, config)
      return req
    } catch (e: any) {
      if (
        e &&
        e.response &&
        e.response.data &&
        e.response.data.status === 'invalid_token'
      ) {
        sessionExpired()
      } else return e
    }
  },
  async post(
    endpoint: string,
    params: any,
    config?: AxiosRequestConfig<any>
  ) {
    await setHeaders()

    try {
      const req = await axios.post(
        `${API_URL}${endpoint}`,
        params,
        config
      )
      return req
    } catch (e: any) {
      if (
        e &&
        e.response &&
        e.response.data &&
        e.response.data.status === 'invalid_token'
      ) {
        sessionExpired()
      } else return e
    }
  },
  async put(
    endpoint: string,
    params?: any,
    config?: AxiosRequestConfig<any>
  ) {
    await setHeaders()

    try {
      const req = await axios.put(
        `${API_URL}${endpoint}`,
        params,
        config
      )
      return req
    } catch (e: any) {
      if (
        e &&
        e.response &&
        e.response.data &&
        e.response.data.status === 'invalid_token'
      ) {
        sessionExpired()
      } else return e
    }
  },
  async patch(
    endpoint: string,
    params?: any,

    config?: AxiosRequestConfig<any>
  ) {
    await setHeaders()

    try {
      const req = await axios.patch(
        `${API_URL}${endpoint}`,
        params,
        config
      )
      return req
    } catch (e: any) {
      if (
        e &&
        e.response &&
        e.response.data &&
        e.response.data.status === 'invalid_token'
      ) {
        sessionExpired()
      } else return e
    }
  },
  async delete(endpoint: string, config?: AxiosRequestConfig<any>) {
    await setHeaders()

    try {
      const req = await axios.delete(`${API_URL}${endpoint}`, config)
      return req
    } catch (e: any) {
      if (
        e &&
        e.response &&
        e.response.data &&
        e.response.data.status === 'invalid_token'
      ) {
        sessionExpired()
      } else return e
    }
  }
}

export default http
