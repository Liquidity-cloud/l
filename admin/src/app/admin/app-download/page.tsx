'use client'

import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Input, Textarea, Button, PageHeader } from '@/components/FormElements'
import { DevicePhoneMobileIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import ImageUpload from '@/components/ImageUpload'
import { useSaveReset } from '@/hooks/useSaveReset'
import { SaveResetButtons } from '@/components/SaveResetButtons'

interface AppDownloadData {
  titles: { mn: string; en: string }[]
  features: { mn: string; en: string }[]
  appStoreUrl: string
  googlePlayUrl: string
  appImageUrl: string
  // Styling options
  textFont: string
  textColor: string
  titleColor: string
  accentColor: string
  buttonBgColor: string
  buttonTextColor: string
  iconColor: string
  position: 'left' | 'right'
  // Layout positions
  titlePositions: {
    top: number
    left: number
    rotation: number
    size: string
  }[]
  featuresLayout: 'vertical' | 'horizontal' | 'grid'
}

const defaultData: AppDownloadData = {
  titles: [
    { mn: 'Манай', en: 'Our' },
    { mn: 'апп-аар', en: 'app' },
    { mn: 'илүү хялбар,', en: 'easier,' },
    { mn: 'хурдан', en: 'faster' }
  ],
  features: [
    { mn: '24/7 зээлийн мэдээлэл шалгах', en: 'Check loan info 24/7' },
    { mn: 'Хаанаас ч төлбөр төлөх', en: 'Pay from anywhere' },
    { mn: 'Хурдан зээлийн хүсэлт илгээх', en: 'Quick loan application' },
    { mn: 'Нууцлал, аюулгүй байдал', en: 'Privacy & Security' },
  ],
  appStoreUrl: '#',
  googlePlayUrl: '#',
  appImageUrl: '/App.svg',
  textFont: 'font-sans',
  textColor: '#334155',
  titleColor: '#1e293b',
  accentColor: '#2563eb',
  buttonBgColor: '#2563eb',
  buttonTextColor: '#ffffff',
  iconColor: '#2563eb',
  position: 'left',
  titlePositions: [
    { top: 24, left: 16, rotation: -2, size: 'text-5xl' },
    { top: 96, left: 80, rotation: 3, size: 'text-6xl' },
    { top: 176, left: 32, rotation: -1, size: 'text-4xl' },
    { top: 240, left: 144, rotation: 2, size: 'text-5xl' },
  ],
  featuresLayout: 'vertical',
}

export default function AppDownloadPage() {
  const { data, setData, saveSuccess, handleSave: saveData, handleReset } = useSaveReset<AppDownloadData>('appDownloadConfig', defaultData)
  const [newFeature, setNewFeature] = useState({ mn: '', en: '' })
  const [newTitle, setNewTitle] = useState({ mn: '', en: '' })
  const [editingTitleIndex, setEditingTitleIndex] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState({ mn: '', en: '' })
  const [previewLang, setPreviewLang] = useState<'mn' | 'en'>('mn')

  const handleAddFeature = () => {
    if (!newFeature.mn.trim() || !newFeature.en.trim()) return
    setData({
      ...data,
      features: [...data.features, newFeature],
    })
    setNewFeature({ mn: '', en: '' })
  }

  const handleDeleteFeature = (index: number) => {
    if (!confirm('Устгах уу?')) return
    setData({
      ...data,
      features: data.features.filter((_, i) => i !== index),
    })
  }

  const handleAddTitle = () => {
    if (!newTitle.mn.trim() || !newTitle.en.trim()) return
    
    // Calculate default position for new title
    const lastPosition = data.titlePositions[data.titlePositions.length - 1]
    const newPosition = {
      top: lastPosition.top + 80,
      left: lastPosition.left + 20,
      rotation: Math.floor(Math.random() * 7) - 3, // Random rotation between -3 and 3
      size: 'text-5xl'
    }
    
    setData({
      ...data,
      titles: [...data.titles, newTitle],
      titlePositions: [...data.titlePositions, newPosition]
    })
    setNewTitle({ mn: '', en: '' })
  }

  const handleDeleteTitle = (index: number) => {
    if (data.titles.length <= 1) {
      alert('Хамгийн багадаа 1 гарчиг байх ёстой!')
      return
    }
    if (!confirm('Устгах уу?')) return
    
    setData({
      ...data,
      titles: data.titles.filter((_, i) => i !== index),
      titlePositions: data.titlePositions.filter((_, i) => i !== index)
    })
  }

  const handleUpdateTitle = (index: number, value: { mn: string; en: string }) => {
    const newTitles = [...data.titles]
    newTitles[index] = value
    setData({ ...data, titles: newTitles })
  }

  const handleStartEditTitle = (index: number) => {
    setEditingTitleIndex(index)
    setEditingTitle(data.titles[index])
  }

  const handleSaveTitle = () => {
    if (editingTitleIndex !== null) {
      handleUpdateTitle(editingTitleIndex, editingTitle)
      setEditingTitleIndex(null)
      setEditingTitle({ mn: '', en: '' })
    }
  }

  return (
    <AdminLayout title="App Download">
      <div className="space-y-6">
        {saveSuccess && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-emerald-900">Амжилттай хадгалагдлаа!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">Өөрчлөлтүүд хадгалагдсан.</p>
            </div>
          </div>
        )}
        
        <PageHeader
          title="App Download Section"
          description="Апп татаж авах хэсгийг удирдах"
          action={
            <SaveResetButtons 
              onSave={saveData}
              onReset={handleReset}
              confirmMessage="Та хадгалахдаа итгэлтэй байна уу?"
            />
          }
        />

        {/* Preview Section */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-blue-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-white/60 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Preview
              </span>
            </div>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setPreviewLang('mn')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  previewLang === 'mn'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                MN
              </button>
              <button
                onClick={() => setPreviewLang('en')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  previewLang === 'en'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${data.position === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                {/* Text Content */}
                <div className={`flex flex-col gap-8 ${data.position === 'right' ? 'lg:order-2' : ''}`}>
                  {/* Scattered headline */}
                  <div className={`relative min-h-[300px] ${data.textFont}`}>
                    {data.titles.map((title, index) => (
                      <span
                        key={index}
                        className={`absolute ${data.titlePositions[index].size} font-extrabold`}
                        style={{
                          top: `${data.titlePositions[index].top}px`,
                          left: `${data.titlePositions[index].left}px`,
                          transform: `rotate(${data.titlePositions[index].rotation}deg)`,
                          color: index === 1 ? data.accentColor : data.titleColor
                        }}
                      >
                        {title[previewLang]}
                      </span>
                    ))}
                  </div>

                  {/* Features */}
                  <div className={`flex ${
                    data.featuresLayout === 'horizontal' ? 'flex-row flex-wrap' :
                    data.featuresLayout === 'grid' ? 'grid grid-cols-2' :
                    'flex-col'
                  } gap-4 mt-2 ${data.textFont}`}>
                    {data.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${data.iconColor}20` }}>
                          <span className="text-sm font-semibold" style={{ color: data.iconColor }}>✓</span>
                        </div>
                        <span className="text-sm" style={{ color: data.textColor }}>{feature[previewLang]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 mt-6">
                    <div className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-medium shadow-md ${data.textFont}`} style={{ backgroundColor: data.buttonBgColor, color: data.buttonTextColor }}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      App Store
                    </div>
                    <div className={`flex items-center gap-3 px-6 py-3.5 rounded-xl border font-medium ${data.textFont}`} style={{ borderColor: data.iconColor, color: data.textColor }}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                      </svg>
                      Google Play
                    </div>
                  </div>
                </div>

                {/* App Image */}
                <div className={`flex justify-center lg:justify-end relative ${data.position === 'right' ? 'lg:order-1 lg:justify-start' : ''}`}>
                  <Image
                    src={data.appImageUrl}
                    alt="Mobile App"
                    width={400}
                    height={600}
                    className="drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Titles Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Гарчиг хэсгүүд</h2>
                  <p className="text-sm text-gray-500">Монгол/Англи хэлээр гарчиг нэмэх, засах</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {/* Add New Title */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-200 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <h3 className="text-sm font-semibold text-blue-900">Шинэ гарчиг нэмэх</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      Монгол
                    </label>
                    <input
                      value={newTitle.mn}
                      onChange={(e) => setNewTitle({ ...newTitle, mn: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Гарчиг (Монгол)"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      English
                    </label>
                    <input
                      value={newTitle.en}
                      onChange={(e) => setNewTitle({ ...newTitle, en: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Title (English)"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTitle()}
                    />
                  </div>
                  <button
                    onClick={handleAddTitle}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Гарчиг нэмэх
                  </button>
                </div>
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700 flex items-start gap-2">
                  <span>Гарчиг бүрийг тусдаа өөр өөр хэмжээ, өнгө, өнцгөөр харуулна. Байршлыг доорх "Текстийн байршил" хэсгээс засна.</span>
                </p>
              </div>
              <div className="space-y-3">
                {data.titles.map((title, index) => (
                  <div key={index} className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-teal-300 transition-colors">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Хэсэг #{index + 1}</span>
                      <div className="flex gap-2">
                        {editingTitleIndex !== index && (
                          <>
                            <button
                              onClick={() => handleStartEditTitle(index)}
                              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Засах
                            </button>
                            {data.titles.length > 1 && (
                              <button
                                onClick={() => handleDeleteTitle(index)}
                                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Устгах"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {editingTitleIndex === index ? (
                      <div className="p-4 space-y-3 bg-teal-50">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            Монгол
                          </label>
                          <input
                            value={editingTitle.mn}
                            onChange={(e) => setEditingTitle({ ...editingTitle, mn: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                            placeholder="Гарчиг (Монгол)"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            English
                          </label>
                          <input
                            value={editingTitle.en}
                            onChange={(e) => setEditingTitle({ ...editingTitle, en: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                            placeholder="Title (English)"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleSaveTitle}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Хадгалах
                          </button>
                          <button
                            onClick={() => setEditingTitleIndex(null)}
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                          >
                            Болих
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-800">{title.mn}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-slate-600">{title.en}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Онцлог давуу талууд</h2>
                  <p className="text-sm text-gray-500">Апп-ын гол функц, давуу талууд</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Add Feature */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <h3 className="text-sm font-semibold text-green-900">Шинэ онцлог нэмэх</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      Монгол
                    </label>
                    <input
                      value={newFeature.mn}
                      onChange={(e) => setNewFeature({ ...newFeature, mn: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="Жишээ: 24/7 зээлийн мэдээлэл шалгах"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      English
                    </label>
                    <input
                      value={newFeature.en}
                      onChange={(e) => setNewFeature({ ...newFeature, en: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="Example: Check loan info 24/7"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                    />
                  </div>
                  <button
                    onClick={handleAddFeature}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-md"
                  >
                    <PlusIcon className="h-5 w-5" />
                    Онцлог нэмэх
                  </button>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <h3 className="text-sm font-semibold text-slate-700">Нийт {data.features.length} онцлог</h3>
                </div>
                
                {data.features.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                    <svg className="w-12 h-12 mx-auto text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm text-slate-500">Онцлог нэмэгдээгүй байна</p>
                    <p className="text-xs text-slate-400 mt-1">Дээрх хэсгээс онцлог нэмнэ үү</p>
                  </div>
                ) : (
                  data.features.map((feature, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-teal-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-0.5">
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-slate-700 font-medium">{feature.mn}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-slate-500">{feature.en}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteFeature(index)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Устгах"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Links & Image Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Store холбоос & Зураг</h2>
            <p className="text-sm text-gray-500">Апп татах холбоос болон дэлгэцийн зураг</p>
          </div>
          <div className="p-6 space-y-6">
            {/* App Store Links */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 className="text-sm font-semibold text-slate-900">Татах холбоосууд</h3>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <Input
                  label="App Store холбоос"
                  value={data.appStoreUrl}
                  onChange={(e) => setData({ ...data, appStoreUrl: e.target.value })}
                  placeholder="https://apps.apple.com/..."
                />
                <p className="text-xs text-slate-500 mt-1 ml-1">Apple App Store дээрх апп-ын хуудас</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <Input
                  label="Google Play холбоос"
                  value={data.googlePlayUrl}
                  onChange={(e) => setData({ ...data, googlePlayUrl: e.target.value })}
                  placeholder="https://play.google.com/store/apps/..."
                />
                <p className="text-xs text-slate-500 mt-1 ml-1">Google Play Store дээрх апп-ын хуудас</p>
              </div>
            </div>

            {/* App Image Upload */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-sm font-semibold text-slate-900">Утасны зураг</h3>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-lg border-2 border-purple-200">
                <ImageUpload
                  label="Апп-ын дэлгэцийн зураг"
                  value={data.appImageUrl}
                  onChange={(url) => setData({ ...data, appImageUrl: url })}
                />
                <div className="mt-3 p-3 bg-white/70 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-700 font-medium flex items-start gap-2">
                    <span>Утасны дэлгэцийн зураг оруулна. Хамгийн сайн үр дүнгийн тулд <strong>400x600</strong> эсвэл түүнээс том хэмжээтэй зураг ашиглана уу.</span>
                  </p>
                </div>
              </div>

              {/* Preview of uploaded image */}
              {data.appImageUrl && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Одоогийн зураг:</p>
                  <div className="flex items-center gap-4">
                    <Image
                      src={data.appImageUrl}
                      alt="App Preview"
                      width={100}
                      height={150}
                      className="rounded-lg shadow-md border border-slate-200"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1 mb-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Зураг амжилттай оруулсан
                      </p>
                      <p className="text-xs text-slate-500 break-all">{data.appImageUrl}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title & Feature Position Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Текстийн байршил</h2>
            <p className="text-sm text-gray-500">Гарчиг болон онцлог хэсгийн байршил</p>
          </div>
          <div className="p-6 space-y-6">
            {/* Features Layout */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Онцлог давуу талуудын загвар</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setData({ ...data, featuresLayout: 'vertical' })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    data.featuresLayout === 'vertical'
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="w-16 h-2 bg-slate-400 rounded"></div>
                    <div className="w-16 h-2 bg-slate-400 rounded"></div>
                    <div className="w-16 h-2 bg-slate-400 rounded"></div>
                  </div>
                  <span className={`text-xs font-medium ${data.featuresLayout === 'vertical' ? 'text-teal-700' : 'text-slate-600'}`}>
                    Босоо
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setData({ ...data, featuresLayout: 'horizontal' })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    data.featuresLayout === 'horizontal'
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex gap-1">
                    <div className="w-5 h-2 bg-slate-400 rounded"></div>
                    <div className="w-5 h-2 bg-slate-400 rounded"></div>
                    <div className="w-5 h-2 bg-slate-400 rounded"></div>
                  </div>
                  <span className={`text-xs font-medium ${data.featuresLayout === 'horizontal' ? 'text-teal-700' : 'text-slate-600'}`}>
                    Хэвтээ
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setData({ ...data, featuresLayout: 'grid' })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    data.featuresLayout === 'grid'
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-1">
                    <div className="w-7 h-2 bg-slate-400 rounded"></div>
                    <div className="w-7 h-2 bg-slate-400 rounded"></div>
                    <div className="w-7 h-2 bg-slate-400 rounded"></div>
                    <div className="w-7 h-2 bg-slate-400 rounded"></div>
                  </div>
                  <span className={`text-xs font-medium ${data.featuresLayout === 'grid' ? 'text-teal-700' : 'text-slate-600'}`}>
                    Сүлжээ
                  </span>
                </button>
              </div>
            </div>

            {/* Title Positions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700">Гарчгийн байршил ({data.titles.length} хэсэг)</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const defaultPositions = [
                        { top: 24, left: 16, rotation: -2, size: 'text-5xl' },
                        { top: 96, left: 80, rotation: 3, size: 'text-6xl' },
                        { top: 176, left: 32, rotation: -1, size: 'text-4xl' },
                        { top: 240, left: 144, rotation: 2, size: 'text-5xl' },
                      ]
                      setData({ ...data, titlePositions: defaultPositions.slice(0, data.titles.length) })
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Анхдагч утга
                  </button>
                </div>
              </div>
              
              {/* Quick Presets */}
              <div className="mb-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <h4 className="text-xs font-semibold text-indigo-900 mb-2">Шууд сонголтууд</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      const cascadePositions = data.titlePositions.map((_, i) => ({
                        top: 30 + (i * 70),
                        left: 20 + (i * 15),
                        rotation: 0,
                        size: i === 1 ? 'text-6xl' : 'text-5xl'
                      }))
                      setData({ ...data, titlePositions: cascadePositions })
                    }}
                    className="px-3 py-2 text-xs font-medium text-indigo-700 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Каскад
                  </button>
                  <button
                    onClick={() => {
                      const stackedPositions = data.titlePositions.map((_, i) => ({
                        top: 20 + (i * 60),
                        left: 40,
                        rotation: 0,
                        size: i === 1 ? 'text-6xl' : 'text-4xl'
                      }))
                      setData({ ...data, titlePositions: stackedPositions })
                    }}
                    className="px-3 py-2 text-xs font-medium text-indigo-700 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Дарааллаар
                  </button>
                  <button
                    onClick={() => {
                      const zigzagPositions = data.titlePositions.map((_, i) => ({
                        top: 40 + (i * 70),
                        left: i % 2 === 0 ? 20 : 120,
                        rotation: i % 2 === 0 ? -3 : 3,
                        size: 'text-5xl'
                      }))
                      setData({ ...data, titlePositions: zigzagPositions })
                    }}
                    className="px-3 py-2 text-xs font-medium text-indigo-700 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Зигзаг
                  </button>
                  <button
                    onClick={() => {
                      const centeredPositions = data.titlePositions.map((_, i) => ({
                        top: 80 + (i * 60),
                        left: 60,
                        rotation: 0,
                        size: i === 0 ? 'text-6xl' : 'text-4xl'
                      }))
                      setData({ ...data, titlePositions: centeredPositions })
                    }}
                    className="px-3 py-2 text-xs font-medium text-indigo-700 bg-white border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Төвлөрсөн
                  </button>
                </div>
                <p className="text-xs text-indigo-600 mt-2">Эдгээр сонголтууд нь бүх гарчгийн байршлыг нэгдэн өөрчилнө</p>
              </div>

              <div className="space-y-4">
                {data.titlePositions.map((pos, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-700">
                        Хэсэг #{index + 1}: {data.titles[index]?.mn || 'N/A'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${index === 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'}`}>
                        {index === 1 ? 'Онцлох өнгө' : 'Үндсэн өнгө'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Дээрээс (px)
                        </label>
                        <input
                          type="number"
                          value={pos.top}
                          onChange={(e) => {
                            const newPositions = [...data.titlePositions]
                            newPositions[index] = { ...newPositions[index], top: parseInt(e.target.value) || 0 }
                            setData({ ...data, titlePositions: newPositions })
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Зүүнээс (px)
                        </label>
                        <input
                          type="number"
                          value={pos.left}
                          onChange={(e) => {
                            const newPositions = [...data.titlePositions]
                            newPositions[index] = { ...newPositions[index], left: parseInt(e.target.value) || 0 }
                            setData({ ...data, titlePositions: newPositions })
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Эргүүлэх (°)
                        </label>
                        <input
                          type="number"
                          value={pos.rotation}
                          min="-180"
                          max="180"
                          onChange={(e) => {
                            const newPositions = [...data.titlePositions]
                            newPositions[index] = { ...newPositions[index], rotation: parseInt(e.target.value) || 0 }
                            setData({ ...data, titlePositions: newPositions })
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Хэмжээ
                        </label>
                        <select
                          value={pos.size}
                          onChange={(e) => {
                            const newPositions = [...data.titlePositions]
                            newPositions[index] = { ...newPositions[index], size: e.target.value }
                            setData({ ...data, titlePositions: newPositions })
                          }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                        >
                          <option value="text-3xl">Жижиг</option>
                          <option value="text-4xl">Дунд</option>
                          <option value="text-5xl">Том</option>
                          <option value="text-6xl">Маш том</option>
                          <option value="text-7xl">Асар том</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Quick Actions per Title */}
                    <div className="mt-3 pt-3 border-t border-slate-300 flex gap-2">
                      <button
                        onClick={() => {
                          const newPositions = [...data.titlePositions]
                          newPositions[index] = { ...newPositions[index], rotation: 0 }
                          setData({ ...data, titlePositions: newPositions })
                        }}
                        className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                      >
                        Эргүүлэлт 0°
                      </button>
                      <button
                        onClick={() => {
                          const newPositions = [...data.titlePositions]
                          newPositions[index] = { ...newPositions[index], left: 40 }
                          setData({ ...data, titlePositions: newPositions })
                        }}
                        className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
                      >
                        Зүүн тэгшлэх
                      </button>
                      {index > 0 && (
                        <button
                          onClick={() => {
                            const newPositions = [...data.titlePositions]
                            newPositions[index] = { ...data.titlePositions[index - 1] }
                            setData({ ...data, titlePositions: newPositions })
                          }}
                          className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        >
                          Өмнөх хуулах
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Styling Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Position & Typography */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Байршил & Фонт</h2>
                  <p className="text-sm text-gray-500">Текст, зурагны байршил болон үсгийн загвар</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Position Toggle */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <h3 className="text-sm font-semibold text-slate-700">Зурагны байршил</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setData({ ...data, position: 'left' })}
                    className={`group relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                      data.position === 'left'
                        ? 'border-teal-500 bg-teal-50 shadow-lg scale-105'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                    }`}
                  >
                    {data.position === 'left' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="flex gap-2 items-center">
                      <div className="w-12 h-16 bg-slate-300 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                        ABC
                      </div>
                      <div className="w-8 h-20 bg-teal-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        IMG
                      </div>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${data.position === 'left' ? 'text-teal-700' : 'text-slate-600'}`}>
                        Стандарт
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Текст зүүн · Зураг баруун</p>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setData({ ...data, position: 'right' })}
                    className={`group relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                      data.position === 'right'
                        ? 'border-teal-500 bg-teal-50 shadow-lg scale-105'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-md'
                    }`}
                  >
                    {data.position === 'right' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-20 bg-teal-400 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        IMG
                      </div>
                      <div className="w-12 h-16 bg-slate-300 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                        ABC
                      </div>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${data.position === 'right' ? 'text-teal-700' : 'text-slate-600'}`}>
                        Эсрэг
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Зураг зүүн · Текст баруун</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Font Selection */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <h3 className="text-sm font-semibold text-slate-700">Үсгийн загвар (Font)</h3>
                </div>
                <select
                  value={data.textFont}
                  onChange={(e) => setData({ ...data, textFont: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium bg-white hover:border-blue-400 transition-colors"
                >
                  <option value="font-sans" className="font-sans">Sans Serif (Стандарт)</option>
                  <option value="font-serif" className="font-serif">Serif (Уламжлалт)</option>
                  <option value="font-mono" className="font-mono">Monospace (Код загвар)</option>
                </select>
                <p className="text-xs text-slate-500 mt-2 ml-1">Бүх текстэд хамаарна</p>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Өнгө</h2>
              <p className="text-sm text-gray-500">Текст, товч, иконы өнгө</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Гарчгийн өнгө
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.titleColor}
                      onChange={(e) => setData({ ...data, titleColor: e.target.value })}
                      className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.titleColor}
                      onChange={(e) => setData({ ...data, titleColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Текстийн өнгө
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.textColor}
                      onChange={(e) => setData({ ...data, textColor: e.target.value })}
                      className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.textColor}
                      onChange={(e) => setData({ ...data, textColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Онцлох өнгө
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.accentColor}
                      onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                      className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.accentColor}
                      onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Иконы өнгө
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.iconColor}
                      onChange={(e) => setData({ ...data, iconColor: e.target.value })}
                      className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.iconColor}
                      onChange={(e) => setData({ ...data, iconColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Товчны арын өнгө
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.buttonBgColor}
                      onChange={(e) => setData({ ...data, buttonBgColor: e.target.value })}
                      className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.buttonBgColor}
                      onChange={(e) => setData({ ...data, buttonBgColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Товчны текст
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={data.buttonTextColor}
                      onChange={(e) => setData({ ...data, buttonTextColor: e.target.value })}
                      className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={data.buttonTextColor}
                      onChange={(e) => setData({ ...data, buttonTextColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
