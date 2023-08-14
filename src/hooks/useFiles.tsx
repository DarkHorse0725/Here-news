import { useMutation } from 'react-query'
import http from 'services/http-common'

function useFiles() {
  // for uploading a single file (returns the uploaded file link)
  const {
    mutate: uploadFile,
    mutateAsync: uploadFileAsync,
    error: fileUploadError,
    isLoading: isUploadingFile,
    data: uploadedFileUrl
  } = useMutation({
    mutationFn: async (file: File) => {
      // payload
      const payload = new FormData()
      payload.append('image', file)

      // api call
      const response = await http.post(`/uploadFile`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // transform data
      const data: { url: string } = response.data

      return data.url
    }
  })

  // for uploading a file list (returns the uploaded file link + the file itself)
  const {
    mutateAsync: uploadFileList,
    error: fileListUploadError,
    isLoading: isUploadingFileList,
    data: uploadedFileListUrls
  } = useMutation({
    mutationFn: async (files: FileList) => {
      const uploadedFiles = await Promise.all(
        Array.from(files).map(async file => ({
          file,
          url: await uploadFileAsync(file)
        }))
      )

      return uploadedFiles
    }
  })

  // for removing single file by url
  const {
    mutate: removeFile,
    error: fileRemovalError,
    isLoading: isRemovingFile
  } = useMutation({
    mutationFn: async (url: string) => {
      const payload = { filename: url }
      return await http.post(`/removeFile`, payload)
    }
  })

  // for removing multiple files by list of urls
  const {
    mutate: removeFiles,
    error: filesRemovalError,
    isLoading: isRemovingFiles
  } = useMutation({
    mutationFn: async (urls: string[]) => {
      return await Promise.all(
        urls.map(async url => await removeFile(url))
      )
    }
  })

  return {
    // for single file upload
    fileUploadError,
    uploadedFileUrl,
    isUploadingFile,
    uploadFile,
    uploadFileAsync,
    // for file list upload
    uploadFileList,
    fileListUploadError,
    isUploadingFileList,
    uploadedFileListUrls,
    // for single file removal
    removeFile,
    isRemovingFile,
    fileRemovalError,
    // for multiple files removal
    removeFiles,
    isRemovingFiles,
    filesRemovalError
  }
}

export default useFiles
