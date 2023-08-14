import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { removeTokenFromCookies } from 'lib/token'
import { IUser } from 'types/interfaces'

type AuthState = {
  selectedAccount: IUser | null
  isLoginModalVisible: boolean
  isForgotModalVisible: boolean
  isRegisterModalVisible: boolean
  isWelcomeModalVisible: boolean
  balance: number
}

const initialState: AuthState = {
  selectedAccount: null,
  isLoginModalVisible: false,
  isForgotModalVisible: false,
  isRegisterModalVisible: false,
  isWelcomeModalVisible: false,
  balance: 0
}

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedAccount: (state, action: PayloadAction<IUser>) => {
      const singleUser = action.payload
      localStorage.setItem('userId', singleUser._id)
      state.selectedAccount = singleUser
    },
    deductBalance: (state, action: PayloadAction<number>) => {
      if (!state.selectedAccount) return
      state.balance = Number(
        (state.balance - action.payload).toFixed(2)
      )

      state.selectedAccount.balance = Number(
        (state.selectedAccount.balance - action.payload).toFixed(2)
      )
    },
    toggleIsLoginModalVisible: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isLoginModalVisible = action.payload
    },

    toggleIsForgotModalVisible: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isForgotModalVisible = action.payload
    },
    toggleIsRegisterModalVisible: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isRegisterModalVisible = action.payload
    },
    toggleIsWelcomeModalVisible: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isWelcomeModalVisible = action.payload
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload
    },
    logout: state => {
      removeTokenFromCookies()
      localStorage.clear()
      state.selectedAccount = null
    }
  }
})

// actions
export const {
  setSelectedAccount,
  deductBalance,
  toggleIsLoginModalVisible,
  toggleIsForgotModalVisible,
  toggleIsRegisterModalVisible,
  toggleIsWelcomeModalVisible,
  setBalance,
  logout
} = authSlice.actions

export default authSlice.reducer
