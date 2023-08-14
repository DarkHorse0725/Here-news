import { toast } from 'react-toastify'
import FileUploadService from 'services/FileUploadService'
import { ILinkDetails, IUploadedStatus } from 'types/interfaces'
import { NodeType, parse, HTMLElement } from 'node-html-parser'
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInSeconds
} from 'date-fns'
// @ts-ignore
import htmlToFormattedText from 'html-to-formatted-text'

// const maximum_size: number = 15728640

const ErrorYield = {
  error: true
}

export const sanitizeUrl = (url: string): string => {
  const parts = url.split(/[#?]/)
  return parts[0]
}

export const youtubeParser = (url: string) => {
  const regExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11}).*/
  const match = url.match(regExp)
  return match && match[1].length == 11 ? match[1] : false
}

export const getUrl = (text: string) => {
  const regex = /(https?:\/\/[^\s]+)/g
  const result = text.split(regex)

  for (let i = 0; i < result.length; i++) {
    if (regex.test(result[i])) {
      return result[i]
    }
  }
}

export const getTypeMedia = (mediaName: string) => {
  if (!mediaName) return 'image'

  const tokens = mediaName.split('_')
  return tokens[1] as 'video' | 'image'
}

export const selectAndUploadMedia = function* (
  prevFiles: string[] | null,
  selected_files: FileList | null,
  files: FileList,
  uploadedStatus: IUploadedStatus
): any {
  let videoCount: number = 0
  const maximum_size: number = 15728640

  let tempStatus: IUploadedStatus = {
    ...uploadedStatus
  }

  if (prevFiles) {
    const videoArray = prevFiles.filter(
      item => getTypeMedia(item) === 'video'
    )

    if (videoArray.length) videoCount++
  }

  const dt = new DataTransfer()

  if (selected_files) {
    for (let i = 0; i < selected_files.length; i++) {
      if (selected_files[i].type.search('video') >= 0) videoCount++
      dt.items.add(selected_files[i])
    }
  }

  for (let i = 0; i < (files.length <= 10 ? files.length : 10); i++) {
    if (files[i].type.search('video') >= 0) {
      if (videoCount === 1) {
        toast.error('You can only upload 1 video file')
        yield ErrorYield
        return
      }
      videoCount++
    }

    if (files[i].size > maximum_size) {
      toast.error('You can only upload with maximum size of 15MB')
      yield ErrorYield
      return
    }

    dt.items.add(files[i])

    tempStatus = {
      nameArray: [...tempStatus.nameArray, ''],
      sizeArray: [...tempStatus.sizeArray, 0]
    }
  }

  const first_index: number = selected_files
    ? selected_files.length
    : 0

  yield {
    first_index,
    files: dt.files,
    selected: true,
    initialStatus: { ...tempStatus }
  }

  for (let i = 0; i < files.length; i++) {
    yield FileUploadService.upload(files[i], (event: any) => {
      tempStatus.sizeArray[first_index + i] = Math.round(
        (100 * event.loaded) / event.total
      )
    })
  }
}

export function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}

/**
 * Removes html tags and returns the concatenated
 * text characters from the provided html string
 * @param htmlString - the html string to process
 * @returns string
 */
export const getImgsFromHTMLString = (htmlString: string) => {
  const doc = parse(htmlString)
  const imgs = doc.querySelectorAll('img')
  return imgs
}

export const getTextFromHTMLString = (htmlString: string) => {
  const stringWithoutHTMLTags = htmlString?.replace(
    /<\/?[^>]+(>|$)/g,
    ' '
  )

  const sanitized = stringWithoutHTMLTags
    ?.split(' ')
    .filter(Boolean)
    .join(' ')
    .trim()

  return sanitized
}

/**
 * Checks if a string is a valid url and has no extra substrings
 * 'www.google.com' is valid but 'www.google.com some text' is invalid
 * @param str - the string to check
 * @returns boolean
 */
