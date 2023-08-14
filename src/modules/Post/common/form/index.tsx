/* eslint-disable react-hooks/rules-of-hooks */
import EditorLinkPreview from './linkPreview'
import Button from 'components/core/Button'
import Form from 'components/core/Form'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { ILinkDetails } from 'types/interfaces'
import usePostForm from './usePostForm'
import { postValidation } from './validation'
import TitleInput from './titleInput'
import RichTextEditor from 'components/core/RichTextEditor'
import parse from 'node-html-parser'
import Tooltip from 'components/Tooltip'
import { useAppSelector } from 'store/hooks'
import { toast } from 'react-toastify'

interface IPostForm {
  postId?: string
  previewData?: ILinkDetails | null
  apiEndpoint: string
  initialValues?: any
  onAPICallSuccess: (data?: any) => any
  actionLabel?: 'Publish' | 'Reply' | 'Update'
}

/**
 * Manage api calls and form validation for post related entities.
 * [Important]:
 * It has implied behavior but it should have no cross cutting concerns
 * (like cache invalidation, redirection). To manage those, use a form
 * composer component and 'onAPICallSuccess', 'apiEndpoint' props.
 * To pass initial values, use the 'initialValues' object prop with keys
 * mapping form field names with initial values
 */
function PostForm({
  postId,
  previewData,
  apiEndpoint,
  initialValues,
  onAPICallSuccess,
  actionLabel = 'Publish'
}: IPostForm) {
  const {
    // for post
    create,
    isLoading,
    error: postError,

    // for link preview
    isLoadingPreview,
    linkPreviewError,
    getLinkPreview,
    linkPreview,
    removeLinkPreview
  } = usePostForm({
    apiEndpoint,
    onAPICallSuccess
  })

  const [fieldError, setFieldError] = useState<string | undefined>()
  const [isUploading, setIsUploading] = useState(false)
  const [isAlreadyPublished, setIsAlreadyPublished] = useState(false)
  const balance = useAppSelector(
    state => state.auth.selectedAccount?.balance
  )

  const isButtonDisabled = useMemo(
    () => isLoading || isLoadingPreview || isUploading,
    [isLoading, isLoadingPreview, isUploading]
  )

  useEffect(() => {
    if (previewData?.url) getLinkPreview(previewData.url)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewData])

  const onChange = useCallback(
    (value: string) => {
      isAlreadyPublished && setIsAlreadyPublished(false)

      const doc = parse(value)
      const link = doc.querySelector('a')
      const files = doc.querySelectorAll('div[data-file]')

      localStorage.setItem(
        'pickedFilesCount',
        files.length.toString()
      )

      const isUploadingFile = files.some(
        file => !file.getAttribute('data-url')
      )
      setIsUploading(isUploadingFile)

      const href = link?.getAttribute('href')

      if (
        !href ||
        doc.textContent.trim() !== href ||
        files.length > 0
      ) {
        // If there's more text other than the user pasted link, or there's an attached file, then treat it as a non-preview post
        linkPreview && removeLinkPreview()
        return
      }

      getLinkPreview(href)
    },
    [
      removeLinkPreview,
      getLinkPreview,
      linkPreview,
      isAlreadyPublished
    ]
  )

  const handleButtonClick = useCallback(() => {
    if (
      linkPreview?.sourcePost &&
      linkPreview.sourcePost._id !== postId
    ) {
      setIsAlreadyPublished(true)
    }
  }, [linkPreview, postId])

  const onCancel = useCallback(() => {
    setIsAlreadyPublished(false)
  }, [])

  return (
    <Form
      onSubmit={async values => {
        if (!balance || balance <= 0) {
          toast.error('Insufficient balance')
          return
        }

        create({
          ...values
        })
      }}
      onError={e => {
        setFieldError(Object.values(e)[0].message)
      }}
      validationSchema={postValidation}
      className={`flex flex-col items-stretch gap-4`}
      initialValues={initialValues}
    >
      {/* Input fields */}
      <div className='flex flex-col gap-2'>
        <div
          className={`flex flex-col items-stretch border rounded-lg bg-historic overflow-hidden ${
            fieldError || postError || isAlreadyPublished
              ? 'border-red-500'
              : 'border-stroke'
          }`}
        >
          <TitleInput />

          <RichTextEditor
            name='content'
            placeholder="What's on your mind?"
            hookToForm
            onChange={onChange}
            autoFocusContentEditor={true}
          />
        </div>

        {(fieldError || postError || isAlreadyPublished) && (
          <p className='text-error text-xs sm:text-sm font-light italic leading-[140%] tracking-medium'>
            {fieldError ||
              postError ||
              (isAlreadyPublished &&
                'This url is already published by another user')}
          </p>
        )}
      </div>

      {isAlreadyPublished ? (
        <div className='flex flex-row gap-4 items-stretch flex-wrap justify-end'>
          <Button
            type='button'
            onClick={onCancel}
            className='bg-transparent rounded-lg px-6 py-2 h-10 sm:h-12 !border border-stroke bg-baseWhite !font-medium !text-grayMedium !text-sm sm:!text-base !leading-[1.2rem] tracking-medium'
          >
            Cancel
          </Button>

          <Button
            type={isButtonDisabled ? 'button' : 'submit'}
            disabled={isButtonDisabled}
            isLoading={isButtonDisabled}
            className='rounded-lg px-6 py-2 !text-baseWhite !bg-header font-medium h-10 sm:h-12 tracking-medium !text-sm sm:!text-base !leading-[1.2rem] !border'
          >
            Continue Publishing...
          </Button>
        </div>
      ) : (
        <Tooltip
          id='publishButton'
          message={
            !balance || balance <= 0
              ? 'Insufficient balance'
              : `It'll cost 1μ for Post publishing`
          }
          className='self-end'
        >
          <Button
            className={`!bg-primary !border-primary action-btn grid place-items-center !text-sm sm:!text-base !leading-[1.2rem] tracking-medium font-medium !px-6 h-10 sm:h-12 ${
              isButtonDisabled
                ? 'cursor-not-allowed'
                : 'cursor-pointer'
            }`}
            type={
              (linkPreview?.sourcePost &&
                linkPreview.sourcePost?._id !== postId) ||
              isButtonDisabled
                ? 'button'
                : 'submit'
            }
            disabled={isButtonDisabled}
            isLoading={isButtonDisabled}
            size='small'
            onClick={handleButtonClick}
          >
            {actionLabel}
          </Button>
        </Tooltip>
      )}

      {/* link preview */}
      <EditorLinkPreview
        isLoading={isLoadingPreview}
        linKPreviewError={linkPreviewError}
        preview={linkPreview}
        showSourceInfo={isAlreadyPublished}
      />
    </Form>
  )
}

PostForm.defaultProps = {
  row: true
}
export default PostForm
