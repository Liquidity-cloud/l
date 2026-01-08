'use client'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import RatesTicker from './RatesTicker'

// Зургуудын жагсаалт
const mediaItems = [
  {
    type: 'image',
    src: '/images/news4.jpg',
    duration: 5000,
  },
  {
    type: 'image',
    src: '/images/news5.jpg',
    duration: 5000,
  },
]

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  const currentMedia = mediaItems[currentIndex]

  const goToNext = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaItems.length)
      setIsTransitioning(false)
    }, 500)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext()
    }, currentMedia.duration)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentMedia])

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden -mt-20 lg:-mt-24">
      <div className="absolute inset-0">
        {mediaItems.map((media, index) => (
          <div key={index} className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex && !isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}>
            <Image src={media.src} alt="Hero background" fill className="object-cover object-center" priority={index === 0} />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Rates Ticker */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <RatesTicker />
      </div>
    </section>
  )
}