export const isValidURL = (str: string) => {
  let _temp = str.trim()

  try {
    // if it only has a url it will have no other characters (and no spaces)
    if (_temp.split(' ').length > 1) return false

    new URL(_temp)
    return true
  } catch {
    return false
  }
}

/**
 * Extracts and returns urls from a string
 * @param string - the string to extract links from
 * @param returnUniqueLinks - will return unique strings
 * @returns string[]
 */
export const getLinksFromString = ({
  string,
  returnUniqueLinks
}: {
  string: string
  returnUniqueLinks?: boolean
}) => {
  const links = []
  const parser = new DOMParser()
  const doc = parser.parseFromString(string, 'text/html')
  const imgElements = doc.getElementsByTagName('a')

  for (let i = 0; i < imgElements.length; i++) {
    const imgElement = imgElements[i]

    if (validURL(imgElement.innerHTML)) {
      links.push(imgElement.innerHTML)
    }
  }

  if (!returnUniqueLinks) return links

  // return unique links
  const uniqueLinks: string[] = []
  links?.map((x: any) => {
    !uniqueLinks.includes(x) && uniqueLinks.push(x)
  })
  return uniqueLinks
}

/**
 * Extracts and returns html anchor tags with contents from a string
 * @param string - the string to extract anchors from
 * @param returnUniqueLinks - will return unique strings
 * @returns string[]
 */
export const getHTMLAnchorsFromString = ({
  string,
  returnUniqueAnchors
}: {
  string: string
  returnUniqueAnchors?: boolean
}) => {
  const anchors = string?.match(
    /<a[\s]+([^>]+)>((?:.(?!\<\/a\>))*.)<\/a>/g
  )

  let anchorsWithoutInnerText: string[] = []

  if (anchors && anchors.length) {
    for (let i = 0; i < anchors?.length!; i++) {
      const parser = new DOMParser()
      const htmlDOC = parser.parseFromString(anchors[i], 'text/html')
      validURL(htmlDOC.body.innerText) &&
        anchorsWithoutInnerText.push(anchors[i])
    }
  }

  if (!returnUniqueAnchors) return anchorsWithoutInnerText

  // return unique anchors
  const uniqueAnchors: string[] = []
  anchorsWithoutInnerText?.map((x: string) => {
    !uniqueAnchors.includes(x) && uniqueAnchors.push(x)
  })
  return uniqueAnchors
}

/**
 * Reads text from user clipboard
 * @returns string
 */
export const readTextFromClipboard = async (): Promise<string> => {
  try {
    const text = await navigator.clipboard.readText()
    return text
  } catch {
    return ''
  }
}

/**
 * Check if an image exists IRL
 * @params url - string
 * @returns string
 */
export const doesImageExist = async (
  url: string
): Promise<boolean> => {
  return new Promise(resolve => {
    const img = new Image()

    img.src = url
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
  })
}

