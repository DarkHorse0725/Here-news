import Input from 'components/Input'
import Button from 'components/core/Button'
import {
  DashboardLayout,
  LanguageSelector
} from 'components/pages/dashboard'
import {
  SettingSection,
  SettingSubSection
} from 'components/pages/dashboard/macros'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import Switch from 'assets/dashboard/toggle.svg'
import Typography from 'components/core/Typography'
import { useAppSelector } from 'store/hooks'

const Settings = () => {
  const { selectedAccount } = useAppSelector(state => state.auth)
  const [language, setLanguage] = useState('')
  const [preferedLanguages, setPreferedLanguages] = useState<
    string[]
  >([])

  useEffect(() => {
    let userlanguage = navigator?.language
    if (selectedAccount?.language) {
      setLanguage(selectedAccount?.language)
    } else {
      setLanguage(userlanguage.slice(0, 2))
    }
    if (
      selectedAccount?.preferedLanguages &&
      selectedAccount?.preferedLanguages?.length > 0
    ) {
      setPreferedLanguages(selectedAccount?.preferedLanguages)
    } else {
      setPreferedLanguages([userlanguage.slice(0, 2)])
    }
  }, [selectedAccount])

  return (
    <DashboardLayout>
      <div className='flex flex-col max-w-[100rem] w-full gap-4'>
        {/* Preffered language section */}
        <SettingSection
          title='Preferred Language'
          subtitle='Set the language according to your choice.'
          className='items-center'
        >
          <SettingSubSection title='Language'>
            <LanguageSelector
              language={language}
              setLanguage={setLanguage}
              preferedLanguages={preferedLanguages}
              setPreferedLanguages={setPreferedLanguages}
            />
          </SettingSubSection>
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection
          title='Notifications'
          subtitle='Manage the notifications that you get about your activities and recommendations.'
          isAvailable={false}
        >
          <SettingSubSection
            title='Comments'
            isAvailable={false}
            subtitle='Comments on your posts and replies to your comments'
          >
            <Image
              src={Switch}
              alt='Comments on your posts and replies to your comments'
            />
          </SettingSubSection>

          <SettingSubSection
            title='Upvote / Downvote'
            isAvailable={false}
            subtitle='Reactions on your posts.'
          >
            <Image src={Switch} alt='Reactions on your posts' />
          </SettingSubSection>
        </SettingSection>

        {/* Password section */}
        <SettingSection
          title='Change Password'
          isAvailable={false}
          subtitle='If you have decided that the password is not effective, it is here for you to change it.'
        >
          <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-4'>
            <Typography
              type='button'
              className={`font-medium text-sm md:!text-base !leading-[1.2rem] tracking-medium !text-grayL min-w-[136px]`}
            >
              Old Password
            </Typography>
            <Input
              type='password'
              placeholder='Old Password'
              className='!flex !flex-col md:flex-row rounded-lg border-frameStroke w-full max-w-[27.1875rem]'
              inputClassName='h-10 md:h-12 placeholder:italic placeholder:font-light text-base leading-[1.4rem] tracking-medium text-grayL disabled:bg-[#f9fafb]'
              iconClassName='!text-grayLight h-4 w-4 md:h-6 md:w-6'
              value=''
              onChange={() => {}}
              inputProps={{
                disabled: true
              }}
            />
          </div>
          <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-4'>
            <Typography
              type='button'
              className={`font-medium text-sm md:!text-base !leading-[1.2rem] tracking-medium !text-grayL min-w-[136px]`}
            >
              New Password
            </Typography>
            <Input
              type='password'
              placeholder='New Password'
              className='!flex !flex-col md:flex-row rounded-lg border-frameStroke w-full max-w-[27.1875rem]'
              inputClassName='h-10 md:h-12 placeholder:italic placeholder:font-light text-base leading-[1.4rem] tracking-medium text-grayL disabled:bg-[#f9fafb]'
              iconClassName='!text-grayLight h-4 w-4 md:h-6 md:w-6'
              value=''
              onChange={() => {}}
              inputProps={{
                disabled: true
              }}
            />
          </div>

          <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-4'>
            <Typography
              type='button'
              className={`font-medium text-sm md:!text-base !leading-[1.2rem] tracking-medium !text-grayL min-w-[136px]`}
            >
              Confirm Password
            </Typography>
            <Input
              type='password'
              placeholder='Confirm Password'
              className='!flex !flex-col md:flex-row rounded-lg border-frameStroke w-full max-w-[27.1875rem]'
              inputClassName='h-10 md:h-12 placeholder:italic placeholder:font-light text-base leading-[1.4rem] tracking-medium text-grayL disabled:bg-[#f9fafb]'
              iconClassName='!text-grayLight h-4 w-4 md:h-6 md:w-6'
              value=''
              onChange={() => {}}
              inputProps={{
                disabled: true
              }}
            />
          </div>
        </SettingSection>

        {/* Save button */}
        <Button
          type='button'
          variant='light'
          className='bg-baseWhite rounded-lg border-stroke grid place-items-center w-32 h-12 !p-0 !text-base !leading-[1.2rem] tracking-medium font-medium text-grayMedium'
          disabled
        >
          Save Settings
        </Button>
      </div>
    </DashboardLayout>
  )
}

export default Settings
