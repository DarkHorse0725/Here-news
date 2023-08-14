import { ImageProps } from 'next/image'
import React, { useState } from 'react'
import Image from 'next/image'

interface Props extends ImageProps {
  fallbackClassName: string
}

const CustomImage = ({
  src,
  className,
  fallbackClassName,
  alt,
  ...props
}: Props) => {
  const [isValidImage, setIsValidImage] = useState<boolean>(true)

  return isValidImage ? (
    <Image
      {...props}
      src={src}
      className={className}
      onError={() => setIsValidImage(false)}
      alt={alt || ''}
    />
  ) : (
    <div
      className={fallbackClassName}
      style={{ backgroundImage: `url("${src}")` }}
    />
  )
}

export default CustomImage
