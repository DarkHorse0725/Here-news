import Icon from 'components/core/Icon'
import Typography from 'components/core/Typography'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
import { doesImageExist, sanitizeUrl } from 'utils'
import { toast } from 'react-toastify'

interface ILinkPreview {
  type: 'raw' | 'tube' | 'youtube'
  isRemoveable?: boolean
  onRemove?: (props?: any) => any
  // when type is 'youtube'
  youtubeId?: string
  // when type is 'raw'
  url?: string
  title?: string
  image?: string
  websiteName?: string
  websiteLogo?: string
  websiteDomain?: string
  description?: string
  layout?: 'row' | 'col'
  linkPreviewDirection: 'post' | 'trending'
}

// If we are rendering component on server then these event listeners must be attached after mounting the components (used in PostTicket and SinglePostComponents)
export const onCopyClipboardListener = (contents?: any) => {
  navigator.clipboard.writeText(contents ?? '')
  toast.success('Link copied successfully!', {
    toastId: 'linkCopied'
  })
}

export const serverAttachClipboardListener = () => {
  const btns = document.querySelectorAll('.lp-clipboard-btn')
  btns.forEach(btn => {
    const contents = btn.getAttribute('data-contents')
    btn.addEventListener('click', () => {
      onCopyClipboardListener(contents)
    })
  })
}

export const serverRemoveClipboardListener = () => {
  const btns = document.querySelectorAll('.lp-clipboard-btn')
  btns.forEach(btn => {
    const contents = btn.getAttribute('data-contents')
    btn.removeEventListener('click', () => {
      onCopyClipboardListener(contents)
    })
  })
}

