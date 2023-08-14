import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Language = { code: string; loading: boolean }

type AppState = {
  sessionExpired: boolean
  language: Language
  isSearchFocused: boolean
  isShareModalVisible: boolean
  shareModalData?: string
  isLogoutModalVisible: boolean
}

const initialState: AppState = {
  sessionExpired: false,
  language: { code: 'en', loading: false },
  isSearchFocused: false,
  isShareModalVisible: false,
  isLogoutModalVisible: false
}

export const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSessionExpired: (state, action: PayloadAction<boolean>) => {
      state.sessionExpired = action.payload
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload
    },
    changeIsSearchInputFocused: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isSearchFocused = action.payload
    },
    showShareModal: (
      state,
      action: PayloadAction<string | undefined>
    ) => {
      state.isShareModalVisible = true
      state.shareModalData = action.payload
    },
    hideShareModal: state => {
      state.isShareModalVisible = false
      state.shareModalData = undefined
    },
    setIsLogoutModalVisible: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isLogoutModalVisible = action.payload
    }
  }
})

// actions
export const {
  setSessionExpired,
  setLanguage,
  changeIsSearchInputFocused,
  showShareModal,
  hideShareModal,
  setIsLogoutModalVisible
} = app.actions

export default app.reducer
