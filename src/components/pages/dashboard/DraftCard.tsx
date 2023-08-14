import React from 'react'
import Typography from 'components/core/Typography'
import { Button } from './Button'
import Edit from 'assets/dashboard/Edit.svg'
import Trash from 'assets/dashboard/Trash.svg'

function DraftCard({ _id, title, desc }: any) {
  //   const title = useMemo(
  //     () =>
  //       sanitizeTitle(
  //         initialTitle ||
  //           preview?.title ||
  //           getContentFromText(text) ||
  //           '',
  //         false
  //       ),
  //     [initialTitle, text, preview]
  //   )

  const onClickCard = (e: any) => {
    // if (!['action-btns'].includes(e.target.id)) {
    //   router.push(`/post/${_id}`)
    // }
  }

  return (
    <div
      onClick={(e: any) => {
        onClickCard(e)
      }}
      className={`flex flex-row items-center justify-between px-2 md:px-[30px] py-4 bg-baseWhite border-[1px] border-stroke rounded-lg gap-2 cursor-pointer`}
    >
      <div className='flex flex-col gap-2'>
        <Typography
          type='subtitle'
          className={`!text-base md:!text-[20px] text-body font-medium leading-5 md:leading-7 text-ellipsis break-words truncate max-w-[20ch] md:max-w-[40ch] xl:max-w-[70ch]`}
        >
          In Depth: Solving China’s Soaring You..
        </Typography>
        <Typography
          type='button'
          className='text-grayL text-sm md:text-base !leading-[25px] font-[400]'
        >
          As predictable as sunrise, my little panic sting up my time
          for letting...
        </Typography>
      </div>
      <div id='action-btns' className='flex flex-row gap-2'>
        <Button
          icon={Edit}
          className='!h-10 md:!h-12 w-10 md:!w-12 pl-1 !bg-historic'
        />
        <Button
          icon={Trash}
          className='!h-10 md:!h-12 w-10 md:!w-12 pl-1 !bg-historic'
        />
      </div>
    </div>
  )
}

export { DraftCard }
