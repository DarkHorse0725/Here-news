import { toast } from 'react-toastify'
import Icon from 'components/core/Icon'
import { useCommands } from '@remirror/react'
import { useRef } from 'react'
import { MAX_ALLOWED_FILES } from 'const'

function FilePicker() {
  const { uploadFiles } = useCommands()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFilesPicked = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    try {
      const pickedFiles = e.target.files

      if (!pickedFiles) {
        return
      }

      const selectedFiles = parseInt(
        localStorage.getItem('pickedFilesCount') || ''
      )

      if (
        pickedFiles.length > MAX_ALLOWED_FILES ||
        selectedFiles === MAX_ALLOWED_FILES
      ) {
        throw new Error(`Max ${MAX_ALLOWED_FILES} files are allowed!`)
      }

      const remainingSlots = MAX_ALLOWED_FILES - selectedFiles

      if (pickedFiles.length > remainingSlots) {
        throw new Error(
          `You can only select ${remainingSlots} more files.`
        )
      }

      const allowedMediaTypes = [
          'image/jpg',
          'image/jpeg',
          'image/png',
          'video/mp4',
          'audio/mpeg',
          'audio/mp3',
          'image/webp',
          'image/gif'
        ],
        maxFileSizeInBits = 15728640,
        files: File[] = []

      for (let i = 0; i < pickedFiles.length; i++) {
        const file = pickedFiles.item(i)

        if (!file) {
          continue
        }

        if (file.size > maxFileSizeInBits) {
          throw new Error(
            `Only files less then ${Math.floor(
              maxFileSizeInBits / 1024 / 1024
            )} mb are allowed!`
          )
        } else if (!allowedMediaTypes.includes(file.type)) {
          throw new Error('Invalid file provided')
        }

        files.push(file)
      }

      localStorage.setItem(
        'pickedFilesCount',
        (selectedFiles + files.length).toString()
      )
      e.target.value = null as any
      uploadFiles(files)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to pick files')
    }
  }

  return (
    <>
      <label htmlFor='filePicker' className='cursor-pointer'>
        <Icon
          color='#ADB3BD'
          className='h-5 w-5 sm:h-6 sm:w-6'
          name='image'
          raw
        />
      </label>

      <input
        ref={inputRef}
        type='file'
        id='filePicker'
        className='hidden'
        multiple
        onChange={handleFilesPicked}
      />
    </>
  )
}

export default FilePicker
