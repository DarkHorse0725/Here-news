import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useFormContext } from 'react-hook-form'

type TAllowedMedia = 'video/*' | 'image/*'

interface IMediaPickerChild {
  openPicker: () => {}
  error: string
  files: FileList | undefined
  removeFileAtIndex: (index: number) => void
  removeGcpFileAtIndex: (index: number) => string[]
  removeAllFiles: () => string[]
  gcpFiles?: string[]
}

interface IMediaPicker {
  id?: string
  name?: string
  multiple?: boolean
  oldFiles?: string[]
  allowedMediaTypes: TAllowedMedia[]
  onUniqueFilesPicked?: (files: FileList) => any
  maxFileSizeInBits?: number
  maxFiles?: number
  children?: ReactNode | ((props: IMediaPickerChild) => any)
  hookToForm?: boolean
  initialFileList?: FileList
}

// [Utility]: can be seperated into its dedicated file
const convertFilesToFileList = (files: File[]) => {
  const list = new DataTransfer()
  files.map(file => list.items.add(file))
  return list.files
}

function MediaPicker({
  id,
  name,
  multiple,
  oldFiles,
  allowedMediaTypes,
  onUniqueFilesPicked,
  maxFiles,
  maxFileSizeInBits,
  children,
  initialFileList,
  hookToForm
}: IMediaPicker) {
  const formContext = useFormContext()
  const filePickerRef = useRef<HTMLInputElement | undefined>()
  const [files, setFiles] = useState<FileList | undefined>(
    initialFileList
  )
  const [gcpFiles, setGcpFiles] = useState<string[] | undefined>([])

  const [error, setError] = useState<
    string | null | boolean | undefined
  >()
  const [isRegistered, setIsRegistered] = useState<boolean>()
  const [filePickerKey, setFilePickerKey] = useState(12345)

  const openPicker = useCallback(() => {
    filePickerRef.current && filePickerRef.current.click()
  }, [])

  const isFullyHooked = useMemo(
    () => name && hookToForm && formContext,
    [name, hookToForm, formContext]
  )

  const fieldError = useMemo(
    () =>
      isFullyHooked &&
      name &&
      formContext?.formState?.errors?.[name]?.message,
    [isFullyHooked, formContext, name]
  )

  const handleFilesPicked = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    try {
      // return early if we have field error
      if (fieldError) {
        // [Important]: Reset the file input so it can be used again
        setFilePickerKey(Math.random() * 12345)
        return
      }

      // unset state
      setError(null)
      setFiles(undefined)

      const pickedFiles = e.target.files
      let uniquePickedFiles = pickedFiles

      // merge existing and picked files
      const newFiles = (() => {
        if (!pickedFiles) return files
        if (!files) return pickedFiles

        const tempExisting = Array.from(files)
        let tempPicked = Array.from(pickedFiles)

        // merger
        const merged = [...tempExisting].filter(x => {
          // compare name, lastmodified, size and type
          const foundIndex = tempPicked.findIndex(
            y =>
              y.name === x.name &&
              y.size === x.size &&
              y.type === x.type &&
              y.lastModified === x.lastModified
          )

          if (foundIndex >= 0) {
            delete tempPicked[foundIndex]
            tempPicked = tempPicked.filter(Boolean)
          }

          return x
        })
        uniquePickedFiles = convertFilesToFileList(tempPicked)
        merged.push(...tempPicked)

        // make new compatible list
        return convertFilesToFileList(merged)
      })()

      // validate if new files exist
      if (!newFiles) throw new Error('Files not located!')
      setFiles(newFiles)

      // update form validation state
      if (isFullyHooked && name) {
        formContext.setValue(name, newFiles)
        formContext.trigger([name])
      } else {
        // NOTE: only doing custom validation when form validation/context is not provided

        // validate if only max allowed files count is picked
        if (multiple && maxFiles && newFiles.length > maxFiles) {
          throw new Error(`Only ${maxFiles} files are allowed!`)
        }

        // validate if only max allowed files size is picked
        if (maxFileSizeInBits && newFiles.length) {
          for (let index = 0; index < newFiles.length; index++) {
            if (newFiles[index].size > maxFileSizeInBits) {
              throw new Error(
                `Only files less then ${Math.floor(
                  maxFileSizeInBits / 1024 / 1024
                )} mb are allowed!`
              )
            }
          }
        }
      }

      // fire the files pick callback (only on uniquely picked files)
      onUniqueFilesPicked &&
        uniquePickedFiles &&
        uniquePickedFiles.length > 0 &&
        (await onUniqueFilesPicked(uniquePickedFiles))
    } catch (error: any) {
      setError(error?.message || 'Failed to pick files')
      setFiles(undefined)

      if (isFullyHooked && name) {
        formContext.setValue(name, undefined)
        formContext.trigger([name])
      }
    } finally {
      // [Important]: Reset the file input so it can be used again
      setFilePickerKey(Math.random() * 12345)
    }
  }

  const removeFileAtIndex = useCallback(
    (index: number) => {
      if (files && files[index]) {
        const newFiles: FileList = (() => {
          let temp = Array.from(files)
          delete temp[index]
          temp = temp.filter(Boolean)

          return convertFilesToFileList(temp)
        })()

        setFiles(newFiles.length === 0 ? undefined : newFiles)

        if (isFullyHooked && name) {
          formContext.setValue(name, newFiles)
          formContext.trigger([name])
        }
      }
    },
    [files, formContext, name, isFullyHooked]
  )

  const removeGcpFileAtIndex = useCallback(
    (index: number) => {
      if (gcpFiles && gcpFiles[index]) {
        const newFiles: string[] = (() => {
          let temp = Array.from(gcpFiles)
          delete temp[index]
          temp = temp.filter(Boolean)

          return temp
        })()

        setGcpFiles(newFiles.length === 0 ? undefined : newFiles)

        return newFiles || []
      }

      return []
    },
    [gcpFiles]
  )

  const removeAllFiles = useCallback(() => {
    if ((files && files.length) || (gcpFiles && gcpFiles.length)) {
      setFiles(undefined)
      setGcpFiles([])

      if (isFullyHooked && name) {
        formContext.setValue(name, undefined)
        formContext.trigger([name])
      }

      return []
    }
  }, [files, formContext, gcpFiles, isFullyHooked, name])

  // trigger error state when errored
  useEffect(() => {
    setError(fieldError as any)
  }, [fieldError])

  // Register the form initially
  useEffect(() => {
    if (isFullyHooked && !isRegistered && name) {
      formContext.register(name)
      formContext.setValue(name, [])
      setIsRegistered(true)
    }
  }, [formContext, isRegistered, isFullyHooked, name])

  useEffect(() => {
    if (oldFiles) {
      setGcpFiles([...oldFiles])
    }
  }, [oldFiles])

  return (
    <>
      <input
        {...(id && { id: id })}
        type='file'
        key={filePickerKey}
        multiple={multiple}
        className='hidden'
        accept={allowedMediaTypes.join(', ')}
        ref={filePickerRef as any}
        onChange={handleFilesPicked}
      />
      {typeof children === 'function' &&
        (children as any)({
          openPicker,
          gcpFiles,
          files,
          error,
          removeFileAtIndex,
          removeAllFiles,
          removeGcpFileAtIndex
        })}
      {typeof children !== 'function' && children}
    </>
  )
}

MediaPicker.defaultProps = {
  hookToForm: false,
  multiple: true,
  maxFileSize: 15728640 // 15 mb
}

export default MediaPicker
