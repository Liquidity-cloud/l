'use client'

import { useEffect, useState } from 'react'

const slidesData = [
  {
    id: 1,
    bg: "/images/news1.jpg",
    number: '01',
    title: 'Хашаа барьцаалсан зээл',
    features: ['Хүү: 1.5% сараар', 'Хугацаа: 36 сар хүртэл', 'Барьцаа: Газар'],
  },
  {
    id: 2,
    bg: "/images/news2.jpg",
    number: '02',
    title: 'Автомашин авах зээл',
    features: ['Хүү: 1.8% сараар', 'Хугацаа: 24 сар хүртэл', 'Урьдчилгаа: 20% буюу түүнээс дээш'],
  },
  {
    id: 3,
    bg: "/images/news4.jpg",
    number: '03',
    title: 'ХБҮЦ',
    features: ['Хүү: 1.2% сараар', 'Хугацаа: 60 сар хүртэл', 'Хөнгөлөлттэй нөхцөл'],
  },
  {
    id: 4,
    bg: "/images/news5.jpg",
    number: '04',
    title: 'Бизнес зээл',
    features: ['Хүү: 2.0% сараар', 'Хугацаа: 48 сар хүртэл', 'Баталгаажуулалт: 24 цагт'],
  },
]

export default function AccordionSlider() {
  const [active, setActive] = useState<number>(-1)
  const [hoveredSlide, setHoveredSlide] = useState<number>(-1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const setActiveSlide = (i: number) => {
    setActive((prev) => (prev === i ? -1 : i))
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') previousSlide()
      if (e.key === 'ArrowRight') nextSlide()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const nextSlide = () => {
    setActive((prev) => {
      if (prev === -1) return 0
      return (prev + 1) % slidesData.length
    })
  }

  const previousSlide = () => {
    setActive((prev) => {
      if (prev === -1) return slidesData.length - 1
      return (prev - 1 + slidesData.length) % slidesData.length
    })
  }

  return (
    <div className="slider-container">
      <div className="accordion-slider" role="list">
        {slidesData.map((s, i) => (
          <div
            key={s.id}
            className={`slide ${isMobile ? (active === i ? 'active' : '') : (hoveredSlide === i ? 'active' : '')}`}
            style={{ backgroundImage: `url('${s.bg}')` }}
            onMouseEnter={!isMobile ? () => setHoveredSlide(i) : undefined}
            onMouseLeave={!isMobile ? () => setHoveredSlide(-1) : undefined}
            onClick={isMobile ? () => setActiveSlide(i) : undefined}
            role="listitem"
            aria-expanded={isMobile ? active === i : hoveredSlide === i}
          >
            <div className="slide-content">
              <div className="car-brand">{s.title}</div>
              
              {/* Desktop: Дэлгэрэнгүй мэдээлэл - hover хийхэд гарна */}
              {!isMobile && (
                <div className="slide-details">
                  <ul className="slide-features">
                    {s.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .slider-container {
          width: 100%;
          max-width: 1200px;
          height: 80vh;
          position: relative;
          overflow: hidden;
          margin: 0 auto;
          padding: 28px 16px 16px;
        }

        .accordion-slider {
          display: flex;
          height: calc(100% - 40px);
          position: relative;
          gap: 18px;
        }

        .slide {
          flex: 1;
          position: relative;
          cursor: pointer;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: all 0.8s cubic-bezier(0.4,0,0.2,1);
          overflow: hidden;
          filter: grayscale(0.7) contrast(0.95);
          display: flex;
          align-items: flex-end;
          border-radius: 18px;
          min-width: 140px;
        }

        .slide:hover { filter: grayscale(0.15) contrast(1); transform: scale(1.01); }
        .slide.active { flex: 2.7; filter: grayscale(0) contrast(1.02); transform: scale(1.02); border: 2px solid rgba(159,255,107,0.12); }

        .slide::before {
          content: "";
          position: absolute;
          top: 0; left:0; right:0; bottom:0;
          background: linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.72) 75%);
          transition: all 0.6s ease;
        }

        .slide-content {
          position: absolute;
          bottom: 30px;
          left: 28px;
          right: 28px;
          color: white;
          z-index: 3;
          display: flex;
          flex-direction: column;
        }
        .slide.active .slide-content { bottom: 84px; transition: all 0.8s cubic-bezier(0.4,0,0.2,1) 0.12s; }

        .car-brand {
          font-size: 16px;
          font-weight: 700;
          color: rgba(255,255,255,0.95);
          margin-bottom: 8px;
          position: relative;
          z-index: 10;
        }

        .slide-details {
          margin-top: 6px;
        }
        
        .slide:not(.active) .slide-details {
          display: none;
        }

        .slide-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .slide-features li {
          font-size: 13px;
          color: rgba(255,255,255,0.85);
          padding: 4px 0;
          padding-left: 18px;
          position: relative;
          font-weight: 500;
        }
        .slide-features li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #9fff6b;
          font-weight: 700;
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .slider-container { height: 72vh; padding: 20px 12px; }
          .car-brand { font-size: 15px; }
        }
        
        @media (max-width: 640px) {
          .slider-container { 
            height: auto; 
            min-height: auto;
            padding: 20px 16px 12px;
          }
          .accordion-slider { 
            flex-direction: column; 
            gap: 12px; 
            height: auto;
          }
          .slide { 
            min-height: 100px; 
            border-radius: 16px;
            flex: none;
            transition: all 0.5s cubic-bezier(0.4,0,0.2,1);
          }
          .slide.active { 
            min-height: 320px;
            flex: none;
            transform: scale(1);
          }
          .slide:hover {
            transform: scale(1);
          }
          .slide-content {
            bottom: 20px;
            left: 20px;
            right: 20px;
          }
          .slide.active .slide-content {
            bottom: 60px;
          }
          .car-brand { 
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 0.3px;
          }
        }
        
        @media (max-width: 380px) {
          .slider-container {
            padding: 16px 12px 10px;
            min-height: auto;
          }
          .slide {
            min-height: 90px;
          }
          .slide.active {
            min-height: 280px;
          }
          .car-brand {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  )
}
