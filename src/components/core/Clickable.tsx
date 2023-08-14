import React from 'react'

interface IClickable {
  onClick: (...args: any[]) => any
  isUnderlined?: boolean
  className?: string
}
function Clickable({
  onClick,
  isUnderlined,
  className,
  children
}: React.PropsWithChildren<IClickable>) {
  return (
    <div
      className={`cursor-pointer ${isUnderlined ? 'underline' : ''} ${
        className ? className : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Clickable
