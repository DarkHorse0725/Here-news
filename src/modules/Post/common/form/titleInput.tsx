import axios from 'axios'
import Loader from 'components/Loader'
import Button from 'components/core/Button'
import Icon from 'components/core/Icon'
import parse from 'node-html-parser'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useFormContext } from 'react-hook-form'
import { useMutation } from 'react-query'

const TitleInput = () => {
  const maxLength = 160
  const name = 'title'

  const { register, setValue, watch, getValues } = useFormContext()
  const [canRecreateTitle, setCanRecreateTitle] = useState(true)
  const [generatedTitle, setGeneratedTitle] = useState<string>()
  const [isConfirmed, setIsConfirmed] = useState<boolean>(
    getValues(name) !== undefined
  )

  const title: string = watch('title')
  const rawContent: string = watch('content')
  const content = useMemo(
    () => (rawContent ? parse(rawContent).innerText.trim() : ''),
    [rawContent]
  )

  const { mutate, isLoading: isGeneratingTitle } = useMutation({
    mutationFn: async (content: string) => {
      const response = await axios.post(
        'https://us-central1-phonic-jetty-356702.cloudfunctions.net/generateTitleForPost',
        {
          content
        }
      )

      return {
        title: response.data.title
      }
    },
    onSuccess: data => {
      if (data.title?.trim().length > 0) {
        setGeneratedTitle(data.title)
      }
    }
  })

  useEffect(() => {
    if (
      content.length >= 600 &&
      !isGeneratingTitle &&
      !generatedTitle &&
      !isConfirmed &&
      !title
    ) {
      mutate(content)
    }
  }, [
    content,
    mutate,
    isGeneratingTitle,
    generatedTitle,
    isConfirmed,
    title
  ])

  const onConfirm = useCallback(() => {
    !isConfirmed && setIsConfirmed(true)
    setValue(name, generatedTitle)
  }, [isConfirmed, name, generatedTitle, setValue])

  const onInputBlur = useCallback(() => {
    !canRecreateTitle && setCanRecreateTitle(true)
  }, [canRecreateTitle])

  const onInputFocus = useCallback(() => {
    canRecreateTitle && setCanRecreateTitle(false)
  }, [canRecreateTitle])

  const handleCreateTitle = useCallback(() => {
    if (!content) {
      return
    }

    setIsConfirmed(false)
    setValue(name, '')
    if (content.length > 600 && !isGeneratingTitle) {
      mutate(content)
    }
  }, [content, isGeneratingTitle, mutate, setValue, name])

  return isGeneratingTitle ||
    generatedTitle ||
    title ||
    content.length > 600 ? (
    <div className='flex flex-row justify-between items-center flex-wrap pl-4 gap-2 pr-3 min-h-[3.75rem] py-[0.625rem] rounded-lg bg-transparent hover:bg-[#E9E9E9]'>
      {isConfirmed ? (
        <input
          className='placeholder:italic placeholder:text-grayL text-sm sm:text-base outline-none p-0 bg-transparent placeholder:font-light flex-1 leading-[1.6rem] text-header font-medium'
          placeholder='Title (Optional)'
          maxLength={maxLength}
          onFocus={onInputFocus}
          {...register(name, {
            onBlur: onInputBlur
          })}
        />
      ) : (
        <p
          className='italic text-sm sm:text-base p-0 bg-transparent text-grayL line-clamp-1 font-light flex-1 leading-[1.6rem] cursor-text'
          onClick={onConfirm}
        >
          {generatedTitle ?? 'Title (Optional)'}
        </p>
      )}

      {(canRecreateTitle || !isConfirmed || isGeneratingTitle) && (
        <Button
          onClick={handleCreateTitle}
          disabled={isGeneratingTitle}
          className={`!p-1.5 sm:!p-2 !rounded-lg !bg-baseWhite !border-0 grid place-items-center shrink-0 ${
            isGeneratingTitle
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
          }`}
        >
          {isGeneratingTitle ? (
            <Loader
              color='fill-body'
              className='h-4 w-4 sm:h-6 sm:w-6'
            />
          ) : (
            <Icon
              name='repeat'
              className='h-5 w-5 sm:w-6 sm:h-6'
              raw
            />
          )}
        </Button>
      )}
    </div>
  ) : (
    <></>
  )
}

export default TitleInput
