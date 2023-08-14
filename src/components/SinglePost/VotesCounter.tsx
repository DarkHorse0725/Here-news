import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import AnimatedNumber from 'react-awesome-animated-number'
import 'react-awesome-animated-number/dist/index.css'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'
import {
  deductBalance,
  toggleIsLoginModalVisible
} from 'store/slices/auth.slice'
import http from 'services/http-common'
import {
  TbArrowBigDown,
  TbArrowBigUp,
  TbArrowBigDownFilled,
  TbArrowBigUpFilled
} from 'react-icons/tb'
import Tooltip from 'components/Tooltip'
import Upvote from 'assets/upvote.svg'
import Downvote from 'assets/downvote.svg'
interface VotesCounterProps {
  posterID: string
  postId: string
  upvotes: string[]
  downvotes: string[]
  tips: any
  focused?: boolean
  isTicket?: boolean
}

const TOOLTIP_MESSAGES = [
  'Upvote this post if you find it helpful or interesting',
  'Tip the author of the post.',
  'Wanna give more tip to the author of the post.',
  'More Appreciation to the author'
]

const animationKeyframes = [
  {
    transform: 'scale(1)'
  },
  {
    transform: 'scale(0.85)'
  },
  {
    transform: 'scale(1)'
  },
  {
    transform: 'scale(1.25)'
  },
  {
    transform: 'scale(1)'
  },
  {
    transform: 'scale(0.85)'
  },
  {
    transform: 'scale(1)'
  }
]

