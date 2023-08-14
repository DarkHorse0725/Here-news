import Layout from 'components/Layouts'
import Loader from 'components/Loader'
import { useRouter } from 'next/router'
import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { QueryClient, useMutation, useQuery } from 'react-query'
import http from 'services/http-common'
import QRCode from 'react-qr-code'
import { toast } from 'react-toastify'
import { Button } from 'components/pages/dashboard'
import Image from 'next/image'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import axios from 'axios'

// Icons
import ArrowBack from 'assets/dashboard/arrowLeft.svg'
import Copy from 'assets/dashboard/copy.svg'
import { HiThumbUp, HiMoon } from 'react-icons/hi'

const Invoice = () => {
  const router = useRouter()
  const queryClient = new QueryClient()
  const { id } = router.query

  const [isInvoiceVerified, setIsInvoiceVerified] = useState(false)

  // Get invoice data (Query)
  const getInvoice = async () => {
    const response = await http.get(`/invoice/${id}`)
    return {
      data: response.data.data
    }
  }
  const { isLoading, data } = useQuery({
    queryKey: `invoice/${id}`,
    queryFn: getInvoice
  })
  const invoiceData = data?.data

  useEffect(() => {
    if (invoiceData?.status === 'paid') {
      setIsInvoiceVerified(true)
    }
  }, [invoiceData?.status])

  // Check invoice status (paid or unpaid) (Query)
  const checkInvoiceStatus = async () => {
    const response = await http.get(`/invoice/${id}/status`)
    return {
      data: response.data
    }
  }

  const invoiceStatusQuery = useQuery({
    queryKey: `invoiceStatus`,
    queryFn: checkInvoiceStatus,
    enabled: false,
    onSuccess: data => {
      if (data?.data?.success && data?.data?.data?.invoiceIsPaid) {
        updateInvoiceStatus.mutate()
      } else {
        toast.error('Invoice not paid yet.')
      }
    },
    onError: () => {
      toast.error('Something went wrong.')
    }
  })

  const verifyInvoice = () => {
    invoiceStatusQuery.refetch()
  }

  // Update invoice status to paid in db, if invoice status is paid (Mutation)
  const updateInvoiceStatus = useMutation(
    () => {
      return http.patch(`/invoice/${id}/status`)
    },
    {
      onSuccess: data => {
        if (data?.data?.success) {
          toast.success('Invoice paid successfully!')
          queryClient.invalidateQueries('getUser')
          queryClient.invalidateQueries('getUserSpendingsAndIncome')
          router.push('/dashboard/wallet')
        }
      },
      onError: err => {
        toast.error('Something went wring. Please try again!')
      }
    }
  )

  // Interval to check if invoice is paid or not every 10s
  const handleInterval = useCallback(async () => {
    if (!isInvoiceVerified && invoiceData?.status !== 'paid') {
      const res = await axios.get(invoiceData?.verify) // "verify" is the url provided by alby to check invoice status
      if (res && res?.data?.settled) {
        setIsInvoiceVerified(true)
        updateInvoiceStatus.mutate()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceData?.verify])

  const verificationRef: any = useRef()
  useEffect(() => {
    verificationRef.current = setInterval(handleInterval, 10000)
    return () => {
      clearInterval(verificationRef.current)
    }
  }, [handleInterval])

  const [copied, setCopied] = useState(false)
  const onCopy = useCallback(() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <Layout pageTitle='Invoice - Here News' type='home'>
      <div className='w-full max-w-[938px] p-2 md:p-4 flex flex-col gap-8'>
        {isLoading ? (
          <div className='w-full h-64'>
            <Loader color='fill-primary' />
          </div>
        ) : (
          <>
            <Button
              text='Wallet'
              icon={ArrowBack}
              onClick={() => router.back()}
              className='w-[2.5rem] md:!w-[93px]'
              textClassName='!text-body'
            />
            <div className='w-full flex flex-col items-center gap-8'>
              <div className='flex flex-col gap-4 items-center justify-center'>
                <div className='flex bg-baseWhite rounded-[8px] p-2'>
                  <QRCode value={invoiceData?.paymentRequest} />
                </div>
                <p className='text-xs md:text-sm font-[300] leading-[140%] italic text-grayMd'>
                  Scan with your lightening Wallet
                </p>
              </div>
              <div className='w-full flex flex-row items-center h-[3rem] md:h-[70px] bg-baseWhite rounded-[8px] border-[1px] border-stroke px-[2px]'>
                <input
                  type='text'
                  value={invoiceData?.paymentRequest}
                  disabled
                  className={
                    'h-full w-full rounded-[8px] outline-none italic text-body px-2 bg-baseWhite'
                  }
                />
                <CopyToClipboard
                  onCopy={onCopy}
                  text={invoiceData?.paymentRequest}
                >
                  <button
                    className={`h-[45px] w-[45px] md:h-[62px] md:w-[92px] flex items-center justify-center gap-1 rounded-[0px_8px_8px_0] ${
                      copied ? 'bg-grayMd' : 'bg-historic'
                    }`}
                  >
                    <Image
                      src={Copy}
                      height={24}
                      width={24}
                      alt='wallet'
                      className={`${copied ? 'hidden' : ''}`}
                    />
                    <p
                      className={`hidden sm:block text-sm md:text-base font-medium leading-5 ${
                        copied ? 'text-baseWhite' : 'text-grayMd'
                      } `}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </p>
                  </button>
                </CopyToClipboard>
              </div>
              <div className='w-full flex flex-col items-center justify-center gap-4'>
                <div className='w-full flex flex-row items-center justify-center gap-2'>
                  {isInvoiceVerified ? (
                    <HiThumbUp
                      size={24}
                      fill='#59C591'
                      className=''
                    />
                  ) : (
                    <HiMoon
                      size={24}
                      fill='#858D9D'
                      className='animate-spin'
                    />
                  )}

                  <p
                    className={`text-sm md:text-base font-medium ${
                      isInvoiceVerified
                        ? 'text-[#59C591]'
                        : 'text-grayMd'
                    }`}
                  >
                    {isInvoiceVerified
                      ? 'Invoice paid successfully!'
                      : 'Waiting for you'}
                  </p>
                </div>
                <p className='text-xs font-medium  text-grayMd'>or</p>
                <Button
                  text='Verify'
                  onClick={verifyInvoice}
                  loading={
                    invoiceStatusQuery.isLoading ||
                    updateInvoiceStatus.isLoading
                  }
                  className='!w-[168px] !bg-primary'
                  textClassName='!text-white !block !text-sm md:text-base'
                  disabled={isInvoiceVerified}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default Invoice
