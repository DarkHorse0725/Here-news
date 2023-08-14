import { combineReducers, configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import authReducer from './slices/auth.slice'
import appReducer from './slices/app.slice'
import editorReducer from './slices/editor.slice'
import notificationReducer from './slices/notification.slice'

const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  notificaiton: notificationReducer,
  editor: editorReducer
})

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
