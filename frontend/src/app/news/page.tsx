'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Container from "@/components/Container"
import { demoNews, NewsItem } from "@/data/demoNews"

// Мэдээний төрлүүд (Demo categories)
const categories = [
  { id: "all", label: "Бүгд" },
  { id: "announcement", label: "Мэдээлэл" },
  { id: "maintenance", label: "Үйлчилгээ" },
  { id: "advice", label: "Зөвлөгөө" },
  { id: "video", label: "Видео бичлэг" },
  { id: "community", label: "Нийгэмд" },
]

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const sortedNews = [...demoNews].sort((a, b) => {
    if (a.isPinnedNews === b.isPinnedNews) {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
    return a.isPinnedNews ? -1 : 1
  })

  const filteredNews = sortedNews.filter((item) => {
    if (activeCategory === "all") return true
    return item.category === activeCategory
  })

  const isAll = activeCategory === "all"
  const pinnedItems = filteredNews.filter((item) => item.isPinnedNews)
  const firstPinned = isAll ? pinnedItems[0] : undefined
  const gridItems = isAll
    ? filteredNews.filter((item) => !firstPinned || item.id !== firstPinned.id)
    : filteredNews

  return (
    <main className="min-h-screen bg-gray-50">
      <Container>
        {/* Category Tabs */}
        <div className="py-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                    ? "bg-transparent text-teal-600 border border-teal-300 shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pinned spotlight (one large, only when All is selected) */}
        {firstPinned && (
          <Link
            href={`/news/${firstPinned.id}`}
            className="mb-8 block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-6 items-stretch">
              <div className="relative col-span-1 lg:col-span-3 min-h-[220px] lg:min-h-[320px] overflow-hidden">
                <Image
                  src={firstPinned.bannerImage}
                  alt={firstPinned.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-white/90 text-teal-700 rounded-full text-xs font-medium">
                    {categories.find((c) => c.id === firstPinned.category)?.label || "Мэдээ"}
                  </span>
                  <span className="px-3 py-1 bg-white/80 text-slate-700 rounded-full text-[11px] font-medium">
                    {new Date(firstPinned.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="col-span-1 lg:col-span-2 p-6 lg:p-8 flex flex-col justify-center gap-3">
                <h2 className="text-xl lg:text-3xl font-bold text-slate-900 leading-tight">{firstPinned.title}</h2>
                <p className="text-sm text-slate-600 line-clamp-4">{firstPinned.excerpt}</p>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{categories.find((c) => c.id === firstPinned.category)?.label || "Мэдээ"}</span>
                  <span>·</span>
                  <span>{new Date(firstPinned.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* No extra pinned cards; pinned items appear in grid (except banner item in All) */}

        {/* News Grid */}
        <div className="pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gridItems.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                  <Image
                    src={item.bannerImage}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-medium text-teal-600">
                      {categories.find(c => c.id === item.category)?.label || "Мэдээ"}
                    </span>
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 line-clamp-2 group-hover:text-teal-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {filteredNews.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-1">Мэдээ олдсонгүй</h3>
              <p className="text-slate-500">Энэ төрлийн мэдээ одоогоор байхгүй байна.</p>
            </div>
          )}
        </div>
      </Container>
    </main>
  )
}
