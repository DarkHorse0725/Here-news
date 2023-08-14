import { useActive, useCommands } from '@remirror/react'
import React from 'react'
import Icon from 'components/core/Icon'
import FilePicker from './FilePicker'
import Tooltip from 'components/Tooltip'

function RichTextEditorCustomToolBar() {
  const {
    focus,
    toggleBold,
    toggleItalic,
    removeLink,
    selectLink,
    toggleHeading,
    toggleBulletList,
    toggleUnderline,
    toggleBlockquote
  } = useCommands()
  const active = useActive()

  return (
    <div className='flex flex-row flex-wrap items-center bg-historic p-2 gap-1'>
      {/* Heading */}
      <Tooltip
        id='headingButton'
        message='Heading'
        className='p-1 grid place-items-center'
      >
        <button
          type='button'
          onClick={() => {
            toggleHeading({ level: 2 })
            focus()
          }}
        >
          <Icon
            color={
              active.heading({ level: 2 }) ? '#53389E' : '#ADB3BD'
            }
            className='h-5 w-5 sm:h-6 sm:w-6'
            name='heading'
            raw
          />
        </button>
      </Tooltip>

      {/* Bold */}
      <Tooltip
        id='boldButton'
        message='Bold'
        className='p-1 grid place-items-center'
      >
        <button
          type='button'
          onClick={() => {
            toggleBold()
            focus()
          }}
        >
          <Icon
            color={active.bold() ? '#53389E' : '#ADB3BD'}
            className='h-5 w-5 sm:h-6 sm:w-6'
            name='bold'
            raw
          />
        </button>
      </Tooltip>

      {/* Italic */}
      <Tooltip
        id='italicButton'
        message='Italic'
        className='p-1 grid place-items-center'
      >
        <button
          type='button'
          onClick={() => {
            toggleItalic()
            focus()
          }}
        >
          <Icon
            color={active.italic() ? '#53389E' : '#ADB3BD'}
            className='h-5 w-5 sm:h-6 sm:w-6'
            name='italic'
            raw
          />
        </button>
      </Tooltip>

      {/* Underline */}
      <Tooltip
        id='underlineButton'
        message='Underline'
        className='p-1 grid place-items-center'
      >
        <button
          type='button'
          onClick={() => {
            toggleUnderline()
            focus()
          }}
        >
          <Icon
            color={active.underline() ? '#53389E' : '#ADB3BD'}
            className='h-5 w-5 sm:h-6 sm:w-6'
            name='underline'
            raw
          />
        </button>
      </Tooltip>

      {/* List */}
      <Tooltip
        id='listButton'
        message='Bullet List'
        className='p-1 grid place-items-center'
      >
        <button
          type='button'
          onClick={() => {
            toggleBulletList()
            focus()
          }}
        >
          <Icon
            color={active.bulletList() ? '#53389E' : '#ADB3BD'}
            className='h-5 w-5 sm:h-6 sm:w-6'
            name='bullet-list'
            raw
          />
        </button>
      </Tooltip>

      {/* Quote */}
      <Tooltip
        id='quoteButton'
        message='Quote'
        className='p-1 grid place-items-center'
      >
        <button
          type='button'
          onClick={() => {
            toggleBlockquote()
            focus()
          }}
        >
          <Icon
            color={active.blockquote() ? '#53389E' : '#ADB3BD'}
            className='h-5 w-5 sm:h-6 sm:w-6'
            name='quote'
            raw
          />
        </button>
      </Tooltip>

      {/* Image */}
      <Tooltip
        id='filePickerButton'
        message='Add audio, video or images'
        className='p-1 grid place-items-center'
      >
        <FilePicker />
      </Tooltip>

      {/* Link */}
      {active.link() && (
        <Tooltip
          id='boldButton'
          message='Remove Link'
          className='p-1 grid place-items-center'
        >
          <button
            type='button'
            onClick={() => {
              active.link() ? removeLink() : selectLink()
              focus()
            }}
          >
            <Icon
              color={active.link() ? '#53389E' : '#ADB3BD'}
              className='h-5 w-5 sm:h-6 sm:w-6'
              name='link'
              raw
            />
          </button>
        </Tooltip>
      )}
    </div>
  )
}

export default RichTextEditorCustomToolBar
