import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 }
}

// Split text into letters
const renderText = (text, className, baseWeight = 400) => {
  return [...text].map((char, i) => (
    <span
      key={i}
      className={className}
      style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))
}

// Hover animation setup
const setupTextHover = (container, type) => {
  if (!container) return

  const letters = container.querySelectorAll('span')
  const { min, max } = FONT_WEIGHTS[type]

  const animateLetter = (letter, weight, duration = 0.25) => {
    gsap.to(letter, {
      duration,
      ease: 'power2.out',
      fontVariationSettings: `'wght' ${weight}`
    })
  }

  const handleMouseMove = (e) => {
    const { left } = container.getBoundingClientRect()
    const mouseX = e.clientX - left

    letters.forEach(letter => {
      const { left: l, width: w } = letter.getBoundingClientRect()

      const distance = Math.abs(mouseX - (l - left + w / 2))

      // Smooth Gaussian effect
      const intensity = Math.exp(-(distance ** 2) / 2000)

      const weight = min + (max - min) * intensity

      animateLetter(letter, weight)
    })
  }

  const handleMouseLeave = () => {
    letters.forEach(letter => {
      gsap.to(letter, {
        duration: 0.4,
        ease: 'power2.out',
        fontVariationSettings: `'wght' ${FONT_WEIGHTS[type].default}`
      })
    })
  }

  container.addEventListener('mousemove', handleMouseMove)
  container.addEventListener('mouseleave', handleMouseLeave)
}

const Welcome = () => {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)

  useGSAP(() => {
    setupTextHover(titleRef.current, 'title')
    setupTextHover(subtitleRef.current, 'subtitle')
  }, [])

  return (
    <section id='welcome' className='p-10'>
      <p ref={subtitleRef}>
        {renderText(
          'Hey, Im Rabah Welcome to my',
          'text-3xl font-georama',
          100
        )}
      </p>

      <h1 ref={titleRef} className='mt-7'>
        {renderText(
          'Portfolio',
          'text-9xl italic font-georama',
          400
        )}
      </h1>

      <div className='small-screen mt-10'>
        <p>This portfolio is designed only for desktop and tablet devices</p>
      </div>
    </section>
  )
}

export default Welcome