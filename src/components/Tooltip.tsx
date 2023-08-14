import React, { PropsWithChildren } from 'react'

interface Props {
  id: string
  message: string
  link?: string
  className?: string
}

/**
 * @deprecated Please remove this component as it is not exactly needed
 * place the "Tooltip" import directly in _app.tsx and provide exactly same tooltip id in the overall app
 * use a single tooltip id, i.e. globalTooltip as data-tooltip-id and provide content directly to the intended component, i.e. div, button as data-tooltip-content
 */
const Tooltip = ({
  children,
  message,
  className
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={className}
      data-tooltip-id='globalTooltip'
      data-tooltip-content={message}
    >
      {children}
    </div>
  )
}

export default Tooltip
