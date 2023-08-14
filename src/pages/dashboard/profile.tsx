import React, { useState } from 'react'
import Image from 'next/image'
import { DashboardLayout, Button } from 'components/pages/dashboard'
import {
  ActivitiesItem,
  ProfileCardHeader,
  VerifyUserItem
} from 'components/pages/dashboard/macros'
import { useAppSelector } from 'store/hooks'
import http from 'services/http-common'
import { useQuery } from 'react-query'
import InviteModal from 'components/pages/home/InviteModal'

// icons and images
import InviteIcon from 'assets/InviteIcon.svg'
import Graph from 'assets/dashboard/graph.svg'

const Profile = () => {
  const { selectedAccount } = useAppSelector(state => state.auth)

  const [isInviteVisible, setIsInviteVisible] = useState(false)

  const toggleIsInviteVisible = () => {
    setIsInviteVisible(prev => !prev)
  }

  const getProfileStats = async () => {
    const response = await http.get(`/getProfileStats`)
    return response.data.data
  }

  const { data: stats } = useQuery({
    queryKey: `getProfileStats`,
    queryFn: getProfileStats
  })

  const getInvitedUsers = async () => {
    const response = await http.get(`/getInvitedUsers`)
    return response.data.data
  }

  const { data: invitedUsers, refetch } = useQuery({
    queryKey: `getInvitedUsers`,
    queryFn: getInvitedUsers
  })

  return (
    <DashboardLayout>
      <div className='flex flex-col gap-2'>
        <ProfileCardHeader heading='Invitations'>
          {selectedAccount?.verified ? (
            <>
              <div className='w-full flex flex-row items-center justify-between'>
                <p className='text-base font-[400] leading-[25px] text-grayMd'>
                  {selectedAccount?.invites?.allowedLimit
                    ? `${selectedAccount?.invites?.allowedLimit}`
                    : 0}{' '}
                  Available ({invitedUsers?.length} Invited)
                </p>
                <Button
                  text='Invite Friends'
                  icon={InviteIcon}
                  className='md:!w-[147px]'
                  onClick={() => toggleIsInviteVisible()}
                />
              </div>
              {invitedUsers?.length > 0 ? (
                <p className='text-sm font-[500] leading-[22px] text-[#213642]'>
                  List of Invited Friends
                </p>
              ) : null}
              <div className='flex flex-col gap-3 max-h-[370px] overflow-auto'>
                {invitedUsers?.length > 0 &&
                  invitedUsers?.map((user: any) => (
                    <VerifyUserItem
                      key={user._id}
                      email={user?.useremail}
                      status={user?.status}
                      _id={user?.user?._id}
                      displayName={user?.user?.displayName}
                      verified={user?.user?.verified}
                      userIdHash={user?.user?.userIdHash}
                    />
                  ))}
              </div>
            </>
          ) : (
            <p className='text-sm md:text-base font-[400] leading-[25px] text-grayMd py-2'>
              No invitation Available yet.
            </p>
          )}
        </ProfileCardHeader>
        <ProfileCardHeader heading='Activities'>
          <div className='w-full flex flex-col md:flex-row md:items-center md:justify-between gap-16 md:gap-[87px] py-4'>
            <div className='flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-start gap-4'>
              <ActivitiesItem
                name='Posts'
                title={stats?.totalPosts ?? 0}
                icon='posted'
                desc={`${stats?.totalUpvotes ?? 0} upvotes, ${
                  stats?.totalDownvotes ?? 0
                } downvotes.`}
                isLink
                href='/dashboard/posts/posted'
              />
              <ActivitiesItem
                name='Bookmarks'
                title={stats?.bookmarksCount ?? 0}
                icon='bookmarkIcon'
                isLink
                href='/dashboard/posts/bookmarks'
                desc={`${
                  stats?.bookmarksCount ?? 0
                } Posts bookmarked.`}
              />
              <ActivitiesItem
                name='Votes'
                title={
                  stats?.givenUpvotesCount ||
                  stats?.givenDownvotesCount
                    ? stats?.givenUpvotesCount +
                      stats?.givenDownvotesCount
                    : 0
                }
                icon='voted'
                desc={`${stats?.givenUpvotesCount ?? 0} upvotes, ${
                  stats?.givenDownvotesCount ?? 0
                } downvotes.`}
              />
              <ActivitiesItem
                name='Tips'
                title={`${
                  stats?.givenTipsCount ?? 0 + stats?.totalTips ?? 0
                }μ`}
                icon='tips'
                desc={`${stats?.totalTips ?? 0}μ received, ${
                  stats?.givenTipsCount ?? 0
                }μ spends.`}
              />
              {selectedAccount?.verified ? (
                <ActivitiesItem
                  name='Invites'
                  title={`${
                    stats?.pendingInvitesCount ??
                    0 + stats?.registeredInvitesCount ??
                    0
                  }`}
                  icon='userIcon'
                  desc={`${
                    stats?.registeredInvitesCount ?? 0
                  } registered, ${
                    stats?.pendingInvitesCount ?? 0
                  } pending.`}
                />
              ) : null}
            </div>
            <Image
              src={Graph}
              alt='graph'
              height={100}
              width={100}
              className='w-full h-auto md:max-w-[513px] max-h-[257px] blur-xs'
            />
          </div>
        </ProfileCardHeader>
      </div>
      <InviteModal
        isInviteVisible={isInviteVisible}
        toggleIsInviteVisible={toggleIsInviteVisible}
        refetchInvites={refetch}
      />
    </DashboardLayout>
  )
}

export default Profile
