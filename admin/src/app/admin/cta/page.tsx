'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Input, Button, PageHeader } from '@/components/FormElements'
import ImageUpload from '@/components/ImageUpload'
import Modal from '@/components/Modal'
import { PlusIcon, TrashIcon, PencilIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useSaveReset } from '@/hooks/useSaveReset'
import { SaveResetButtons } from '@/components/SaveResetButtons'

interface CTASlide {
  id: string
  imageUrl: string
  number: string
  title_mn: string
  title_en: string
  subtitle_mn: string
  subtitle_en: string
  font?: string
  textColor?: string
  order: number
  isActive: boolean
}

const defaultSlides: CTASlide[] = [
  {
    id: '1',
    imageUrl: '/Bichil1.jpg',
    number: '01',
    title_mn: 'Хашаа барьцаалсан зээл',
    title_en: 'Property Collateral Loan',
    subtitle_mn: 'Тогтвортой, уян хатан нөхцөлтэй зээл',
    subtitle_en: 'Stable and flexible loan terms',
    font: 'font-sans',
    textColor: '#ffffff',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    imageUrl: '/Bichil2.png',
    number: '02',
    title_mn: 'Автомашин авах зээл',
    title_en: 'Auto Loan',
    subtitle_mn: 'Газар барьцаалсан зээл',
    subtitle_en: 'Land collateral loan',
    font: 'font-sans',
    textColor: '#ffffff',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    imageUrl: '/Bichil3.jpg',
    number: '03',
    title_mn: 'ХБҮЦ',
    title_en: 'MSME',
    subtitle_mn: 'Жижиг дунд бизнес',
    subtitle_en: 'Small and medium business',
    font: 'font-sans',
    textColor: '#ffffff',
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    imageUrl: '/Bichil1.jpg',
    number: '04',
    title_mn: 'Бизнес зээл',
    title_en: 'Business Loan',
    subtitle_mn: 'Таны бизнесийг дэмжинэ',
    subtitle_en: 'Supporting your business',
    font: 'font-sans',
    textColor: '#ffffff',
    order: 4,
    isActive: true,
  },
]