function LinkPreview(props: ILinkPreview) {
  const [hasImage, setHasImage] = useState<boolean>(false)
  const [hasWebsiteLogo, setHasWebsiteLogo] = useState<boolean>(false)
  // const [url, setUrl] = useState<string>(props?.url)
  useEffect(() => {
    if (props.image) {
      doesImageExist(props.image)
        .then(() => setHasImage(true))
        .catch(() => setHasImage(false))
    } else setHasImage(false)
  }, [props.image])

  useEffect(() => {
    if (props.websiteLogo) {
      doesImageExist(props.websiteLogo)
        .then(() => setHasWebsiteLogo(true))
        .catch(() => setHasWebsiteLogo(false))
    } else setHasWebsiteLogo(false)
  }, [props.websiteLogo])

  const imageUrl = useMemo(
    () =>
      hasImage
        ? props.image
        : `https://dummyimage.com/600x400/53389e/ffffff&text=${encodeURIComponent(
            props.title ? props.title : 'No thumbnail'
          )}`,
    [hasImage, props]
  )

  return (
    <>
      {props.type === 'youtube' && props.youtubeId && (
        <div className='w-full mt-4 relative'>
          <LiteYouTubeEmbed
            id={props.youtubeId}
            iframeClass='h-60 w-full'
            title='youtube video player'
          />

          {props.isRemoveable && (
            <Icon
              name='close'
              size={20}
              className='ml-auto absolute top-4 right-4 z-40'
              variant='secondary'
              onClick={props.onRemove}
            />
          )}
        </div>
      )}
      {props.type === 'raw' && (
        <div
          onClick={() =>
            window.location.pathname !== '/' && window.open(props.url)
          }
          className='cursor-pointer bg-here-pink-50 p-3 rounded-md gap-3'
        >
          {(!props.layout || props.layout === 'row') &&
            props.image && (
              <div className='col-span-5'>
                <div
                  className='rounded-md h-full bg-no-repeat bg-center bg-cover opacity-95 shadow-md w-full border-[1px] border-gray-200'
                  style={{ background: `url("${imageUrl}")` }}
                />
              </div>
            )}
          <div
            className={`flex ${
              props.linkPreviewDirection == 'post'
                ? 'flex-row'
                : 'flex-col'
            } gap-2 ${
              props.linkPreviewDirection == 'post' && 'grid'
            } grid-cols-12`}
          >
            {props.linkPreviewDirection == 'trending' && (
              <div className='flex gap-2 items-center'>
                {props.websiteLogo && hasWebsiteLogo && (
                  <div className='relative w-5 h-5 md:w-7 md:h-7'>
                    <Image
                      unoptimized
                      alt='external youtube posted'
                      src={props.websiteLogo}
                      fill
                      className='rounded-lg border-[1px] border-gray-400'
                    />
                  </div>
                )}
                <Typography type='small'>
                  {props.websiteName
                    ? props.websiteName
                    : props.websiteDomain}
                </Typography>
                {props.isRemoveable && (
                  <Icon
                    name='close'
                    size={20}
                    className='ml-auto'
                    variant='secondary'
                    onClick={props.onRemove}
                  />
                )}
              </div>
            )}

            {props.layout === 'col' && props.image && hasImage && (
              <div className='relative col-span-5 w-full h-[160px] md:h-[216px] g:h-[342px]'>
                <div
                  className='rounded-md h-full opacity-95 shadow-md border-[1px] border-gray-200'
                  style={{
                    background: `url("${imageUrl}") no-repeat center / cover`
                  }}
                />
              </div>
            )}
            <div className='col-span-7 flex flex-col gap-2'>
              {props.linkPreviewDirection == 'post' && (
                <div className='flex gap-2 items-center'>
                  {props.websiteLogo && (
                    <Image
                      unoptimized
                      alt='external youtube posted'
                      src={props.websiteLogo}
                      width={28}
                      height={28}
                      className='rounded-lg border-[1px] border-gray-400 max-w-[28px] max-h-[28px]'
                    />
                  )}
                  <p className='text-sm'>
                    {props.websiteName
                      ? props.websiteName
                      : props.websiteDomain}
                  </p>
                  {props.isRemoveable && (
                    <Icon
                      name='close'
                      size={20}
                      className='ml-auto'
                      variant='secondary'
                      onClick={(e: any) => {
                        e.stopPropagation()
                        props.onRemove && props.onRemove()
                      }}
                    />
                  )}
                </div>
              )}
              {props.title && (
                <Typography
                  type='subtitle-small'
                  className='text-gray-700 font-medium md:tracking-wide'
                >
                  {props.title}
                </Typography>
              )}
              {props.description && (
                <Typography
                  type='body'
                  className='text-[#303B41] font-light mt-1 md:mt-0'
                >
                  {props.description}
                </Typography>
              )}
            </div>
          </div>
        </div>
      )}

      {props.type === 'tube' && (
        <div className='relative w-fit my-1 cursor-pointer group break-all'>
          <a
            className='w-full cursor-pointer flex items-center no-underline'
            href={props.url}
            target='_blank'
            rel='noreferrer'
          >
            <span
              className='p-2 bg-white border-[1px] border-gray-300 rounded-md shadow-md flex items-center hover:shadow-lg hover:opacity-90 text-xs font-semibold text-blue-700 hover:underline transition duration-300
            '
            >
              {props.websiteLogo && hasWebsiteLogo && (
                <Image
                  unoptimized
                  alt='external image'
                  src={sanitizeUrl(props.websiteLogo)}
                  width={100}
                  height={100}
                  className='h-[16px] w-auto px-1'
                />
              )}
              <span
                id='external-link-2'
                className='external-link text-xs text-here-purple-900'
              >
                {props.title}
              </span>
            </span>
          </a>
          <div
            className={`min-w-[16rem] absolute border-[1px] border-gray-300 border-1 top-full mt-[1px] bg-white p-4 rounded-sm w-full hidden group-hover:flex group-hover:justify-between flex-col gap-2 !text-gray-700 !no-underline !z-50
            `}
            style={{ zIndex: '999 !important' }}
          >
            <div className='flex justify-between items-center text-xs gap-1'>
              <a
                href={props.url}
                target='_blank'
                rel='noreferrer'
                className='flex items-center gap-2 !text-gray-700 !no-underline break-words'
              >
                {props.websiteLogo && hasWebsiteLogo && (
                  <Image
                    unoptimized
                    alt='external image'
                    width={100}
                    height={100}
                    src={sanitizeUrl(props.websiteLogo)}
                    className='h-[32px] w-auto px-1'
                  />
                )}
                <p
                  id='external-link-3'
                  className='external-link text-xs'
                  style={{ fontSize: '12px !important' }}
                >
                  {props.title}
                </p>
              </a>
              <div
                className='flex gap-2 items-center ml-auto
              '
              >
                <button
                  data-contents={props.url}
                  id='external-link-4'
                  className='lp-clipboard-btn !text-gray-700 hover:text-gray-900 focus:text-gray-900'
                >
                  <Icon
                    name='clipboard'
                    className='external-link'
                    raw
                  />
                </button>

                <a
                  href={props.url}
                  target='_blank'
                  rel='noreferrer'
                  id='external-link-5'
                  className='external-link !text-gray-700 hover:text-gray-900 focus:text-gray-900'
                >
                  <Icon
                    name='external-link'
                    className='external-link'
                    raw
                  />
                </a>
              </div>
            </div>
            {props.description && (
              <p
                className='text-xs break-normal'
                style={{ fontSize: '12px !important' }}
              >
                {props.description}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

LinkPreview.defaultProps = {
  linkPreviewDirection: 'trending'
}

export default LinkPreview