export function filterProcessedText(
  processedText: string,
  type: string
) {
  const allowedTags: any = [
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'P',
    'DIV',
    'A',
    'SPAN',
    'STRONG',
    'UL',
    'LI'
  ]
  let allowedCount: any = {
    H1: 1,
    H2: 1,
    H3: 1,
    H4: 2,
    H5: 1,
    H6: 1,
    UL: 1,
    LI: 1,
    STRONG: 1,
    P: 1,
    DIV: 1,
    A: 1,
    SPAN: 1
  }

  const SLICE_TAGS = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']

  const virtualDOM = parse(processedText)

  Array.from(virtualDOM.childNodes).forEach((node: any) => {
    const nodeName = (node.rawTagName || node.tagName)?.toUpperCase()

    if (!nodeName) {
      return
    }

    if (
      !allowedTags.includes(nodeName) ||
      !allowedCount[nodeName] ||
      node.innerText === ''
    ) {
      node.remove()
    } else {
      if (type === 'singlePost') {
        if (
          SLICE_TAGS.includes(nodeName) &&
          node?.textContent?.length > 400
        ) {
          node.textContent = node?.textContent?.slice(0, 400)
        } else if (nodeName === 'UL' && node.childNodes.length > 0) {
          // Select only the first child of UL tag
          const firstChild = node.childNodes[0]
          node.innerHTML = ''
          node.appendChild(firstChild)
        }
        allowedCount[nodeName]--
      } else {
        if (
          SLICE_TAGS.includes(nodeName) &&
          node?.textContent?.length > 200
        ) {
          node.textContent = node?.textContent?.slice(0, 200) + '...'
        } else if (nodeName === 'UL' && node.childNodes.length > 0) {
          // Select only the first child of UL tag
          const firstChild = node.childNodes[0]
          node.innerHTML = ''
          node.appendChild(firstChild)
        } else {
          node.innerHTML = node.childNodes
            .filter((item: any) => item.nodeType === 3)
            .map((item: any) => item.toString().trim())
            .join(' ')

          if (node.innerHTML.length > 200) {
            node.innerHTML = node.innerHTML.slice(0, 200) + '...'
          }
        }
        allowedCount[nodeName]--
      }
    }
  })

  return virtualDOM.toString()
}

export const removeLinksFromText = (text: string) => {
  const moddedText = text.replaceAll(/(https?:\/\/[^\s]+)/g, '')
  return moddedText
}

/**
 *
 * @param text The text from which to remove links
 * @param useContentOnlyTags Use content only tags to get text for content, use false to include heading tags as well to get text for post header
 * @returns Content to be used
 */
export const getContentFromText = (
  text: string = '',
  useContentOnlyTags: boolean = false
) => {
  if (!text || text.trim().length === 0) {
    return
  }

  const doc = parse(text || '')
  const tags = useContentOnlyTags
    ? ['p', 'div', 'a']
    : ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'a', 'li']
  for (let tag of tags) {
    const items = doc.querySelectorAll(tag)
    const item = items.filter(
      element => element.innerText.length > 0
    )[0]

    if (
      item && // if the element exists
      !!item.innerText // if the inner text is not empty or undefined or null
    ) {
      // Try to get text only nodes
      return (
        item.childNodes.filter(
          node => node.nodeType === NodeType.TEXT_NODE
        )[0]?.innerText ?? item.innerText
      )
    }
  }
}

/**
 *
 * @param title The title of the post
 * @returns The title of the post without any html tags and stuff
 */
export const sanitizeTitle = (
  title: string,
  removeLinks: boolean = true
) => {
  const doc = parse(title).innerText
  return removeLinks ? removeLinksFromText(doc) : doc
}

export const formatCurrency = (value: any) => {
  if (value < 1000) {
    return value
      .toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
      .replace(/\$/g, '')
  } else {
    const formattedValue =
      value % 10 === 0 ? value / 1000 : value / 1000
    return (
      formattedValue
        .toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
        .replace(/\$/g, '') + 'k'
    )
  }
}

export const timeDifference = (date: Date) => {
  const now = new Date()
  const secondsDiff = differenceInSeconds(now, date)

  if (secondsDiff < 60) {
    return `${secondsDiff}s`
  } else {
    const minutesDiff = differenceInMinutes(now, date)

    if (minutesDiff < 60) {
      return `${minutesDiff}m`
    } else {
      const hoursDiff = differenceInHours(now, date)

      if (hoursDiff < 24) {
        return `${hoursDiff}h`
      } else {
        const daysDiff = differenceInDays(now, date)
        return `${daysDiff}d`
      }
    }
  }
}