export default function CTAPage() {
  const { data: slides, setData: setSlides, saveSuccess, handleSave: saveData, handleReset } = useSaveReset<CTASlide[]>('ctaSlides', defaultSlides)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<CTASlide | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [previewLang, setPreviewLang] = useState<'mn' | 'en'>('mn')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    imageUrl: '',
    number: '',
    title_mn: '',
    title_en: '',
    subtitle_mn: '',
    subtitle_en: '',
    font: 'font-sans',
    textColor: '#ffffff',
    order: slides.length + 1,
    isActive: true,
  })

  const handleSaveWithErrorHandling = async () => {
    try {
      setError(null)
      setSaving(true)
      saveData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Хадгалахад алдаа гарлаа'
      setError(message)
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleOpenCreate = () => {
    setError(null)
    setEditingSlide(null)
    setFormData({
      imageUrl: '',
      number: `0${slides.length + 1}`,
      title_mn: '',
      title_en: '',
      subtitle_mn: '',
      subtitle_en: '',
      font: 'font-sans',
      textColor: '#ffffff',
      order: slides.length + 1,
      isActive: true,
    })
    setModalOpen(true)
  }

  const handleEdit = (slide: CTASlide) => {
    setEditingSlide(slide)
    setFormData({
      imageUrl: slide.imageUrl,
      number: slide.number,
      title_mn: slide.title_mn,
      title_en: slide.title_en,
      subtitle_mn: slide.subtitle_mn,
      subtitle_en: slide.subtitle_en,
      font: slide.font || 'font-sans',
      textColor: slide.textColor || '#ffffff',
      order: slide.order,
      isActive: slide.isActive,
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.imageUrl || !formData.title_mn) {
      alert('Зураг болон монгол гарчиг оруулна уу')
      return
    }

    if (editingSlide) {
      setSlides(slides.map(s => 
        s.id === editingSlide.id 
          ? { ...s, ...formData }
          : s
      ))
    } else {
      const newSlide: CTASlide = {
        id: Date.now().toString(),
        ...formData,
      }
      setSlides([...slides, newSlide])
    }

    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Устгах уу?')) return
    setSlides(slides.filter(s => s.id !== id))
  }

  const handleMoveUp = (id: string) => {
    const sortedSlides = [...slides].sort((a, b) => a.order - b.order)
    const index = sortedSlides.findIndex(s => s.id === id)
    if (index <= 0) return
    
    const newSlides = [...sortedSlides]
    const temp = newSlides[index].order
    newSlides[index].order = newSlides[index - 1].order
    newSlides[index - 1].order = temp
    
    setSlides(newSlides.sort((a, b) => a.order - b.order))
  }

  const handleMoveDown = (id: string) => {
    const sortedSlides = [...slides].sort((a, b) => a.order - b.order)
    const index = sortedSlides.findIndex(s => s.id === id)
    if (index >= sortedSlides.length - 1) return
    
    const newSlides = [...sortedSlides]
    const temp = newSlides[index].order
    newSlides[index].order = newSlides[index + 1].order
    newSlides[index + 1].order = temp
    
    setSlides(newSlides.sort((a, b) => a.order - b.order))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    
    const sortedSlides = [...slides].sort((a, b) => a.order - b.order)
    const draggedSlide = sortedSlides[draggedIndex]
    const targetSlide = sortedSlides[index]
    
    const newSlides = sortedSlides.map(slide => {
      if (slide.id === draggedSlide.id) {
        return { ...slide, order: targetSlide.order }
      }
      if (draggedIndex < index) {
        if (slide.order > draggedSlide.order && slide.order <= targetSlide.order) {
          return { ...slide, order: slide.order - 1 }
        }
      } else {
        if (slide.order >= targetSlide.order && slide.order < draggedSlide.order) {
          return { ...slide, order: slide.order + 1 }
        }
      }
      return slide
    })
    
    setSlides(newSlides.sort((a, b) => a.order - b.order))
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <AdminLayout title="CTA Slider">
      <div className="max-w-6xl mx-auto">
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

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900">Алдаа гарлаа</h4>
              <p className="text-xs text-red-700 mt-0.5">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <PageHeader
          title="CTA Accordion Slider"
          description="Нүүр хуудасны дунд хэсгийн интерактив слайдер · 🖱️ Чирж байршил солино"
          action={
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveWithErrorHandling}
                disabled={saving}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  saving
                    ? 'bg-teal-500 text-white cursor-not-allowed opacity-75'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Хадгалаж байна...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Хадгалах
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={saving}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  saving
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Буцаах
              </button>
              <Button variant="dark" onClick={handleOpenCreate} disabled={saving}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Шинэ слайд нэмэх
              </Button>
            </div>
          }
        />

        {/* Live Preview */}
        {slides.filter(s => s.isActive).length > 0 && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-50">
            <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                  Live Preview - Accordion Slider
                </span>
              </div>
              <div className="flex items-center gap-2">
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
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  🖱️ Hover хийнэ үү
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="relative" style={{ height: '80vh', minHeight: '500px', maxHeight: '700px' }}>
                <div className="flex h-full gap-4">
                  {slides
                    .filter(s => s.isActive)
                    .sort((a, b) => a.order - b.order)
                    .map((slide, index) => {
                      const isHovered = hoveredIndex === index
                      
                      return (
                        <div
                          key={slide.id}
                          className={`relative transition-all duration-700 ease-out cursor-pointer overflow-hidden rounded-2xl ${
                            isHovered ? 'flex-[2.7]' : 'flex-1'
                          }`}
                          style={{
                            filter: isHovered ? 'grayscale(0) contrast(1.02)' : 'grayscale(0.7) contrast(0.95)',
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                            minWidth: '140px',
                          }}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <Image
                            src={slide.imageUrl}
                            alt={previewLang === 'mn' ? slide.title_mn : slide.title_en}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/0 to-transparent"></div>
                          
                          <div 
                            className={`absolute ${isHovered ? 'bottom-20' : 'bottom-8'} left-7 right-7 z-10 transition-all duration-700 ${slide.font || 'font-sans'}`}
                            style={{ color: slide.textColor || '#ffffff' }}
                          >
                            <div className="text-base font-bold mb-2" style={{ opacity: 0.95 }}>
                              {previewLang === 'mn' ? slide.title_mn : slide.title_en}
                            </div>
                            
                            <div className={`transition-all duration-600 overflow-hidden ${
                              isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
                            }`}>
                              <p className="text-sm font-medium mt-2" style={{ opacity: 0.85 }}>
                                {previewLang === 'mn' ? slide.subtitle_mn : slide.subtitle_en}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides
            .sort((a, b) => a.order - b.order)
            .map((slide, index) => (
              <div
                key={slide.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all cursor-move ${
                  draggedIndex === index 
                    ? 'border-teal-500 shadow-lg scale-105 opacity-50' 
                    : 'border-slate-200 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                {/* Drag Handle Header */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="cursor-grab active:cursor-grabbing">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-bold text-slate-800 shadow-sm">
                      {slide.number}
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      Эрэмбэ: {slide.order}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(slide.id)}
                      className="p-1.5 bg-white rounded-md shadow-sm hover:bg-slate-50 transition-colors"
                      title="Дээш"
                    >
                      <ChevronUpIcon className="h-4 w-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(slide.id)}
                      className="p-1.5 bg-white rounded-md shadow-sm hover:bg-slate-50 transition-colors"
                      title="Доош"
                    >
                      <ChevronDownIcon className="h-4 w-4 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="relative h-48">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title_mn}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-teal-50 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4 text-teal-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                      {slide.font || 'font-sans'}
                    </span>
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-slate-200 shadow-sm"
                      style={{ backgroundColor: slide.textColor }}
                      title={`Өнгө: ${slide.textColor}`}
                    />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{slide.title_mn}</h3>
                  <p className="text-sm text-slate-600 mb-1">{slide.subtitle_mn}</p>
                  <p className="text-xs text-slate-400 italic">{slide.title_en}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSlide ? 'Слайд засах' : 'Шинэ слайд нэмэх'}
      >
        <div className="space-y-4">
          <ImageUpload
            label="Арын зураг"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          />

          <Input
            label="Дугаар (жнь: 01, 02)"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            placeholder="01"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Гарчиг (Монгол)"
              value={formData.title_mn}
              onChange={(e) => setFormData({ ...formData, title_mn: e.target.value })}
              placeholder="Хашаа барьцаалсан зээл"
            />
            <Input
              label="Гарчиг (English)"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              placeholder="Property Collateral Loan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Дэд гарчиг (Монгол)"
              value={formData.subtitle_mn}
              onChange={(e) => setFormData({ ...formData, subtitle_mn: e.target.value })}
              placeholder="Тогтвортой, уян хатан нөхцөлтэй зээл"
            />
            <Input
              label="Дэд гарчиг (English)"
              value={formData.subtitle_en}
              onChange={(e) => setFormData({ ...formData, subtitle_en: e.target.value })}
              placeholder="Stable and flexible loan terms"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Фонт
              </label>
              <select
                value={formData.font}
                onChange={(e) => setFormData({ ...formData, font: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="font-sans">Sans Serif</option>
                <option value="font-serif">Serif</option>
                <option value="font-mono">Monospace</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Текстийн өнгө
              </label>
              <input
                type="color"
                value={formData.textColor}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                className="w-full h-10 border border-slate-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <Input
            label="Эрэмбэ"
            type="number"
            value={formData.order.toString()}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) || 1 })
            }
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Болих
            </button>
            <Button variant="dark" onClick={handleSave}>
              Хадгалах
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  )
}
