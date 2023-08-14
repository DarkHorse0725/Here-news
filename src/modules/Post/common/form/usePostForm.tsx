import useFiles from 'hooks/useFiles'
import useLinkPreview from 'hooks/useLinkPreview'
import { useMutation, useQueryClient } from 'react-query'
import http from 'services/http-common'
import { useAppSelector } from 'store/hooks'
import sanitizeHtml from 'sanitize-html'

interface IPostForm {
  apiEndpoint: string
  onAPICallSuccess: (data?: any) => any
}

function usePostForm({ onAPICallSuccess, apiEndpoint }: IPostForm) {
  // this is just to get the auth user id (cross cutting concerns should
  // be in dedicated form composers)
  const { selectedAccount } = useAppSelector(state => state.auth)
  const queryClient = useQueryClient()

  // post actions
  const { mutate, error, isLoading } = useMutation({
    mutationFn: async ({
      content,
      title
    }: {
      content: string
      title?: string
      youtubeId?: string
    }) => {
      // sanitize content
      const sanitizedContent = sanitizeHtml(content, {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          div: ['data-url', 'data-filetype', 'data-file']
        }
      })

      // calc post title from content
      const postTitle = title || ''

      // api payload
      const payload = {
        userId: selectedAccount?._id as string,
        title: postTitle,
        text: sanitizedContent,
        previewId: linkPreview?._id
      }

      // make api call
      const response = await http.post(apiEndpoint, payload)

      // let the form composer know about api call success
      await onAPICallSuccess(response?.data?.data)

      return payload
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries('preview')
    }
  })

  // post link previews
  const {
    isLoadingPreview,
    getLinkPreview,
    linkPreview,
    linkPreviewError,
    removeLinkPreview
  } = useLinkPreview()

  // post file uploads
  const { removeFile } = useFiles()

  return {
    // for post creation
    create: mutate,
    error: error ? (error as Error).message : null,
    isLoading: isLoading,
    // for link preview
    isLoadingPreview,
    getLinkPreview,
    removeLinkPreview,
    linkPreview,
    linkPreviewError,
    removeFile
  }
}

export default usePostForm
