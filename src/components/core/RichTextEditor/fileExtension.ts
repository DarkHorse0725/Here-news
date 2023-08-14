import { uploadFile } from '@remirror/core'
import { FileExtension } from '@remirror/extension-file'
import { PasteRule } from '@remirror/pm/paste-rules'
import { MAX_ALLOWED_FILES } from 'const'
import { toast } from 'react-toastify'

// Extended the extension because we're moving all sorts of file handling
// including the image handling to the file extension, and we need to add
// file validation for the pasted files as well
// Potential TODO: If we want to add the below parameters as constructor options (even though i don't think that'd be necessary),
// then we will most likely need to enable experimentalDecorators
export class CustomFileExtension extends FileExtension {
  /**
   * Max allowed file size
   */
  maxFileSizeInBits: number = 15728640

  /**
   * Allowed file types
   */
  allowedFileTypes: string[] = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'video/mp4',
    'audio/mpeg',
    'audio/mp3',
    'image/webp',
    'image/gif'
  ]

  createPasteRules(): PasteRule[] {
    return [
      {
        type: 'file',
        regexp: /image/i,
        fileHandler: props => {
          let pos: number | undefined

          if (props.type === 'drop') {
            pos = props.pos
          }

          const areFilesValid = this.validateFiles(props.files)
          if (!areFilesValid) {
            return false
          }

          for (let file of props.files) {
            uploadFile({
              file: file,
              pos: pos,
              view: this.store.view,
              fileType: this.type,
              uploadHandler: this.options.uploadFileHandler
            })
          }

          return true
        }
      }
    ]
  }

  /**
   * Validate the picked/pasted/dropped files
   * @param pickedFiles picked/pasted/dropped files list
   * @returns boolean - true if the files are valid, false if not
   */
  validateFiles(pickedFiles: File[]) {
    try {
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

      for (let file of pickedFiles) {
        if (file.size > this.maxFileSizeInBits) {
          throw new Error(
            `Only files less then ${Math.floor(
              this.maxFileSizeInBits / 1024 / 1024
            )} mb are allowed!`
          )
        } else if (!this.allowedFileTypes.includes(file.type)) {
          throw new Error('Invalid file provided')
        }
      }

      return true
    } catch (e) {
      toast.error((e as any)?.message || 'Failed to pick files')
      return false
    }
  }
}
