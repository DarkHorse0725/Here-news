import {
  EditorComponent,
  Remirror,
  useRemirror
} from '@remirror/react'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useFormContext } from 'react-hook-form'
import {
  RemirrorEventListener,
  prosemirrorNodeToHtml
} from 'remirror'
import {
  BoldExtension,
  BulletListExtension,
  HardBreakExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  BlockquoteExtension,
  UnderlineExtension
} from 'remirror/extensions'
import 'remirror/styles/all.css'
import FloatingLinkEditor from './floatingLinkEditor'
import styles from './index.module.css'
import RichTextEditorCustomToolBar from './toolbar'
import { TLDs } from 'const'
import useFiles from 'hooks/useFiles'
import Image from 'next/image'
import { CustomFileExtension } from './fileExtension'
import Loader from 'components/Loader'
import { CustomImageExtension } from './imageExtension'

interface IRichTextEditor {
  content?: string
  name: string
  placeholder?: string
  hookToForm?: boolean
  className?: string
  autoFocusContentEditor?: boolean
  onChange: (text: string) => void
}

function RichTextEditor({
  name,
  placeholder,
  content,
  hookToForm,
  onChange,
  autoFocusContentEditor,
  className
}: IRichTextEditor) {
  const [isRegistered, setIsRegistered] = useState<boolean>()
  const formContext = useFormContext()

  const isFullyHooked = useMemo(
    () => name && hookToForm && formContext,
    [name, hookToForm, formContext]
  )

  const editorContent = useMemo<string>(
    () =>
      hookToForm && isFullyHooked && name
        ? formContext.getValues(name)
        : content,
    [content, formContext, hookToForm, isFullyHooked, name]
  )

  const { uploadFileAsync } = useFiles()

  const { manager, state } = useRemirror({
    extensions: () => [
      new HeadingExtension(),
      new BlockquoteExtension(),
      new BoldExtension(),
      new ItalicExtension(),
      new LinkExtension({
        autoLink: true,
        autoLinkAllowedTLDs: TLDs,
        defaultTarget: '_blank',
        defaultProtocol: 'https:'
      }),
      new BulletListExtension({ enableSpine: true }),
      new HardBreakExtension(),
      new UnderlineExtension(),
      new CustomImageExtension({
        enableResizing: true
      }),
      new CustomFileExtension({
        uploadFileHandler: () => {
          let fileToBeUploaded: File

          return {
            insert: file => {
              fileToBeUploaded = file

              return {
                fileType: file.type,
                url: undefined
              }
            },
            upload: async () => {
              const url = await uploadFileAsync(fileToBeUploaded)
              return { url }
            },
            abort: () => {}
          }
        },
        render: props => {
          const { url, fileType: type } = props.node.attrs

          if (!url) {
            return <Loader color='text-red-500' />
          }

          if (!type || typeof type !== 'string') {
            throw 'Invalid file provided'
          } else if (type.startsWith('video')) {
            return <video src={url} controls />
          } else if (type.startsWith('audio')) {
            return <audio src={url} controls />
          } else if (type.startsWith('image')) {
            return (
              <Image
                width={400}
                height={400}
                src={url}
                alt='Picked image'
              />
            )
          } else {
            return <></>
          }
        }
      })
    ],
    content: editorContent,
    selection: 'start',
    stringHandler: 'html'
  })

  const onTextChange = useCallback<
    RemirrorEventListener<Remirror.Extensions>
  >(
    async event => {
      const text = prosemirrorNodeToHtml(event.state.doc)

      if (isFullyHooked && name) {
        formContext.setValue(name, text)
      }

      onChange(text)
    },
    [formContext, isFullyHooked, name, onChange]
  )

  const dismissFieldError = () => {
    if (isFullyHooked) formContext.clearErrors(name)
  }

  // Register the form initially
  useEffect(() => {
    if (isFullyHooked && !isRegistered) {
      formContext.register(name)
      setIsRegistered(true)
    }
  }, [formContext, isRegistered, isFullyHooked, name])

  return (
    <Remirror
      manager={manager}
      initialContent={state}
      onChange={onTextChange}
      classNames={[
        'px-4 pb-4 bg-historic flex flex-col gap-4 outline-none rounded-lg min-h-[6.875rem] max-h-[50vh]',
        styles.editor,
        className
      ]}
      autoFocus={autoFocusContentEditor}
      placeholder={placeholder}
      onBlur={dismissFieldError}
    >
      <RichTextEditorCustomToolBar />
      <EditorComponent />
      <FloatingLinkEditor />
    </Remirror>
  )
}

RichTextEditor.defaultProps = {
  placeholder: ''
}

export default RichTextEditor
