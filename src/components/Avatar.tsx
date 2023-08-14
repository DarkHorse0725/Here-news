import React from 'react'
import DefaultAvatar from 'assets/avatar.png'
import Image from 'next/image'

interface AvatarProps {
  imageUrl?: string | null
  containerClassNames?: string
  iamgeClassNames?: string
  bg?: 'light' | 'gray' | 'dark'
}

function Avatar({
  imageUrl,
  containerClassNames,
  iamgeClassNames,
  bg
}: AvatarProps) {
  return (
    <div
      className={`relative rounded-[0.5rem] overflow-hidden ${
        containerClassNames ? containerClassNames : ''
      } `}
    >
      <Image
        loader={() => (imageUrl ? imageUrl : '')}
        src={imageUrl ? imageUrl : DefaultAvatar}
        fill
        sizes='50px'
        unoptimized={true}
        alt='post image'
        className={`p-1 object-contain ${
          bg && bg === 'light'
            ? 'bg-white'
            : bg === 'gray'
            ? 'bg-[gray]'
            : 'bg-black'
        } ${iamgeClassNames ? iamgeClassNames : ''}`}
      />
    </div>
  )
}

export default Avatar