export const replaceYoutubeLinksWithFrames = (doc: HTMLElement) => {
  const links = doc.querySelectorAll('a[href]')

  for (let i = 0; i < links.length; i++) {
    const link = links[i]
    const href = link.getAttribute('href') as string

    const youtubeID = youtubeParser(href)

    if (!youtubeID) {
      continue
    }

    link.innerHTML = `<iframe width="560" height="336" src="https://www.youtube.com/embed/${youtubeID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
  }

  return doc
}

export const replaceFileDivs = (text?: string) => {
  if (!text) {
    return
  }

  const doc = parse(text)
  const fileDivs = doc.querySelectorAll('div[data-url]')

  for (let i = 0; i < fileDivs.length; i++) {
    const fileDiv = fileDivs[i]
    const fileURL = fileDiv.getAttribute('data-url')
    const fileType = fileDiv.getAttribute('data-filetype')

    if (!fileType || !fileURL) {
      continue
    }

    let innerHTML: string = ''

    if (fileType.startsWith('video')) {
      innerHTML = `<video src="${fileURL}" controls />`
    } else if (fileType.startsWith('audio')) {
      innerHTML = `<audio src="${fileURL}" controls />`
    } else if (fileType.startsWith('image')) {
      innerHTML = `<img src="${fileURL}" alt='Picked image' />`
    }

    fileDiv.innerHTML = innerHTML
  }

  replaceYoutubeLinksWithFrames(doc)
  return doc.toString()
}

export const getCardText = (
  title?: string,
  text?: string,
  preview?: ILinkDetails,
  id?: string
) => {
  let data: {
    title?: string
    content?: string
    isPreviewText?: boolean
  } = {
    title,
    content: htmlToFormattedText(text),
    isPreviewText: false
  }

  // if still empty, then use content
  if (!data.title || data.title.trim().length === 0) {
    data.title = data.content
    data.content = undefined
  }

  const testTitle = sanitizeTitle(data.title || '', true)

  // If title is still empty or undefined
  if (!testTitle || testTitle.trim().length === 0) {
    if (preview?.title) {
      data.title = preview.title
      data.content = preview.description
      data.isPreviewText = true
    }
  } else {
    data.title = testTitle
  }

  // sanitize the description
  if (data.content) {
    const testDescription = sanitizeTitle(data.content, true)

    if (data.title) {
      data.content = testDescription
    }
  }

  return data
}

export const getCardImage = (
  cardText: ReturnType<typeof getCardText>,
  text?: string,
  preview?: ILinkDetails
) => {
  let fileSrc: string | undefined
  let isVideo = false

  if (cardText.isPreviewText && preview?.image) {
    fileSrc = preview.image
    isVideo = preview.youtubeId ? true : false
  } else {
    if (!text) {
      return
    }

    const doc = parse(text)
    const fileTags = doc.querySelectorAll(
      'div[data-file]:not([data-fileType^="audio"]),img'
    )

    const videoFile = fileTags.find(tag =>
      tag.getAttribute('data-fileType')?.startsWith('video')
    )

    if (videoFile) {
      isVideo = true
      fileSrc = videoFile.getAttribute('data-url')
    } else {
      const tag = fileTags[0]

      if (tag?.rawTagName === 'img' || tag?.tagName === 'img') {
        fileSrc = tag.getAttribute('src')
      } else if (
        tag?.rawTagName === 'div' ||
        tag?.tagName === 'div'
      ) {
        fileSrc = tag.getAttribute('data-url')
      }
    }
  }

  return fileSrc ? { src: fileSrc, isVideo } : undefined
}

export const getNotificationText = (
  type: string,
  title: any,
  count: number,
  limit: number
) => {
  switch (type) {
    case 'upvote':
      return `Your post "${title?.slice(
        0,
        limit
      )}..." has been upvoted by ${count} people.`
    case 'downvote':
      return `Your post "${title?.slice(
        0,
        limit
      )}..." has been downvoted by ${count} people.`
    case 'comment':
      return `${count} new replies on your post "${title?.slice(
        0,
        limit
      )}...".`
    case 'tip':
      return `Hey, you got ${count}μ tip on your post "${title?.slice(
        0,
        limit
      )}...".`
    default:
      return null
  }
}

export const formatNumber = (value: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    compactDisplay: 'short',
    notation: 'compact'
  })

  return formatter.format(value)
}
