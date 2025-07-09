"use client"

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from './button'
import Image from 'next/image'

const HeroSection = () => {

  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(()=>{

    const imageElement = imageRef.current

    const handleScroll = () =>{

      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      
      if(scrollPosition > scrollThreshold){
        imageElement?.classList.add('scrolled')
      }
      else{
        imageElement?.classList.remove("scrolled")
      }
    };

    window.addEventListener('scroll',handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)

  },[])


  return (
    <section className='w-full pt-36 md:pt-48 pb-10'>
      <div className='space-y-6 text-center'>
        <div className='space-y-6 mx-auto'>
          <h1 className='text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title'>Next-Gen Coaching for
            <br />
            the Next-Gen Workforce
          </h1>
          <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xl'>AI-powered career guidance to help you land your next opportunity with confidence</p>
        </div>
      </div>

      <div className='flex justify-center space-x-4 py-6'>
        <Link href={"/dashboard"}>
          <Button size={'lg'} className='px-8'>
            Get Started
          </Button>
        </Link>
      </div>

      <div className='hero-image-wrapper mt-5 md:mt-0'>
        <div ref={imageRef} className='hero-image'>
          <Image src={"/banner2.jpeg"} width={1280} height={720} alt='banner' className='rounded-lg shadow-2xl border mx-auto' priority></Image>
        </div>
      </div>
    </section>
  )
}

export default HeroSection