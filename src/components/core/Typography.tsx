import React from 'react'
type TypographyType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subtitle'
  | 'subtitle-2'
  | 'subtitle-small'
  | 'body'
  | 'light-italic'
  | 'small'
  | 'bold'
  | 'link'
  | 'link-small'
  | 'button'
  | 'none'
interface ITypography {
  /**
   * The type of typography element to render.
   *
   *```js
   * "h1": { xl: "72px", lg: "64px", default: "48px" }, line-height = 120%
   *
   * "h2": { xl: "56px", lg: "48px", default: "36px" }, line-height = 120%
   *
   * "h3": { xl: "48px", lg: "40px", default: "32px" }, line-height = 120%
   *
   * "subtitle": { xl: "32px", lg: "28px", default: "24px" }, line-height = 120%
   *
   * "subtitle-2": { xl: "24px", lg: "20px", default: "18px" }, line-height = 140%
   *
   * "subtitle-small": { xl: "20px", lg: "18px", default: "16px" }, line-height = 140%
   *
   * "body": { xl: "16px", lg: "14px", default: "12px" }, line-height = 160%
   *
   * "light-italic": { xl: "16px", lg: "14px", default: "12px" }, line-height = 120%
   *
   * "small": { xl: "14px", lg: "12px", default: "10px" }, line-height = 120%
   *
   * "bold": { xl: "14px", lg: "12px", default: "10px" }, line-height = 120%
   *
   * "link": { xl: "16px", lg: "14px", default: "12px" }, line-height = 120%
   *
   * "link-small": { xl: "11px", lg: "10px", default: "9px" }, line-height = 120%
   *
   * "button": { xl: "16px", lg: "14px", default: "12px" }, line-height = 120%
   *
   * "none": size = "default", line-height = "default"
   *
   * ```
   */
  type: TypographyType
  className?: string
  innerHTML?: string
}

function Typography({
  type,
  className,
  children,
  innerHTML
}: React.PropsWithChildren<ITypography>) {
  switch (type) {
    case 'h1':
      return (
        <h1
          className={`text-5xl lg:text-6xl xl:text-7xl leading-[1.2em] ${className}`}
        >
          {children}
        </h1>
      )
    case 'h2':
      return (
        <h2
          className={`text-4xl lg:text-5xl xl:text-[3.5rem] leading-[1.2em] ${className}`}
        >
          {children}
        </h2>
      )
    case 'h3':
      return (
        <h3
          className={`text-3xl lg:text-4xl xl:text-5xl leading-[1.2em] ${className}`}
        >
          {children}
        </h3>
      )
    case 'subtitle':
      return (
        <h4
          dangerouslySetInnerHTML={
            innerHTML ? { __html: innerHTML } : undefined
          }
          className={`text-xl leading-7 font-medium ${className}`}
        >
          {!innerHTML && children}
        </h4>
      )
    case 'subtitle-2':
      return (
        <h5
          className={`text-lg lg:text-xl xl:text-2xl leading-[1.4em] ${className}`}
        >
          {children}
        </h5>
      )
    case 'subtitle-small':
      return (
        <h6
          className={`text-base lg:text-lg xl:text-xl leading-[1.6em] ${className}`}
        >
          {children}
        </h6>
      )
    case 'body':
      return (
        <p
          dangerouslySetInnerHTML={
            innerHTML ? { __html: innerHTML } : undefined
          }
          className={`text-xs lg:text-sm xl:text-base leading-[1.2em] ${className}`}
        >
          {!innerHTML && children}
        </p>
      )
    case 'light-italic':
      return (
        <em
          className={`text-xs lg:text-sm xl:text-base leading-[1.2em] ${className}`}
        >
          {children}
        </em>
      )
    case 'small':
      return (
        <small
          className={`text-xs xl:text-sm leading-[1.2em] ${className}`}
        >
          {children}
        </small>
      )
    case 'bold':
      return (
        <strong
          className={`text-xs xl:text-sm leading-[1.2em] ${className}`}
        >
          {children}
        </strong>
      )
    case 'link':
      return (
        <p
          className={`text-base underline text-primary leading-[1.4rem] ${className}`}
        >
          {children}
        </p>
      )
    case 'link-small':
      return (
        <a
          className={`text-[8px] lg:text-[10px] xl:text-[11px] ${className}`}
          href='#'
        >
          {children}
        </a>
      )
    case 'button':
      return (
        <p className={`text-base leading-[1.1875rem] ${className}`}>
          {children}
        </p>
      )
    case 'none':
      return <p className={` ${className}`}>{children}</p>
    default:
      return null // Return null if type doesn't match any of the cases
  }
}
export default Typography
