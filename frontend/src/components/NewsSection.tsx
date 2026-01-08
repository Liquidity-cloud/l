'use client'

import Image from 'next/image'
import Link from 'next/link'
import Container from './Container'
import { demoNews } from '@/data/demoNews'

export default function NewsSection() {
  const categoryLabels: Record<string, string> = {
    announcement: 'Мэдээлэл',
    maintenance: 'Үйлчилгээ',
    advice: 'Зөвлөгөө',
    video: 'Видео бичлэг',
    community: 'Нийгэмд',
  }

  const sortedNews = [...demoNews].sort((a, b) => {
    if (a.isPinnedHome === b.isPinnedHome) {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
    return a.isPinnedHome ? -1 : 1
  })

  const pinnedNews = sortedNews.filter((item) => item.isPinnedHome)
  const displayNews = pinnedNews.slice(0, 3)

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Мэдээ, мэдээлэл</h2>
            <p className="text-sm text-slate-500">Онцолсон 3 мэдээ</p>
          </div>
          <Link
            href="/news"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-full text-sm font-medium shadow-sm hover:bg-teal-700 transition-colors"
          >
            Дэлгэрэнгүй
          </Link>
        </div>

        {/* Highlighted news (pinned or fallback) */}
        {displayNews.length > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="group relative overflow-hidden rounded-2xl border border-yellow-200 bg-white shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative h-44 bg-gray-200 overflow-hidden">
                  <Image
                    src={item.bannerImage}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/90 text-teal-700 rounded-full text-xs font-medium">
                      {categoryLabels[item.category] || 'Мэдээ'}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-slate-500">{new Date(item.publishedAt).toLocaleDateString()}</p>
                  <h3 className="text-base font-semibold text-slate-900 line-clamp-2 group-hover:text-teal-700">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
