import http from './http-common'

const upload = (file: File, onUploadProgress: any) => {
  const formData = new FormData()

  formData.append('image', file)

  return http.post('/uploadFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  })
}

const FileUploadService = {
  upload
}

export default FileUploadService
