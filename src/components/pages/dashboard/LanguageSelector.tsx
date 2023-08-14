import Icon from 'components/core/Icon'
import React, { useCallback } from 'react'
import Typography from 'components/core/Typography'
import Popover from 'components/Popover'
import { languages as allLanguages } from 'const'
import http from 'services/http-common'
import { QueryClient, useMutation } from 'react-query'
import { toast } from 'react-toastify'

interface LanguageSelectorProps {
  preferedLanguages?: any
  setPreferedLanguages?: any
  language?: any
  setLanguage?: any
}

export function LanguageSelector({
  preferedLanguages,
  setPreferedLanguages,
  language,
  setLanguage
}: LanguageSelectorProps) {
  const queryClient = new QueryClient()
  const setLanguageMutation = useMutation(
    (data: any) => {
      return http.put(`/languages`, data)
    },
    {
      onSuccess: data => {
        if (data?.data?.success) {
          queryClient.refetchQueries(['getUser', 1], {
            active: true,
            exact: true
          })
        }
      },
      onError: err => {
        toast.error('Error. Cannot change language preference!')
      }
    }
  )

  const onClick = useCallback(
    (code: string) => {
      if (!preferedLanguages?.includes(code)) {
        let updatedList: any
        if (preferedLanguages?.length === 3) {
          const selectedIndex = preferedLanguages.indexOf(language)
          updatedList = [
            ...preferedLanguages.slice(0, selectedIndex),
            code,
            ...preferedLanguages.slice(selectedIndex + 1)
          ]
        } else {
          updatedList = [code, ...preferedLanguages]
        }

        setPreferedLanguages(updatedList.slice(0, 3))
        setLanguageMutation.mutate({
          language: code,
          preferedLanguages: updatedList.slice(0, 3)
        })
      } else {
        setLanguageMutation.mutate({
          language: code,
          preferedLanguages
        })
      }
      setLanguage(code)
    },
    [
      preferedLanguages,
      setPreferedLanguages,
      language,
      setLanguage,
      setLanguageMutation
    ]
  )

  return (
    <div className='rounded-[0.25rem] bg-grayish p-0.5 flex flex-row gap-2'>
      {preferedLanguages?.map((lang: string, index: number) => (
        <div
          onClick={() => onClick(lang)}
          key={lang}
          className='flex items-center flex-row gap-2'
        >
          {index !== 0 && (
            <div className='h-full border-l border-stroke' />
          )}
          <Typography
            type='body'
            className={`rounded-[0.25rem] ${
              language === lang
                ? 'bg-primary text-baseWhite'
                : 'bg-transparent text-grayL'
            } grid place-items-center !leading-[0.9rem] tracking-medium !text-xs font-medium uppercase w-[1.625rem] h-[1.625rem] cursor-pointer transition-all`}
          >
            {lang}
          </Typography>
        </div>
      ))}

      <Popover>
        <Icon
          name='chevronDown'
          raw
          className='text-body'
          size={16}
        />

        {() => (
          <div className='bg-grayish rounded-lg p-2 max-h-[50vh] overflow-y-scroll overflow-x-hidden languageList'>
            {allLanguages
              .map(lang => lang[lang.length - 1])
              .filter(
                lang =>
                  language !== lang &&
                  !preferedLanguages?.includes(lang)
              )
              .map(lang => (
                <div
                  onClick={() => onClick(lang)}
                  className='!w-[1.625rem] !h-[1.625rem] cursor-pointer !bg-grayish hover:!bg-slate-200 grid place-items-center !p-0 !border-0'
                  key={lang}
                >
                  <Typography
                    type='body'
                    className='my-1 !leading-[0.9rem] text-body tracking-medium !text-xs font-medium uppercase '
                  >
                    {lang}
                  </Typography>
                </div>
              ))}
          </div>
        )}
      </Popover>
    </div>
  )
}
