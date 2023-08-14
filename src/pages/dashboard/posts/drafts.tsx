import React from 'react'
import { DashboardLayout } from 'components/pages/dashboard'

import { NoPostCard } from 'components/pages/dashboard/macros'

const Drafts = () => {
  return (
    <DashboardLayout>
      <div className={`flex flex-col gap-2 w-full`}>
        <NoPostCard text='No drafts here yet.' />
      </div>
    </DashboardLayout>
  )
}

export default Drafts
