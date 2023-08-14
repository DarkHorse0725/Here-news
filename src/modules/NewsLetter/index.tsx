import * as React from 'react'

import Input from 'components/core/Input'
import Button from 'components/core/Button'
import Form from 'components/core/Form'
import { subscribeValidation } from './validation'
import Icon from 'components/core/Icon'
import { BsDiamondFill } from 'react-icons/bs'
import Typography from 'components/core/Typography'

interface ISubscribeForm {
  apiEndpoint: string
  initialValues?: any
  onAPICallSuccess: (data?: any) => any
}

function NewsLetter({
  initialValues,
  onAPICallSuccess,
  apiEndpoint
}: ISubscribeForm) {
  // const { create } = useSubscribeForm({
  //   onAPICallSuccess,
  //   apiEndpoint
  // })

  const [userEmail, setUserEmail] = React.useState('')

  const handleUserEmailChange = (value: string) => {
    setUserEmail(value)
  }

  return (
    <div className='relative bg-[#53389E] w-full rounded-[10px] cursor-pointer text-[#ECECEC] p-5'>
      <div className='flex justify-between mb-6'>
        <div className='flex gap-[0.1rem] items-end'>
          <p className='text-[1.3rem] lg:text-[1.7rem] text-white'>
            {' '}
            here{' '}
          </p>
          <div className='flex items-center text-[1rem] gap-1 translate-y-[0.1rem]'>
            <p className='w-[0.25rem] h-[0.25rem] lg:w-[0.3rem] lg:h-[0.3rem] rounded-[50%] bg-[#7F56D9]' />
            <p className='leading-[20px] lg:leading-[30px] text-[10px] md:text-[0.9rem] text-[#D7C6FE] translate-y-[-0.15rem]'>
              {' '}
              news{' '}
            </p>
          </div>
        </div>
        <div className='flex items-center'>
          <BsDiamondFill className='text-[#7F56D9]  text-[8px] lg:text-[11px] mr-[5px]' />
          <div className='flex gap-[0.3rem]'>
            {[...Array(4)].map((item, index) => (
              <div
                key={index}
                className={
                  'w-[0.5rem] h-[1.5px] lg:h-[2px] bg-[#7F56D9]'
                }
                style={{ opacity: 1 - (index * 25) / 100 }}
              />
            ))}
          </div>
          <Icon
            name='comment'
            className='hover:bg-[#D7C6FE] bg-[#D7C6FE] h-8 w-8 lg:h-10 lg:w-10 !p-[0.375rem] lg:p-3'
          />
        </div>
      </div>
      <div className='flex flex-col gap-2 mb-6'>
        <Typography type='subtitle-2' className='font-medium'>
          Weekly newsletter
        </Typography>
        <Typography type='body' className='text-here-purple-50'>
          No spam. Just the latest releases and tips, interesting
          articles, and exclusive interviews in your inbox every week.
        </Typography>
      </div>
      <Form
        onSubmit={async values => {
          // create({ ...values })
        }}
        validationSchema={subscribeValidation}
        className='w-full flex flex-row justify-between gap-1 mb-2'
        initialValues={initialValues}
      >
        <Input
          name='useremail'
          value={userEmail}
          onChange={e => handleUserEmailChange(e.target.value)}
          className={
            'text-black outline-none rounded-md h-[2.2rem] lg:h-[3rem] italic text-body'
          }
          placeholder='Write your email'
          hookToForm
        />
        <Button
          type='submit'
          size='small'
          outlined={true}
          className='h-[2.3rem] lg:h-[3.1rem]'
        >
          <Typography type='button'>Subscribe</Typography>
        </Button>
      </Form>
      <Typography type='small' className='mb-1'>
        Click the read about our&nbsp;
        <span className='underline'>privacy policy.</span>
      </Typography>
    </div>
  )
}

export default NewsLetter
