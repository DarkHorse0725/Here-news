import Image from 'next/image'
import React from 'react'
import Logo from 'assets/marketingCards/whiteLogo.svg'
import Mark from 'assets/marketingCards/questionMark.svg'
import Link from 'next/link'

const AboutCard = () => {
  return (
    <div className='rounded-lg p-4 flex flex-col mb-4 gap-4 bg-primary'>
      {/* Header */}
      <div className='flex flex-row items-start justify-between'>
        <Image
          src={Logo.src}
          width={50}
          height={33.5}
          alt='Alternate logo'
        />
        <Image
          src={Mark.src}
          width={30.437}
          height={47.089}
          alt='Want to learn more?'
        />
      </div>

      <div className='flex flex-row items-center flex-wrap gap-4'>
        <Link
          href='/post/64917c0b80f495ef997681dd'
          className='text-base text-historic italic font-medium leading-[140%] tracking-medium hover:underline no-underline'
        >
          About Us
        </Link>

        <Link
          href='/post/64917d0580f495ef9976820e'
          className='text-base text-historic italic font-medium leading-[140%] tracking-medium hover:underline no-underline'
        >
          How it works
        </Link>

        <Link
          href='/post/64917dd380f495ef9976825e'
          className='text-base text-historic italic font-medium leading-[140%] tracking-medium hover:underline no-underline'
        >
          Terms of Service
        </Link>

        <Link
          href='/post/64917e6e80f495ef997682fb'
          className='text-base text-historic italic font-medium leading-[140%] tracking-medium hover:underline no-underline'
        >
          Cookie Policy
        </Link>
        <Link
          href='/post/64917e3c80f495ef997682a4'
          className='text-base text-historic italic font-medium leading-[140%] tracking-medium hover:underline no-underline'
        >
          Privacy Policy
        </Link>
      </div>

      <div className='flex flex-col gap-2 items-stretch'>
        <div className='h-[0.03125rem] self-stretch bg-secondary' />
        <p className='tracking-medium italic text-xs text-historic'>
          ©2023 Mighty Voices, LLC
        </p>
      </div>
    </div>
  )
}

export default AboutCard