function VotesCounter({
  posterID,
  postId,
  upvotes,
  downvotes,
  tips,
  focused = true,
  isTicket = false
}: VotesCounterProps) {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const { selectedAccount, balance } = useAppSelector(
    state => state.auth
  )

  const [updatedUpvotes, setUpdatedUpvotes] = useState<string[]>([])
  const [updatedDownvotes, setUpdatedDownvotes] = useState<string[]>(
    []
  )
  const [updatedTips, setUpdatedTips] = useState([])

  const [voted, setVoted] = useState<'upvote' | 'downvote' | null>(
    null
  )
  const [numTips, setNumTips] = useState(0)

  const upvoteButtonRef = useRef<HTMLDivElement>(null)
  const downvoteButtonRef = useRef<HTMLDivElement>(null)

  const accountId = useMemo(
    () => selectedAccount && selectedAccount._id,
    [selectedAccount]
  )

  useEffect(() => {
    setUpdatedUpvotes(upvotes)
    setUpdatedDownvotes(downvotes)
  }, [upvotes, downvotes])

  useEffect(() => {
    setUpdatedTips(tips)
  }, [tips])

  useEffect(() => {
    if (accountId) {
      if (
        updatedUpvotes &&
        updatedUpvotes.length &&
        updatedUpvotes.includes(accountId)
      ) {
        setVoted('upvote')
      } else if (
        updatedDownvotes &&
        updatedDownvotes.length &&
        updatedDownvotes.includes(accountId)
      )
        setVoted('downvote')
      else setVoted(null)
    } else {
      setVoted(null)
    }
  }, [accountId, updatedUpvotes, updatedDownvotes])

  useEffect(() => {
    if (accountId) {
      if (updatedTips && updatedTips.length) {
        const findTip: any = updatedTips?.find(
          (tip: any) => tip.userId === accountId
        )
        if (findTip) {
          setNumTips(findTip?.count)
        } else {
          setNumTips(0)
        }
      }
    }
  }, [accountId, updatedTips])

  const handleUpvote = () => {
    if (!accountId) {
      dispatch(toggleIsLoginModalVisible(true))
      return
    }

    if (upvoteRestrictions || isLoading) return

    if (voted !== 'upvote') {
      setVoted('upvote')
      handleUpvoteQuery.mutate({
        userId: accountId
      })
    } else if (numTips < 5) {
      setNumTips(numTips + 1)
      handleTipToAuthorQuery.mutate()
    }

    upvoteButtonRef.current?.animate(animationKeyframes, {
      duration: 280
    })
  }

  const handleUpvoteQuery = useMutation(
    (data: { userId: string }) => {
      return http.post(`/upvotePost/${postId}`, data)
    },
    {
      onSuccess: () => {
        if (selectedAccount) {
          if (
            updatedDownvotes.some(dv => dv === selectedAccount._id)
          ) {
            setUpdatedDownvotes(prev =>
              prev.filter(uid => uid !== selectedAccount._id)
            )
          }
          setUpdatedUpvotes(prev => [...prev, selectedAccount._id])
        }
        dispatch(deductBalance(1))
        queryClient.invalidateQueries('getExplorePosts')
        queryClient.invalidateQueries('getSinglePost')
      },
      onError: () => {
        toast.error('Error upvoting!')
      }
    }
  )

  const handleTipToAuthorQuery = useMutation(
    () => {
      return http.post(`/tipPostAuthor/${postId}`, {})
    },
    {
      onSuccess: () => {
        dispatch(deductBalance(1))
        queryClient.invalidateQueries('getExplorePosts')
      },
      onError: () => {
        toast.error('Error giving tip!')
      }
    }
  )

  const handleDownvote = () => {
    if (!accountId) {
      dispatch(toggleIsLoginModalVisible(true))
      return
    }
    if (voted === 'downvote' || downvoteRestrictions || isLoading)
      return
    if (
      updatedDownvotes &&
      updatedDownvotes.length &&
      updatedDownvotes.includes(accountId)
    )
      return

    setVoted('downvote')
    handleDownvoteQuery.mutate({
      userId: accountId
    })

    downvoteButtonRef.current?.animate(animationKeyframes, {
      duration: 280
    })
  }

  const handleDownvoteQuery = useMutation(
    (data: { userId: string }) => {
      return http.post(`/downvotePost/${postId}`, data)
    },
    {
      onSuccess: () => {
        if (selectedAccount) {
          if (updatedUpvotes.some(dv => dv === selectedAccount._id)) {
            setUpdatedUpvotes(prev =>
              prev.filter(uid => uid !== selectedAccount._id)
            )
          }
          setUpdatedDownvotes(prev => [...prev, selectedAccount._id])
        }
        dispatch(deductBalance(1))
        queryClient.invalidateQueries('getExplorePosts')
        queryClient.invalidateQueries('getSinglePost')
      },
      onError: () => {
        toast.error('Error downvoting!')
      }
    }
  )

  const formatCount = useCallback((value: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
      compactDisplay: 'short',
      notation: 'compact'
    })
    return formatter.format(value)
  }, [])

  const formattedUpvotes = useMemo(
    () => formatCount(updatedUpvotes.length),
    [updatedUpvotes, formatCount]
  )
  const formattedDownvotes = useMemo(
    () => formatCount(updatedDownvotes.length),
    [updatedDownvotes, formatCount]
  )

  const isLoading =
    handleDownvoteQuery.isLoading ||
    handleTipToAuthorQuery.isLoading ||
    handleUpvoteQuery.isLoading

  const upvoteRestrictions =
    numTips >= 5 || posterID === selectedAccount?._id || balance <= 0

  const downvoteRestrictions =
    numTips >= 2 ||
    voted === 'downvote' ||
    posterID === selectedAccount?._id ||
    balance <= 0

  const upvoteMessage = useMemo(
    () =>
      isLoading
        ? 'Updating...'
        : posterID === selectedAccount?._id
        ? "You can't upvote or tip yourself"
        : balance === 0
        ? 'Balance is 0'
        : numTips >= 5
        ? 'Cannot give more tip'
        : numTips > 2
        ? TOOLTIP_MESSAGES[3]
        : TOOLTIP_MESSAGES[numTips],
    [numTips, posterID, selectedAccount, balance, isLoading]
  )

  const downvoteMessage = useMemo(
    () =>
      isLoading
        ? 'Updating...'
        : posterID === selectedAccount?._id
        ? "You can't downvote yourself"
        : balance === 0
        ? 'Balance is 0'
        : numTips >= 2 || voted === 'downvote'
        ? 'Cannot downvote this post now!'
        : 'Downvote this post if you find it non-interesting',
    [numTips, voted, posterID, selectedAccount, balance, isLoading]
  )

  return isTicket ? (
    <div className='flex flex-row gap-1 sm:gap-2 items-center'>
      <div className='flex flex-row gap-1 sm:gap-2 items-center'>
        <Tooltip
          id='upvoteButton'
          link={Upvote}
          message={upvoteMessage}
        >
          <div
            onClick={handleUpvote}
            className='cursor-pointer'
            ref={upvoteButtonRef}
          >
            {voted === 'upvote' ? (
              <TbArrowBigUpFilled className='text-secondary h-5 w-5 sm:w-6 sm:h-6' />
            ) : (
              <TbArrowBigUp className='text-grayMd h-5 w-5 sm:w-6 sm:h-6' />
            )}
          </div>
        </Tooltip>
        <AnimatedNumber
          className='select-none transition duration-100 ease-in-out tracking-medium text-sm sm:text-base leading-[160%] font-medium text-grayMd'
          // @ts-ignore
          value={formattedUpvotes}
          hasComma={false}
          size={16}
        />
      </div>

      {/* Separator */}
      <div className='w-[0.3rem] h-[0.3rem] shrink-0 rounded-full bg-grayMd' />

      <div className='flex flex-row gap-1 sm:gap-2 items-center'>
        <Tooltip
          id='downvoteButton'
          link={Downvote}
          message={downvoteMessage}
        >
          <div
            onClick={handleDownvote}
            className='cursor-pointer'
            ref={downvoteButtonRef}
          >
            {voted === 'downvote' ? (
              <TbArrowBigDownFilled className='text-secondary h-5 w-5 sm:w-6 sm:h-6' />
            ) : (
              <TbArrowBigDown className='text-grayMd h-5 w-5 sm:w-6 sm:h-6' />
            )}
          </div>
        </Tooltip>

        <AnimatedNumber
          className='select-none transition duration-100 ease-in-out tracking-medium text-sm sm:text-base leading-[160%] font-medium text-grayMd'
          // @ts-ignore
          value={formattedDownvotes}
          hasComma={false}
          size={16}
        />
      </div>
    </div>
  ) : (
    <div
      className={`flex flex-row items-center gap-1 rounded-lg border-stroke border-opacity-50 pl-[0.625rem] pr-[0.875rem] py-1 ${
        focused
          ? 'border bg-baseWhite'
          : 'border-0 sm:border bg-historic sm:bg-baseWhite'
      }`}
    >
      {/* Upvote button */}
      <Tooltip
        id='upvoteButton'
        link={Upvote}
        message={upvoteMessage}
      >
        <div
          className={`w-7 h-7 sm:w-10 sm:h-10 grid place-items-center rounded-lg ${
            voted === 'upvote'
              ? 'shadow-[0px_2px_4px_rgba(0,0,0,0.06)] bg-historic'
              : 'bg-transparent'
          } cursor-pointer`}
          ref={upvoteButtonRef}
          onClick={handleUpvote}
        >
          {voted === 'upvote' ? (
            <TbArrowBigUpFilled className='text-secondary w-5 h-5 sm:w-6 sm:h-6' />
          ) : (
            <TbArrowBigUp className='text-grayMd w-5 h-5 sm:w-6 sm:h-6' />
          )}
        </div>
      </Tooltip>

      {/* Upvote count */}
      <Tooltip id='upvoteCount' message='Total upvotes'>
        <div className='place-items-center hidden sm:grid'>
          {/* Large Screen count */}
          <AnimatedNumber
            className='hidden sm:block select-none transition duration-100 ease-in-out font-medium leading-[1.2rem] text-grayMedium'
            // @ts-ignore
            value={formattedUpvotes}
            hasComma={false}
            size={16}
          />
        </div>

        <div className='grid place-items-center sm:hidden'>
          {/* Large Screen count */}
          <AnimatedNumber
            className='hidden sm:block select-none transition duration-100 ease-in-out font-medium leading-[1.2rem] text-grayMedium'
            // @ts-ignore
            value={formattedUpvotes}
            hasComma={false}
            size={10}
          />
        </div>
      </Tooltip>

      {/* Downvote button */}
      <Tooltip
        id='downvoteButton'
        link={Downvote}
        message={downvoteMessage}
      >
        <div
          className={`w-7 h-7 sm:w-10 sm:h-10 grid place-items-center bg-historic rounded-lg ${
            voted === 'downvote'
              ? 'shadow-[0px_2px_4px_rgba(0,0,0,0.06)] bg-historic'
              : 'bg-transparent'
          } cursor-pointer`}
          ref={downvoteButtonRef}
          onClick={handleDownvote}
        >
          {voted === 'downvote' ? (
            <TbArrowBigDownFilled className='text-secondary w-5 h-5 sm:w-6 sm:h-6' />
          ) : (
            <TbArrowBigDown className='text-grayMd w-5 h-5 sm:w-6 sm:h-6' />
          )}
        </div>
      </Tooltip>

      {/* Downvote count */}
      <Tooltip id='downvoteCount' message='Total downvotes'>
        {/* Large screen count */}
        <div className='place-items-center hidden sm:grid'>
          <AnimatedNumber
            className='select-none transition duration-100 ease-in-out font-medium !text-[0.625rem] sm:!text-xs leading-[1.2rem] text-grayMedium'
            // @ts-ignore
            value={formattedDownvotes}
            hasComma={false}
            size={16}
          />
        </div>

        <div className='place-items-center grid sm:hidden'>
          <AnimatedNumber
            className='select-none transition duration-100 ease-in-out font-medium !text-[0.625rem] sm:!text-xs leading-[1.2rem] text-grayMedium'
            // @ts-ignore
            value={formattedDownvotes}
            hasComma={false}
            size={10}
          />
        </div>
      </Tooltip>
    </div>
  )
}

export default VotesCounter
