'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const formatTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

interface ChatWidgetProps {
  isOpen: boolean
  onClose: () => void
}

interface QuickQuestion {
  id: string
  label: string
  query: string
  response: {
    mn: string
    en: string
  }
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const { language, t } = useLanguage()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: t('Сайн байна уу 👋', 'Hello 👋'), sender: 'bot', timestamp: new Date() }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showQuestions, setShowQuestions] = useState(true)
  const [swipeY, setSwipeY] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)

  // 4 Асуулт
  const quickQuestions: QuickQuestion[] = [
    {
      id: 'loan',
      label: t('Зээлийн нөхцөл', 'Loan Terms'),
      query: t('Зээлийн нөхцөл ба хүүгийн хэмжээ ямар байна?', 'What are loan terms and interest rates?'),
      response: {
        mn: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
        en: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.`
      }
    },
    {
      id: 'products',
      label: t('Бүтээгдэхүүнүүд', 'Products'),
      query: t('Та ямар бүтээгдэхүүн санал болгож байна?', 'What products do you offer?'),
      response: {
        mn: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        en: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
      }
    },
    {
      id: 'branches',
      label: t('Салбарын мэдээлэл', 'Branch Info'),
      query: t('Та хаана байрладаг бөгөөд цагийн хуваарь ямар байна?', 'Where are you located and what are your hours?'),
      response: {
        mn: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
        en: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.`
      }
    },
    {
      id: 'process',
      label: t('Зээл авах процесс', 'How to Apply'),
      query: t('Зээл авахын тулд ямар процесс дамжих хэрэгтэй вэ?', 'What is the process to apply for a loan?'),
      response: {
        mn: `Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.`,
        en: `Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`
      }
    }
  ]

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Swipe to close handler
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY
    const diff = currentY - touchStartY.current
    
    // Only allow swipe down
    if (diff > 0) {
      setSwipeY(diff)
    }
  }

  const handleTouchEnd = () => {
    // Close if swiped down more than 80px
    if (swipeY > 80) {
      onClose()
    }
    setSwipeY(0)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setShowQuestions(false)
    setIsLoading(true)

    // Simulate bot thinking
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: t(
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
        ),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 600)
  }

  const handleQuickQuestion = (question: QuickQuestion) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: question.query,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setShowQuestions(false)
    setIsLoading(true)

    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: language === 'mn' ? question.response.mn : question.response.en,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 400)
  }

  if (!isOpen) return null

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-80 h-96 flex flex-col overflow-hidden"
      style={{
        transform: `translateY(${Math.max(0, swipeY)}px)`,
        transition: swipeY === 0 ? 'transform 0.3s ease-out' : 'none',
        opacity: 1 - (swipeY / 400)
      }}
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="40" height="40" viewBox="0 0 320 320"
            xmlns="http://www.w3.org/2000/svg" fill="none" className="flex-shrink-0">
            <defs>
              <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EAF2FF"/>
                <stop offset="100%" stopColor="#93C5FD"/>
              </linearGradient>
              <filter id="softShadow" x="-35%" y="-35%" width="170%" height="170%">
                <feDropShadow dx="0" dy="6" stdDeviation="10"
                  floodColor="#1E40AF" floodOpacity="0.28"/>
              </filter>
            </defs>

            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0; 0 -6; 0 0"
                dur="2.4s"
                repeatCount="indefinite"/>

              <ellipse cx="160" cy="160" rx="110" ry="100"
                fill="url(#headGrad)" filter="url(#softShadow)"/>

              <ellipse cx="160" cy="165" rx="70" ry="52"
                fill="#020617"/>

              <ellipse cx="138" cy="160" rx="8" ry="10" fill="#38BDF8">
                <animate attributeName="ry"
                  values="10;10;2;10"
                  keyTimes="0;0.6;0.65;1"
                  dur="4s"
                  repeatCount="indefinite"/>
              </ellipse>

              <ellipse cx="182" cy="160" rx="8" ry="10" fill="#38BDF8">
                <animate attributeName="ry"
                  values="10;10;2;10"
                  keyTimes="0;0.6;0.65;1"
                  dur="4s"
                  repeatCount="indefinite"/>
              </ellipse>

              <ellipse cx="122" cy="178" rx="8" ry="5"
                fill="#F472B6" opacity="0.9"/>
              <ellipse cx="198" cy="178" rx="8" ry="5"
                fill="#F472B6" opacity="0.9"/>

              <path d="M140 176 Q160 192 180 176"
                stroke="#38BDF8"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"/>
            </g>
          </svg>
          <div>
            <h3 className="font-semibold text-sm flex items-center gap-2">{t('AI Туслах', 'AI Assistant')}
              <div className="w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
            </h3>
            <p className="text-xs opacity-90">{t('Онлайн', 'Online')}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex flex-col gap-0.5">
              <div
                className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none shadow-md'
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'
                } ${messages.length === 1 && msg.sender === 'bot' ? 'text-5xl font-bold' : ''}`}
              >
                {msg.text}
              </div>
              {messages.length === 1 && msg.sender === 'bot' && (
                <div className="text-left pl-2 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">{t('Онлайн', 'Online')}</span>
                </div>
              )}
              <div className={`text-xs ${msg.sender === 'user' ? 'text-right pr-2' : 'text-left pl-2'} text-gray-400`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* 4 Асуулт - эхэндээ харуулах */}
        {showQuestions && messages.length === 1 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {quickQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => handleQuickQuestion(q)}
                className="px-2 py-2 text-xs bg-white border border-gray-200 rounded-xl hover:bg-teal-50 hover:border-teal-400 hover:shadow-sm transition-all duration-200 text-gray-700 hover:text-teal-600 font-medium text-left hover:scale-105 active:scale-95"
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                <div className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('Түр хүлээнэ үү 🤔', 'One moment 🤔')}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 p-3 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('Асуултаа бичээрэй...', 'Type your question...')}
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all duration-200 disabled:opacity-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7m0 0l-7 7m7-7H6" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
