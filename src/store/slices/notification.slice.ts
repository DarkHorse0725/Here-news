import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from 'types/interfaces'

export interface INewPostData {
  user: IUser
  postId: string
  title: string
}

type NotificationState = {
  newPosts: INewPostData[] | null
}

const initialState: NotificationState = {
  newPosts: null
}

export const notification = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNewPosts: (state, action: PayloadAction<INewPostData>) => {
      const newPost = action.payload
      const tempNewPosts = state.newPosts ? state.newPosts : []
      const findNewUser = tempNewPosts.find(
        element => element.user._id == newPost.user._id
      )
      if (!findNewUser) state.newPosts = [...tempNewPosts, newPost]
    },
    removeNewPost: (
      state,
      action: PayloadAction<{ postId: string }>
    ) => {
      if (!state.newPosts) return

      const postId = action.payload.postId
      const tempNewPosts = [...state.newPosts]

      tempNewPosts.splice(
        tempNewPosts.findIndex(post => post.postId === postId),
        1
      )

      state.newPosts = [...tempNewPosts]
    },
    removeAllPosts: state => {
      state.newPosts = []
    }
  }
})

// actions
export const { setNewPosts, removeNewPost, removeAllPosts } =
  notification.actions

export default notification.reducer
