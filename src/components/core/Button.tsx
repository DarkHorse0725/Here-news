import Loader from 'react-loading'
import { Icons } from './Icon/resolver'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

interface IButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'light'
  size: 'small' | 'medium' | 'large'
  outlined?: boolean
  isLoading?: boolean
  isDisabled?: boolean
  leftIcon?: keyof typeof Icons
  rightIcon?: keyof typeof Icons
  href?: string
  type?: 'submit' | 'reset' | 'button' | undefined
}

const styles = {
  withIcons: 'flex items-center gap-3',
  loaderContainer:
    'absolute top-0 left-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] border-0 w-full h-full',
  sizes: {
    small:
      'px-4 py-2 md:px-2 md:py-2.5 lg:px-2 lg:py-2.5 rounded-[0.5rem] border-[1px]',
    medium:
      'px-6 py-2 md:px-6 md:py-3 lg:px-6 lg:py-2 rounded-[0.5rem] border-2',
    large: ''
  },
  variants: {
    primary: {
      filled:
        'bg-primary text-white border-primary hover:opacity-95 transition-opacity',
      outlined:
        'border-primary bg-white text-primary  hover:opacity-95 transition-opacity'
    },
    light: {
      filled:
        'bg-historic text-body border-frameStroke hover:opacity-95 transition-opacity',
      outlined: ''
    }
  },
  states: {
    loading: 'relative',
    disabled: ''
  }
}

function Button({
  isLoading,
  outlined,
  leftIcon,
  rightIcon,
  href,
  onClick,
  type,
  ...props
}: PropsWithChildren<IButton>) {
  const LeftIconSVG = leftIcon && Icons[leftIcon]
  const RightIconSVG = rightIcon && Icons[rightIcon]

  if (href && onClick) {
    throw 'Please either provide an href or onClick'
  }

  return href ? (
    <Link
      type='button'
      href={href}
      className={`
        no-underline
        ${styles.sizes[props.size]}
        ${
          styles.variants[props.variant][
            outlined ? 'outlined' : 'filled'
          ]
        }
        ${isLoading ? styles.states.loading : ''}
        ${props.isDisabled ? styles.states.disabled : ''}
        ${leftIcon || rightIcon ? styles.withIcons : ''}
        ${props.className}
      `}
    >
      {LeftIconSVG && <LeftIconSVG size={25} />}
      {props.children}
      {RightIconSVG && <RightIconSVG size={25} />}

      {/* loader overlay */}
      {isLoading && (
        <span
          className={`
            ${styles.sizes[props.size]} 
            ${styles.loaderContainer}
          `}
        >
          <Loader type='spin' color='white' width={25} height={25} />
        </span>
      )}
    </Link>
  ) : (
    <button
      type={type ? type : 'button'}
      onClick={onClick}
      {...props}
      className={`
        ${styles.sizes[props.size]}
        ${
          styles.variants[props.variant][
            outlined ? 'outlined' : 'filled'
          ]
        }
        ${isLoading ? styles.states.loading : ''}
        ${props.isDisabled ? styles.states.disabled : ''}
        ${leftIcon || rightIcon ? styles.withIcons : ''}
        ${props.className}
      `}
    >
      {LeftIconSVG && <LeftIconSVG size={25} />}
      {props.children}
      {RightIconSVG && <RightIconSVG size={25} />}

      {/* loader overlay */}
      {isLoading && (
        <span
          className={`
            ${styles.sizes[props.size]} 
            ${styles.loaderContainer}
          `}
        >
          <Loader type='spin' color='white' width={25} height={25} />
        </span>
      )}
    </button>
  )
}

Button.defaultProps = {
  variant: 'primary',
  size: 'medium'
}

export default Button
