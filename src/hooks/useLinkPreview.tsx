import { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import http from 'services/http-common'
import { ILinkDetails } from 'types/interfaces'

export interface ILinkPreviews {
  preview: ILinkDetails | null
  originalLink: string
}

function useLinkPreview() {
  // store preview config for single link
  const [linkToPreview, setLinkToPreview] = useState<string | null>(
    null
  )
  const [isLinkPreviewRemoved, setIsLinkPreviewRemoved] =
    useState<boolean>(false)

  // store preview config for multiple links
  const [linksToPreview, setLinksToPreview] = useState<
    string[] | null | undefined
  >(null)
  const [isLinkPreviewsRemoved, setIsLinksPreviewRemoved] =
    useState<boolean>(false)

  // get preview for single link
  const {
    data: linkPreviewData,
    error: linkPreviewError,
    isLoading: isLoadingLinkPreview
  } = useQuery({
    queryKey: ['preview', `preview-${linkToPreview}`], // cache key
    queryFn: async () => {
      if ((linkToPreview || '').trim().length === 0) {
        return
      }
      const link = linkToPreview as string // it will always be str here
      const response = await http.get(
        `/getLinkDetails/${encodeURIComponent(link)}`
      )

      return response.data.data
    },
    staleTime: Infinity, // dont delete the cache as preview will mostly be the same
    enabled: linkToPreview?.length ? true : false
  })

  // get preview for multiple links
  const {
    data: linksPreviewData,
    error: linksPreviewError,
    isLoading: isLoadingLinksPreview
  } = useQuery({
    queryKey: [
      'bulk-previews',
      linksToPreview
        ?.map((x: any) => {
          return x
        })
        .join(' ')
    ], // cache key
    queryFn: async () => {
      const previews: PromiseSettledResult<ILinkPreviews>[] =
        await Promise.allSettled(
          (linksToPreview || []).map(async (link: any) => {
            const res = await http.get(
              `/getLinkDetails/${encodeURIComponent(link)}`
            )

            const data = res ? (res.data.data as ILinkDetails) : null
            return { preview: data, originalLink: link }
          })
        )
      // @ts-ignore
      return (
        previews
          // @ts-ignore
          .filter(preview => preview.value)
          // @ts-ignore
          .map(preview => preview.value)
      )
    },
    staleTime: Infinity, // dont delete the cache as preview will mostly be the same
    enabled: linksToPreview?.length ? true : false
  })

  const getLinkPreview = useCallback((link: string) => {
    setIsLinkPreviewRemoved(false)
    setLinkToPreview(link)
  }, [])

  const removeLinkPreview = useCallback(
    () => setIsLinkPreviewRemoved(true),
    []
  )

  const getLinksPreview = useCallback((links: any) => {
    setIsLinksPreviewRemoved(false)
    setLinksToPreview(links)
  }, [])

  const linkPreview = useMemo(
    () =>
      isLinkPreviewRemoved || typeof linkPreviewData == 'undefined'
        ? null
        : linkPreviewData,
    [isLinkPreviewRemoved, linkPreviewData]
  )

  return {
    // for single link
    linkPreviewError,
    linkPreview,
    isLoadingPreview: isLoadingLinkPreview,
    getLinkPreview,
    removeLinkPreview,
    // for multiple links
    linksPreviewError,
    linksPreview: isLinkPreviewsRemoved ? null : linksPreviewData,
    isLoadingPreviews: isLoadingLinksPreview,
    getLinksPreview,
    removeLinksPreview: () => setIsLinksPreviewRemoved(true)
  }
}

export default useLinkPreview
