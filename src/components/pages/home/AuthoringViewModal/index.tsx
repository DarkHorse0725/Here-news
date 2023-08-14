import React, { useEffect } from 'react'
import CreatePost from 'modules/Post/Create'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { resetEditor } from 'store/slices/editor.slice'
import EditPost from 'modules/Post/Edit'
import Icon from 'components/core/Icon'

function AuthoringViewModal() {
  const { isModalVisible, post } = useAppSelector(
    state => state.editor
  )
  const dispatch = useAppDispatch()

  useEffect(() => {
    return () => {
      localStorage.removeItem('pickedFilesCount')
    }
  }, [])

  const handleCloseModal = () => {
    isModalVisible && dispatch(resetEditor())
  }

  return isModalVisible ? (
    <div className='fixed top-0 right-0 bottom-0 left-0 bg-primary bg-opacity-30 grid place-items-center z-40 backdrop-blur-xs'>
      <div className='rounded-lg p-4 flex flex-col bg-baseWhite border border-stroke max-w-[48.5rem] w-full max-h-[90%] overflow-y-auto authoringViewModal'>
        {/* Authoring Section */}
        <div className='flex flex-col items-end'>
          <Icon
            name='close'
            size={24}
            onClick={handleCloseModal}
            noShadow
            noHighlights
            iconClassName='text-grayL'
            className='p-3 rounded-lg bg-baseWhite'
          />
        </div>

        {/* Publish Button */}
        {post ? <EditPost {...post} /> : <CreatePost />}
      </div>
    </div>
  ) : (
    <></>
  )
}

export default AuthoringViewModal
