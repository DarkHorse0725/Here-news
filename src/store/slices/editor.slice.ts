import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPost } from 'types/interfaces'

type EditorState = {
  isModalVisible: boolean
  post?: IPost
}

const initialState: EditorState = {
  isModalVisible: false
}

export const editor = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    showEditorModal: (
      state,
      action: PayloadAction<IPost | undefined>
    ) => {
      state.post = action.payload
      state.isModalVisible = true
    },

    resetEditor: state => {
      state.post = undefined
      state.isModalVisible = false
    }
  }
})

// actions
export const { showEditorModal, resetEditor } = editor.actions

export default editor.reducer
