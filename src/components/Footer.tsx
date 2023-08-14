import Button from 'components/core/Button'
import React, {
  ChangeEvent,
  FocusEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import Icon from './core/Icon'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { changeIsSearchInputFocused } from 'store/slices/app.slice'

const PageFooter = () => {
  const isInputFocused = useAppSelector(
    state => state.app.isSearchFocused
  )
  const [searchValue, setSearchValue] = useState<string>('')
  const dispatch = useAppDispatch()

  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const onSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value)
    },
    []
  )

  const onSearch = useCallback(() => {
    if (!searchValue || searchValue.trim().length === 0) {
      return
    }

    router.push(`/search?q=${searchValue}`)
  }, [searchValue, router])

  const changeFocusedState = useCallback<
    FocusEventHandler<HTMLInputElement>
  >(
    e => {
      if (e.nativeEvent.type === 'focusin' && !isInputFocused) {
        dispatch(changeIsSearchInputFocused(true))
      } else if (
        e.nativeEvent.type === 'focusout' &&
        isInputFocused
      ) {
        dispatch(changeIsSearchInputFocused(false))
      }
    },
    [dispatch, isInputFocused]
  )

  useEffect(() => {
    if (isInputFocused) {
      inputRef.current?.focus()
    } else {
      inputRef.current?.blur()
    }
  }, [isInputFocused, dispatch])

  const onKeyDown = useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >(
    e => {
      if (e.key === 'Enter') {
        onSearch()
      } else if (e.key === 'Escape') {
        dispatch(changeIsSearchInputFocused(false))
      }
    },
    [onSearch, dispatch]
  )

  return (
    <>
      <div
        className={`fixed top-0 left-0 bottom-0 right-0 z-30 backdrop-blur-xs bg-primary transition-opacity ${
          isInputFocused
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        } bg-opacity-[45%]`}
      />

      <div
        className={`fixed bottom-0 bg-white left-0 right-0 flex flex-row justify-center transition-all items-center ${
          isInputFocused ? 'py-[2.34375rem]' : 'py-3'
        } z-30`}
      >
        <div className='bg-historic w-full mx-1 max-w-[45rem] flex flex-row items-center h-12 border border-r-0 rounded-lg rounded-tr-none rounded-br-none border-stroke'>
          <div className='flex-1 py-1 px-2 flex flex-row items-center gap-[0.6875rem]'>
            <Icon name='search' className='text-grayL' raw />

            <input
              ref={inputRef}
              className='placeholder:italic text-base flex-1 outline-none bg-transparent'
              placeholder='Search'
              value={searchValue}
              onFocus={changeFocusedState}
              onBlur={changeFocusedState}
              onChange={onSearchChange}
              onKeyDown={onKeyDown}
            />
          </div>

          <Button
            onClick={onSearch}
            className='w-12 h-12 bg-primary aspect-square !p-0 grid place-items-center rounded-none rounded-r-lg border-none'
            leftIcon='send'
          />
        </div>
      </div>
    </>
  )
}

export default PageFooter
