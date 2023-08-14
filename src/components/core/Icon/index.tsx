import { Icons } from './resolver'

export type IconsType = keyof typeof Icons
interface IIcon {
  name: IconsType
  color?: string
  variant: 'primary' | 'secondary'
  size: number
  onClick: (e: any) => any
  raw: boolean
  noHighlights: boolean
  noShadow: boolean
  disabled: boolean
  className?: string
  iconClassName?: string
}

const styles = {
  base: 'w-fit h-fit flex items-center justify-center rounded',

  sizes: {
    mini: 'p-[2px]',
    small: 'p-1',
    medium: 'p-3',
    large: 'p-4'
  },
  variants: {
    primary: {
      color: 'text-gray-500 bg-white',
      highlight: 'duration-75 hover:bg-[rgba(0,0,0,0.01)]'
    },
    secondary: {
      color: 'text-here-purple-900 bg-here-purple-50',
      highlight: 'duration-75 hover:opacity-75'
    }
  },

  shadow: 'shadow-sm',
  states: {
    disabled: 'cursor-not-allowed pointer-events-none'
  }
}

function Icon({
  name,
  size,
  onClick,
  raw,
  color,
  variant,
  noHighlights,
  noShadow,
  disabled,
  className,
  iconClassName
}: IIcon) {
  const IconSVG = Icons[name]

  return raw ? (
    <IconSVG size={size} className={className} color={color} />
  ) : (
    <button
      type='button'
      disabled={disabled}
      onClick={!disabled ? onClick : () => {}}
      className={`
        ${styles.base}
        ${styles?.variants?.[variant]?.color}
        ${disabled && styles.states.disabled}
        ${
          size <= 20
            ? styles.sizes.mini
            : size < 25
            ? styles.sizes.small
            : size < 40
            ? styles.sizes.medium
            : styles.sizes.large
        } 
        ${!noHighlights && styles?.variants?.[variant]?.highlight} 
        ${!noShadow && styles?.shadow} 
        ${className}
      `}
    >
      <IconSVG size={size} className={iconClassName} />
    </button>
  )
}

const defaultProps: Partial<IIcon> = {
  size: 25,
  onClick: () => undefined,
  raw: false,
  noHighlights: false,
  variant: 'primary',
  disabled: false,
  noShadow: false
}

Icon.defaultProps = defaultProps

export default Icon
