"use client";

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import Container from "@/components/Container"
import { demoNews, NewsItem } from "@/data/demoNews"

const categories = [
  { id: 'announcement', label: 'Мэдээлэл' },
  { id: 'maintenance', label: 'Үйлчилгээ' },
  { id: 'advice', label: 'Зөвлөгөө' },
  { id: 'video', label: 'Видео бичлэг' },
  { id: 'community', label: 'Нийгэмд' },
]

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, [newsId]);

  const fetchNews = async () => {
    try {
      // Find the news from demo data
      const foundNews = demoNews.find((item) => item.id === newsId);
      setNews(foundNews || null);

      // Get related news (same category, excluding current)
      if (foundNews) {
        const related = demoNews
          .filter((item) =>
            item.id !== newsId &&
            item.category === foundNews.category
          )
          .slice(0, 2);
        setRelatedNews(related);
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-600">Уншиж байна...</p>
        </div>
      </main>
    );
  }

  if (!news) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Container>
          <div className="py-20 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Мэдээ олдсонгүй</h1>
            <Link href="/news" className="inline-flex items-center gap-2 px-4 py-2.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all duration-200 font-medium group">
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  const categoryLabel = categories.find(c => c.id === news.category)?.label || 'Мэдээ';
  const pinnedBadge = null

  return (
    <main className="min-h-screen bg-gray-50">
      <Container>
        {/* Header */}
        <div className="py-8">
          <Link href="/news" className="inline-flex items-center gap-2 px-4 py-2.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all duration-200 mb-6 font-medium group">
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          </Link>

          <div className="bg-white rounded-2xl overflow-hidden shadow-lg p-8">
            {/* Title & Category */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                  {categoryLabel}
                </span>
                {pinnedBadge}
                <span className="text-gray-500 text-sm">{new Date(news.publishedAt).toLocaleDateString()}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {news.title}
              </h1>
              <p className="text-lg text-gray-600">
                {news.excerpt}
              </p>
            </div>

            {/* Banner Image */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedImage(news.bannerImage)}>
              <Image
                src={news.bannerImage}
                alt={news.title}
                fill
                unoptimized
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="text-white opacity-0 hover:opacity-100 transition-opacity">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {news.content}
              </div>
            </div>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Холбоотой мэдээ</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedNews.map(item => (
                    <Link
                      key={item.id}
                      href={`/news/${item.id}`}
                      className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        <Image
                          src={item.bannerImage}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-teal-600">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{new Date(item.publishedAt).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-96 md:max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Том зураг"
              width={1200}
              height={800}
              unoptimized
              className="object-contain w-full h-auto"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/90 text-gray-900 rounded-full p-2 hover:bg-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
