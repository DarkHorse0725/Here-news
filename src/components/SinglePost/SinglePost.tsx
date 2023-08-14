import Typography from 'components/core/Typography'
import React, {
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'
import { IPost, ITranslateDataType, IUser } from 'types/interfaces'
import styles from './index.module.css'
import SinglePostHeader from './Header'
import Buttons from './Buttons'
import ReplyEditor from './editor'
import Button from 'components/core/Button'
import { replaceFileDivs, sanitizeTitle } from 'utils'
import Link from 'next/link'
import LinkPreview from 'components/blocks/LinkPreview'
// @ts-ignore
import htmlToFormattedText from 'html-to-formatted-text'
import { useRouter } from 'next/router'
import Translator from './Translator'
import { useMutation } from 'react-query'
import axios from 'axios'
import { CloudFunctionURL } from 'const'
import Avatar from 'components/Avatar'
import { toast } from 'react-toastify'

interface Props extends IPost {
  commentors?: IUser[] // Latest three commentors
  focused?: boolean // Is the focused post, i.e. the focused post will show editor, buttons, etc.
}

const SinglePost = (post: Props) => {
  const {
    title,
    text,
    totalVotes,
    preview,
    focused = false,
    repliedTo,
    meta,
    userId: { avatar },
    postId,
    permalink,
    commentors = []
  } = post

  const [isHidden, setIsHidden] = useState<boolean>(totalVotes < -3)
  const [translatedText, setTranslatedText] =
    useState<ITranslateDataType>()

  const translations = useRef<Map<string, ITranslateDataType>>(
    new Map()
  )
  const router = useRouter()

  const showPost = useCallback(() => {
    setIsHidden(false)
  }, [])

  const isPreview = useMemo(
    () =>
      (!title || title.trim().length === 0) &&
      sanitizeTitle(htmlToFormattedText(text)).trim().length === 0 &&
      preview?.title,
    [title, text, preview]
  )

  const htmlText = useMemo(
    () => replaceFileDivs(translatedText?.description ?? text),
    [text, translatedText]
  )

  // TODO: Replace onClick and div with Link element, add href along with onClick which returns false to prevent navigation
  const onPostClick = useCallback<
    MouseEventHandler<HTMLInputElement>
  >(
    e => {
      if (
        !focused &&
        !['svg', 'path'].includes((e.target as any).localName)
      ) {
        router.push(`/post/${postId}/${permalink}`)
      }
    },
    [focused, router, postId, permalink]
  )

  const { mutate, isLoading: isTranslating } = useMutation({
    mutationFn: async (body: {
      langCode: string
      post_id: string
    }) => {
      const response = await axios.post(
        `${CloudFunctionURL}/translatePost`,
        body
      )

      // TODO: Ask henry to return errors, rather than errors packed in the valid response
      if (response.data.status === 'error') {
        throw 'Failed to translate the post'
      }

      return {
        data: response.data.result
      }
    },
    onSuccess(data, context) {
      if (data.data) {
        if (!translations.current.has(context.langCode)) {
          translations.current.set(context.langCode, data.data)
        }

        setTranslatedText(data.data)
      }
    },
    onError() {
      toast.error('Failed to translate the post')
    }
  })

  const translatePost = useCallback(
    (code: string) => {
      // TODO: get the base language from the post meta but seems like the post meta isn't being generated
      if (code === 'en') {
        setTranslatedText(undefined)
        return
      }

      if (translations.current.has(code)) {
        setTranslatedText(translations.current.get(code))
        return
      }

      mutate({
        langCode: code,
        post_id: postId
      })
    },
    [mutate, postId]
  )

  return isHidden && !focused ? (
    <div className='flex flex-row gap-1 bg-grayish border border-stroke py-[0.9375rem] items-center justify-center w-full'>
      <Typography
        type='body'
        className='!text-sm !leading-[1.4rem] font-normal text-body'
      >
        This post has been hidden because of low value.
      </Typography>

      <Button
        size='small'
        variant='light'
        className='!border-none !bg-transparent text-primary underline !p-0 !leading-[1.4rem] !text-xs'
        onClick={showPost}
      >
        Show post
      </Button>
    </div>
  ) : (
    <div
      onClick={onPostClick}
      className={`flex flex-col rounded-lg item-stretch sm:gap-2 no-underline ${
        focused ? '' : 'cursor-pointer'
      } ${repliedTo && focused ? 'my-5' : ''}`}
    >
      <div className='flex flex-col items-stretch'>
        <div className='flex flex-row items-start gap-2'>
          <Avatar
            imageUrl={avatar}
            containerClassNames={`rounded-full w-[3.75rem] aspect-square hidden sm:block shrink-0 my-4 sticky ${
              focused && repliedTo ? 'top-[8.5rem]' : 'top-[5.5rem]'
            }`}
            iamgeClassNames='!p-0 object-cover object-center'
          />

          <div
            className={`flex flex-col min-w-0 items-stretch flex-1 sm:border !border-b-0 border-stroke px-4 pt-2 ${
              focused
                ? 'rounded-t-lg bg-baseWhite'
                : 'rounded-lg bg-historic'
            }`}
          >
            <SinglePostHeader post={post} focused={focused} />

            <div className='flex flex-col'>
              {focused && (
                <Translator
                  meta={meta}
                  onLanguageChange={translatePost}
                  isTranslating={isTranslating}
                />
              )}

              {/* Content */}
              {isPreview && preview ? (
                <div className='flex flex-col gap-4 px-1 my-4'>
                  {/* Preview title */}
                  <Typography
                    type='h1'
                    className='!text-base sm:!text-2xl !leading-[1.6rem] sm:!leading-[2.4rem] font-medium text-primary'
                  >
                    {translatedText?.preTitle || preview.title}
                  </Typography>

                  {/* Preview image */}
                  {!preview.youtubeId && preview.image && (
                    <div className='grid place-items-center'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview.image}
                        alt={preview.title || ''}
                        className='rounded-lg object-cover object-center'
                      />
                    </div>
                  )}

                  {/* Preview description */}
                  <Typography
                    type='body'
                    className='!text-sm sm:!text-base !leading-[1.4rem] sm:!leading-[1.6rem] font-normal text-body'
                  >
                    {translatedText?.description ||
                      preview.description}
                  </Typography>

                  {/* Read More */}
                  <Link
                    href={preview.url}
                    target='_blank'
                    className={`no-underline flex flex-row gap-2 items-center bg-baseWhite border border-stroke rounded-lg self-start ${
                      preview.youtubeId ? 'px-4 py-2' : 'p-2'
                    }`}
                  >
                    {!preview.youtubeId && (
                      <Typography
                        type='body'
                        className='hidden sm:block !text-xs sm:!text-base !leading-[1.6rem] font-medium text-header shrink-0'
                      >
                        Read More...
                      </Typography>
                    )}

                    <div
                      style={{
                        backgroundImage: `url("${preview.favicon}")`
                      }}
                      className='h-4 w-4 shrink-0 sm:w-6 sm:h-6 rounded-[0.25rem] bg-no-repeat bg-cover bg-center bg-black'
                    />

                    <Typography
                      type='link'
                      className='!text-xs sm:!text-base !leading-[1.4rem] tracking-medium underline text-mainLink text-ellipsis'
                    >
                      {preview.youtubeId
                        ? preview.url
                        : new URL(preview.url).origin}
                    </Typography>
                  </Link>

                  {/* Youtube frame */}
                  {preview.youtubeId && (
                    <LinkPreview
                      youtubeId={preview.youtubeId}
                      type='youtube'
                    />
                  )}
                </div>
              ) : (
                <div className='flex flex-col gap-4 px-1 my-4'>
                  <Typography
                    type='h1'
                    className='!text-base sm:!text-2xl !leading-[1.6rem] sm:!leading-[2.4rem] font-medium text-header'
                  >
                    {translatedText?.title || title}
                  </Typography>

                  <div
                    className={styles.SinglePost}
                    dangerouslySetInnerHTML={{
                      __html: htmlText || ''
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons section */}
        {focused && <Buttons post={post} commentors={commentors} />}
      </div>

      {focused && <ReplyEditor postId={postId} />}
    </div>
  )
}

export default SinglePost
