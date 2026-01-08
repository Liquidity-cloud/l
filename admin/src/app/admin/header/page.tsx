'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import Modal from '@/components/Modal'
import { Input, Select, Checkbox, Button, PageHeader } from '@/components/FormElements'
import { PlusIcon, TrashIcon, PencilIcon, SwatchIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import ImageUpload from '@/components/ImageUpload'

interface MenuItem {
  id: string
  title_mn: string
  title_en: string
  href: string
  order: number
  isActive: boolean
  parentId: string | null
  font?: string
  textColor?: string
}

interface HeaderStyle {
  backgroundColor: string
  textColor: string
  hoverColor: string
  height: string
  isSticky: boolean
  logoUrl: string
  logoText: string
}

const defaultHeaderStyle: HeaderStyle = {
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  hoverColor: '#0d9488',
  height: '80px',
  isSticky: true,
  logoUrl: '',
  logoText: 'BichilGlobus',
}

const initialMenuItem = {
  title_mn: '',
  title_en: '',
  href: '',
  order: 0,
  isActive: true,
  parentId: null as string | null,
  font: 'font-sans',
  textColor: '#1f2937',
}

// Frontend-тэй ижил бүтэц
const predefinedPages = [
  { label: '-- Хуудас сонгох --', value: '' },
  { label: '# (Дэд цэстэй - линкгүй)', value: '#' },
  { label: '─── Бүтээгдэхүүн ───', value: '', disabled: true },
  { label: 'Автомашины зээл', value: '/products/car-loan' },
  { label: '  → Барьцаалсан зээл', value: '/products/car-loan/collateral' },
  { label: '  → Худалдан авах зээл', value: '/products/car-loan/purchase' },
  { label: 'Үл хөдлөх хөрөнгийн зээл', value: '/products/real-estate' },
  { label: '  → Газар барьцаалсан', value: '/products/real-estate/land' },
  { label: '  → Хашаа барьцаалсан', value: '/products/real-estate/fence' },
  { label: '  → Орон сууц барьцаалсан', value: '/products/real-estate/apartment' },
  { label: 'Дугаар барьцаалсан зээл', value: '/products/phone-number' },
  { label: 'Бизнес зээл', value: '/products/business' },
  { label: '─── Үйлчилгээ ───', value: '', disabled: true },
  { label: 'Нээлттэй бонд', value: '/services/open-bond' },
  { label: 'Хаалттай бонд', value: '/services/closed-bond' },
  { label: 'ХБҮЦ', value: '/services/hbuts' },
  { label: 'Итгэлцэл', value: '/services/trust' },
  { label: '─── Бусад ───', value: '', disabled: true },
  { label: 'Танилцуулга', value: '/about' },
  { label: 'Хүний нөөц', value: '/about/hr' },
  { label: 'Мэдээ мэдээлэл', value: '/news' },
  { label: 'Гадаад линк (өөрөө бичих)', value: 'custom' },
]

export default function HeaderPage() {
  const [activeTab, setActiveTab] = useState<'menu' | 'style' | 'logo'>('menu')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [headerStyle, setHeaderStyle] = useState<HeaderStyle>(defaultHeaderStyle)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [styleModalOpen, setStyleModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState(initialMenuItem)
  const [selectedPage, setSelectedPage] = useState('')
  const [previewHover, setPreviewHover] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1', '11', '17'])) // Эхлээд root-уудыг нээх
  const [previewLanguage, setPreviewLanguage] = useState<'mn' | 'en'>('mn')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [originalMenuItems, setOriginalMenuItems] = useState<MenuItem[]>([])
  const [originalHeaderStyle, setOriginalHeaderStyle] = useState<HeaderStyle>(defaultHeaderStyle)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // TODO: API холболт нэмэх - const response = await fetch('http://localhost:3001/api/header/menu')
      
      // Load from localStorage
      const savedMenuItems = localStorage.getItem('headerMenuItems')
      const savedHeaderStyle = localStorage.getItem('headerStyle')
      
      if (savedMenuItems) {
        const items = JSON.parse(savedMenuItems)
        setMenuItems(items)
        setOriginalMenuItems(JSON.parse(JSON.stringify(items))) // Deep copy
      } else {
        // Default demo data
        const defaultItems = [
        // Бүтээгдэхүүн (dropdown)
        { id: '1', title_mn: 'Бүтээгдэхүүн', title_en: 'Products', href: '#', order: 0, isActive: true, parentId: null },
          { id: '2', title_mn: 'Автомашины зээл', title_en: 'Car Loan', href: '#', order: 0, isActive: true, parentId: '1' },
            { id: '3', title_mn: 'Автомашин барьцаалсан зээл', title_en: 'Car Collateral Loan', href: '/products/car-loan/collateral', order: 0, isActive: true, parentId: '2' },
            { id: '4', title_mn: 'Автомашин авах зээл', title_en: 'Car Purchase Loan', href: '/products/car-loan/purchase', order: 1, isActive: true, parentId: '2' },
          { id: '5', title_mn: 'Үл хөдлөх хөрөнгийн зээл', title_en: 'Real Estate Loan', href: '#', order: 1, isActive: true, parentId: '1' },
            { id: '6', title_mn: 'Газар барьцаалсан зээл', title_en: 'Land Loan', href: '/products/real-estate/land', order: 0, isActive: true, parentId: '5' },
            { id: '7', title_mn: 'Хашаа барьцаалсан зээл', title_en: 'Fence Loan', href: '/products/real-estate/fence', order: 1, isActive: true, parentId: '5' },
            { id: '8', title_mn: 'Орон сууц барьцаалсан зээл', title_en: 'Apartment Loan', href: '/products/real-estate/apartment', order: 2, isActive: true, parentId: '5' },
          { id: '9', title_mn: 'Дугаар барьцаалсан зээл', title_en: 'Phone Number Loan', href: '/products/phone-number', order: 2, isActive: true, parentId: '1' },
          { id: '10', title_mn: 'Бизнес зээл', title_en: 'Business Loan', href: '/products/business', order: 3, isActive: true, parentId: '1' },
        
        // Үйлчилгээ (dropdown)
        { id: '11', title_mn: 'Үйлчилгээ', title_en: 'Services', href: '#', order: 1, isActive: true, parentId: null },
          { id: '12', title_mn: 'Бонд', title_en: 'Bond', href: '#', order: 0, isActive: true, parentId: '11' },
            { id: '13', title_mn: 'Нээлттэй бонд', title_en: 'Open Bond', href: '/services/open-bond', order: 0, isActive: true, parentId: '12' },
            { id: '14', title_mn: 'Хаалттай бонд', title_en: 'Closed Bond', href: '/services/closed-bond', order: 1, isActive: true, parentId: '12' },
          { id: '15', title_mn: 'ХБҮЦ', title_en: 'MSME', href: '/services/hbuts', order: 1, isActive: true, parentId: '11' },
          { id: '16', title_mn: 'Итгэлцэл', title_en: 'Trust', href: '/services/trust', order: 2, isActive: true, parentId: '11' },
        
        // Бидний тухай (dropdown)
        { id: '17', title_mn: 'Бидний тухай', title_en: 'About Us', href: '#', order: 2, isActive: true, parentId: null },
          { id: '18', title_mn: 'Танилцуулга', title_en: 'Overview', href: '/about', order: 0, isActive: true, parentId: '17' },
          { id: '19', title_mn: 'Хүний нөөц', title_en: 'Careers', href: '/about/hr', order: 1, isActive: true, parentId: '17' },
        
        // Мэдээлэл (шууд линк)
        { id: '20', title_mn: 'Мэдээлэл', title_en: 'News', href: '/news', order: 3, isActive: true, parentId: null },
        ]
        setMenuItems(defaultItems)
        setOriginalMenuItems(JSON.parse(JSON.stringify(defaultItems))) // Deep copy
      }
      
      if (savedHeaderStyle) {
        const style = JSON.parse(savedHeaderStyle)
        setHeaderStyle(style)
        setOriginalHeaderStyle(JSON.parse(JSON.stringify(style))) // Deep copy
      } else {
        setOriginalHeaderStyle(JSON.parse(JSON.stringify(defaultHeaderStyle))) // Deep copy
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading menu:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const newItem: MenuItem = { 
      id: editingItem?.id || Date.now().toString(), 
      ...formData 
    }
    
    if (editingItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === editingItem.id ? newItem : item
      ))
    } else {
      setMenuItems(prev => [...prev, newItem])
    }
    
    handleCloseModal()
    setSaving(false)
  }

  const handleDelete = (item: MenuItem) => {
    if (!confirm('Устгах уу? Дэд цэсүүд ч бас устгагдана.')) return
    // Өөрийгөө болон бүх дэд цэсүүдийг устгах
    const idsToDelete = new Set<string>()
    const collectIds = (parentId: string) => {
      idsToDelete.add(parentId)
      menuItems.filter(i => i.parentId === parentId).forEach(child => collectIds(child.id))
    }
    collectIds(item.id)
    setMenuItems(prev => prev.filter(i => !idsToDelete.has(i.id)))
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      title_mn: item.title_mn,
      title_en: item.title_en,
      href: item.href,
      order: item.order,
      isActive: item.isActive,
      parentId: item.parentId,
      font: item.font || 'font-sans',
      textColor: item.textColor || '#1f2937',
    })
    setSelectedPage(item.href.startsWith('#') ? '#' : 
                    predefinedPages.find(p => p.value === item.href)?.value || 'custom')
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingItem(null)
    setFormData(initialMenuItem)
    setSelectedPage('')
  }

  const handlePageSelect = (value: string) => {
    setSelectedPage(value)
    if (value && value !== 'custom' && value !== '#') {
      setFormData(prev => ({ ...prev, href: value }))
    } else if (value === '#') {
      setFormData(prev => ({ ...prev, href: '#' }))
    }
  }

  // Цэсний бүтэц
  const rootItems = menuItems.filter(item => !item.parentId).sort((a, b) => a.order - b.order)
  const getChildren = (parentId: string) => 
    menuItems.filter(item => item.parentId === parentId).sort((a, b) => a.order - b.order)
  
  // Бүх эцэг цэсүүдийг олох (3 түвшин хүртэл)
  const getAllParents = () => {
    const parents: { value: string; label: string }[] = [
      { value: '', label: 'Үндсэн цэс (Root)' }
    ]
    rootItems.forEach(root => {
      parents.push({ value: root.id, label: root.title_mn })
      getChildren(root.id).forEach(child => {
        parents.push({ value: child.id, label: `  └ ${child.title_mn}` })
      })
    })
    return parents
  }

  // Нээх/хаах toggle
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Бүгдийг нээх
  const expandAll = () => {
    const allIds = new Set<string>()
    menuItems.forEach(item => {
      if (getChildren(item.id).length > 0) {
        allIds.add(item.id)
      }
    })
    setExpandedIds(allIds)
  }

  // Бүгдийг хаах
  const collapseAll = () => {
    setExpandedIds(new Set())
  }

  // Хадгалах функц
  const handleSaveAll = () => {
    try {
      // TODO: API холболт нэмэх
      // await fetch('http://localhost:3001/api/header/menu', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ items: menuItems })
      // })
      
      // Save to localStorage
      localStorage.setItem('headerMenuItems', JSON.stringify(menuItems))
      localStorage.setItem('headerStyle', JSON.stringify(headerStyle))
      
      // Update original state
      setOriginalMenuItems(JSON.parse(JSON.stringify(menuItems)))
      setOriginalHeaderStyle(JSON.parse(JSON.stringify(headerStyle)))
      
      // Show success message
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving:', error)
      alert('Хадгалахад алдаа гарлаа')
    }
  }

  // Буцах функц
  const handleReset = () => {
    const hasChanges = 
      JSON.stringify(menuItems) !== JSON.stringify(originalMenuItems) ||
      JSON.stringify(headerStyle) !== JSON.stringify(originalHeaderStyle)
    
    if (hasChanges) {
      const confirmed = window.confirm(
        'Та өөрчлөлтүүдийг хадгалаагүй байна. Буцах уу?\n\nХадгалаагүй өөрчлөлтүүд устах болно.'
      )
      
      if (!confirmed) return
    }
    
    // Reset to original state
    setMenuItems(JSON.parse(JSON.stringify(originalMenuItems)))
    setHeaderStyle(JSON.parse(JSON.stringify(originalHeaderStyle)))
  }

  return (
    <AdminLayout title="Header тохиргоо">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Header удирдлага"
          description="Цэс, загвар, лого тохиргоо"
        />

        {/* Success Notification */}
        {saveSuccess && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-emerald-900">Амжилттай хадгалагдлаа!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">Өөрчлөлтүүд хадгалагдсан. Ирээдүйд API холбогдоход backend-д автоматаар дамжих болно.</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'menu'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Цэс удирдах
            </button>
            <button
              onClick={() => setActiveTab('style')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'style'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Style тохиргоо
            </button>
            <button
              onClick={() => setActiveTab('logo')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'logo'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Logo
            </button>
          </div>
        </div>

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <>
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Цэсний удирдлага</h3>
                <p className="text-xs text-slate-500 mt-0.5">Веб сайтын navigation цэс тохируулах</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  <span>Буцах</span>
                </button>
                <Button 
                  variant="dark" 
                  onClick={handleSaveAll}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Хадгалах</span>
                  </span>
                </Button>
                <Button 
                  variant="dark" 
                  onClick={() => setModalOpen(true)} 
                  icon={<PlusIcon className="h-5 w-5" />}
                >
                  <span className="flex items-center gap-2">
                    <span>Цэс нэмэх</span>
                  </span>
                </Button>
              </div>
            </div>

        {/* Live Preview - Frontend Header шиг */}
        <div className="mb-6 rounded-2xl overflow-visible border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-50">
          <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Preview
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                🖱️ Hover хийнэ үү
              </span>
              {/* Language Toggle */}
              <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 shadow-sm border border-slate-200">
                <button
                  onClick={() => setPreviewLanguage('mn')}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                    previewLanguage === 'mn'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇲🇳 MN
                </button>
                <button
                  onClick={() => setPreviewLanguage('en')}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                    previewLanguage === 'en'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇺🇸 EN
                </button>
              </div>
            </div>
          </div>
          
          {/* Header Preview Container */}
          <div className="p-6 pb-32 overflow-visible min-h-[200px]">
            <div 
              className="rounded-2xl shadow-lg border border-white/50"
              style={{ backgroundColor: headerStyle.backgroundColor }}
            >
              <div className="px-6 flex items-center justify-between" style={{ height: headerStyle.height }}>
                {/* Logo */}
                <div className="flex items-center gap-3">
                  {headerStyle.logoUrl ? (
                    <img 
                      src={headerStyle.logoUrl} 
                      alt="Logo" 
                      className="h-10 w-auto object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      BG
                    </div>
                  )}
                </div>
                
                {/* Navigation */}
                <nav className="flex items-center gap-1 relative">
                  {rootItems.filter(i => i.isActive).map(item => {
                    const children = getChildren(item.id).filter(c => c.isActive)
                    const isHovered = previewHover === item.id
                    
                    return (
                      <div 
                        key={item.id} 
                        className="relative"
                        onMouseEnter={() => setPreviewHover(item.id)}
                        onMouseLeave={() => setPreviewHover(null)}
                      >
                        <button 
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isHovered ? 'bg-gray-100/80' : 'hover:bg-gray-50'
                          } ${item.font || 'font-sans'}`}
                          style={{ color: item.textColor || (isHovered ? headerStyle.hoverColor : headerStyle.textColor) }}
                        >
                          {previewLanguage === 'mn' ? item.title_mn : item.title_en}
                          {children.length > 0 && (
                            <svg 
                              className={`w-4 h-4 transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>
                        
                        {/* Dropdown Level 1 */}
                        {isHovered && children.length > 0 && (
                          <div className="absolute top-full left-0 pt-2 min-w-[240px] z-[9999]">
                            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 py-2">
                              {children.map(child => {
                                const grandChildren = getChildren(child.id).filter(c => c.isActive)
                                const hasGrandChildren = grandChildren.length > 0
                                
                                return (
                                  <div key={child.id} className="relative group/sub">
                                    <div 
                                      className={`flex items-center justify-between px-4 py-2.5 mx-1 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${child.font || 'font-sans'}`}
                                      style={{ color: child.textColor || '#1f2937' }}
                                    >
                                      <span className="text-sm font-medium">{previewLanguage === 'mn' ? child.title_mn : child.title_en}</span>
                                      {hasGrandChildren && (
                                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                                      )}
                                    </div>
                                    
                                    {/* Dropdown Level 2 (Grandchildren) */}
                                    {hasGrandChildren && (
                                      <div className="absolute left-full top-0 pl-1 min-w-[200px] hidden group-hover/sub:block z-[10000]">
                                        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 py-2">
                                          {grandChildren.map(gc => (
                                            <div 
                                              key={gc.id} 
                                              className={`px-4 py-2.5 mx-1 rounded-lg text-sm hover:bg-gray-50 cursor-pointer transition-colors ${gc.font || 'font-sans'}`}
                                              style={{ color: gc.textColor || '#374151' }}
                                            >
                                              {previewLanguage === 'mn' ? gc.title_mn : gc.title_en}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </nav>
                
                {/* Language selector */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium" style={{ color: headerStyle.textColor }}>
                  <span>🇲🇳</span>
                  <span>MN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Tree */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="font-semibold text-slate-900">Цэсний жагсаалт</span>
              <span className="text-xs text-slate-400">({menuItems.length} цэс)</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={expandAll}
                className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Бүгдийг нээх
              </button>
              <span className="text-slate-300">|</span>
              <button 
                onClick={collapseAll}
                className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Бүгдийг хаах
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-slate-500">Цэсүүдийг уншиж байна...</p>
              </div>
            </div>
          ) : rootItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Цэс байхгүй байна</p>
                  <p className="text-xs text-slate-500 mt-1">Эхний цэсээ нэмж эхлээрэй</p>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="mt-2 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
                >
                  ➕ Цэс нэмэх
                </button>
              </div>
            </div>
          ) : (
            <div className="py-1">
              {rootItems.map(item => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  level={0}
                  getChildren={getChildren}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  expandedIds={expandedIds}
                  onToggle={toggleExpand}
                />
              ))}
            </div>
          )}
          
          {/* Legend */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/30 flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-teal-500 rounded"></span>
              <span>Үндсэн</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-400 rounded"></span>
              <span>1-р түвшин</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-purple-400 rounded"></span>
              <span>2-р түвшин</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px]">dropdown</span>
              <span>= дэд цэстэй</span>
            </div>
          </div>
        </div>
          </>
        )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingItem ? ' Цэс засварлах' : ' Шинэ цэс нэмэх'}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-blue-800 leading-relaxed">
                <strong>Зөвлөмж:</strong> Дэд цэс үүсгэхийн тулд холбоос дээр <span className="px-1 py-0.5 bg-blue-100 rounded font-mono">#</span> сонгоод, дараа нь "Эцэг цэс" дээр тухайн цэсийг сонгоно уу.
              </div>
            </div>
          </div>

          {/* Language Inputs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-slate-700">Цэсний нэр</span>
              <span className="text-xs text-slate-400">(хоёр хэл дээр оруулна)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-xs text-slate-600 mb-1.5">
                  <span className="text-base">🇲🇳</span>
                  <span>Монгол</span>
                </label>
                <Input
                  value={formData.title_mn}
                  onChange={(e) => setFormData({ ...formData, title_mn: e.target.value })}
                  placeholder="жнь: Бүтээгдэхүүн"
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs text-slate-600 mb-1.5">
                  <span className="text-base">🇺🇸</span>
                  <span>English</span>
                </label>
                <Input
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="eg: Products"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Link Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Холбоос
              <span className="ml-2 text-xs font-normal text-slate-400">(Хаашаа хандах вэ?)</span>
            </label>
            <select
              value={selectedPage}
              onChange={(e) => handlePageSelect(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm hover:border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
            >
              {predefinedPages.map((page, i) => (
                <option key={i} value={page.value} disabled={page.disabled}>
                  {page.label}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {selectedPage === '#' ? 'Дэд цэс үүсгэхдээ # сонгоно' : selectedPage === 'custom' ? 'Гадаад линк оруулах' : 'Жагсаалтаас хуудас сонгох'}
            </p>
          </div>

          {selectedPage === 'custom' && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <Input
                label="URL хаяг"
                value={formData.href}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          )}

          {/* Parent & Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Эцэг цэс
                <span className="ml-1 text-xs font-normal text-slate-400">(опшнл)</span>
              </label>
              <Select
                value={formData.parentId || ''}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                options={getAllParents()}
              />
              <p className="mt-1 text-xs text-slate-500">Үндсэн цэс эсвэл дэд цэс</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Дараалал
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="mt-1 text-xs text-slate-500">Бага тоо эхэнд гарна</p>
            </div>
          </div>

          {/* Font & Color Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-slate-700">Фонт & Өнгө</span>
              <span className="text-xs text-slate-400">(текстийн загвар)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1.5">
                  Фонт сонгох
                </label>
                <select
                  value={formData.font || 'font-sans'}
                  onChange={(e) => setFormData({ ...formData, font: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm hover:border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                >
                  <option value="font-sans">Sans-serif (Өгөгдмөл)</option>
                  <option value="font-serif">Serif</option>
                  <option value="font-mono">Mono</option>
                </select>
                <p className="mt-1 text-xs text-slate-400" style={{ fontFamily: formData.font === 'font-serif' ? 'serif' : formData.font === 'font-mono' ? 'monospace' : 'sans-serif' }}>
                  Үзүүлэлт: {formData.title_mn || 'Цэсний нэр'}
                </p>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1.5">
                  Текст өнгө
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.textColor || '#1f2937'}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.textColor || '#1f2937'}
                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                    placeholder="#1f2937"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Hex код: {formData.textColor || '#1f2937'}
                </p>
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <div className="text-sm font-medium text-slate-700">Идэвхжүүлэх</div>
              <div className="text-xs text-slate-500 mt-0.5">Веб сайт дээр харагдах эсэх</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-5 py-2.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              ← Буцах
            </button>
            <Button variant="dark" type="submit" disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Хадгалж байна...
                </span>
              ) : (
                '✓ Хадгалах'
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Style Modal */}
      <Modal
        isOpen={styleModalOpen}
        onClose={() => setStyleModalOpen(false)}
        title="Header загвар"
        size="sm"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <ColorInput
              label="Фон өнгө"
              value={headerStyle.backgroundColor}
              onChange={(v) => setHeaderStyle({ ...headerStyle, backgroundColor: v })}
            />
            <ColorInput
              label="Текст өнгө"
              value={headerStyle.textColor}
              onChange={(v) => setHeaderStyle({ ...headerStyle, textColor: v })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ColorInput
              label="Hover өнгө"
              value={headerStyle.hoverColor}
              onChange={(v) => setHeaderStyle({ ...headerStyle, hoverColor: v })}
            />
            <div>
              <label className="block text-sm text-slate-700 mb-1.5">Өндөр</label>
              <input
                type="text"
                value={headerStyle.height}
                onChange={(e) => setHeaderStyle({ ...headerStyle, height: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                placeholder="80px"
              />
            </div>
          </div>

          <Checkbox
            label="Sticky (scroll хийхэд дээр үлдэх)"
            checked={headerStyle.isSticky}
            onChange={(e) => setHeaderStyle({ ...headerStyle, isSticky: e.target.checked })}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStyleModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600"
            >
              Хаах
            </button>
            <Button variant="dark" onClick={() => setStyleModalOpen(false)}>
              Хадгалах
            </Button>
          </div>
        </div>
      </Modal>

      {/* Style Tab Content */}
      {activeTab === 'style' && (
        <div className="space-y-6">
          {/* Өнгөний тохиргоо */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <SwatchIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Өнгөний тохиргоо</h3>
                  <p className="text-sm text-gray-500">Header-ийн өнгө, фонт</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              {/* Background Color */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900">Арын өнгө</label>
                    <p className="text-xs text-slate-500 mt-0.5">Header-ийн дэвсгэр өнгө</p>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: headerStyle.backgroundColor }}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={headerStyle.backgroundColor}
                    onChange={(e) => setHeaderStyle({ ...headerStyle, backgroundColor: e.target.value })}
                    className="w-16 h-10 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={headerStyle.backgroundColor}
                    onChange={(e) => setHeaderStyle({ ...headerStyle, backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900">Текстийн өнгө</label>
                    <p className="text-xs text-slate-500 mt-0.5">Цэсний үсгийн өнгө</p>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-white shadow-md flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: headerStyle.backgroundColor, color: headerStyle.textColor }}
                  >
                    Аа
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={headerStyle.textColor}
                    onChange={(e) => setHeaderStyle({ ...headerStyle, textColor: e.target.value })}
                    className="w-16 h-10 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={headerStyle.textColor}
                    onChange={(e) => setHeaderStyle({ ...headerStyle, textColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                    placeholder="#1f2937"
                  />
                </div>
              </div>

              {/* Hover Color */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900">Hover өнгө</label>
                    <p className="text-xs text-slate-500 mt-0.5">Хулгана дээр ирэхэд текст өнгө</p>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-white shadow-md flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: headerStyle.backgroundColor, color: headerStyle.hoverColor }}
                  >
                    Аа
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={headerStyle.hoverColor}
                    onChange={(e) => setHeaderStyle({ ...headerStyle, hoverColor: e.target.value })}
                    className="w-16 h-10 rounded-lg border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={headerStyle.hoverColor}
                    onChange={(e) => setHeaderStyle({ ...headerStyle, hoverColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                    placeholder="#0d9488"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Хэмжээ ба байршил */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16M4 12h16M4 19h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Хэмжээ тохиргоо</h3>
                <p className="text-sm text-gray-500">Өндөр болон sticky</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Height */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-sm font-semibold text-slate-900 mb-1">Header өндөр</label>
                <p className="text-xs text-slate-500 mb-3">Header-ийн босоо хэмжээ</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={headerStyle.height}
                    onChange={(e) => setHeaderStyle({ ...headerStyle, height: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-mono"
                    placeholder="80px эсвэл 5rem"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHeaderStyle({ ...headerStyle, height: '64px' })}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                        headerStyle.height === '64px'
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-teal-500'
                      }`}
                    >
                      Бага
                    </button>
                    <button
                      onClick={() => setHeaderStyle({ ...headerStyle, height: '80px' })}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                        headerStyle.height === '80px'
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-teal-500'
                      }`}
                    >
                      Дунд
                    </button>
                    <button
                      onClick={() => setHeaderStyle({ ...headerStyle, height: '96px' })}
                      className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                        headerStyle.height === '96px'
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-teal-500'
                      }`}
                    >
                      Том
                    </button>
                  </div>
                </div>
              </div>

              {/* Sticky */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-900 mb-1">Sticky Header</label>
                    <p className="text-xs text-slate-500">Scroll хийхэд header дээд талд наалдсан үлдэх</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={headerStyle.isSticky}
                      onChange={(e) => setHeaderStyle({ ...headerStyle, isSticky: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-teal-600 shadow-inner"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span>Буцах</span>
            </button>
            <Button variant="dark" onClick={handleSaveAll}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Хадгалах</span>
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Logo Tab Content */}
      {activeTab === 'logo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Logo тохиргоо</h3>
                <p className="text-sm text-gray-500">Компанийн лого оруулах</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Logo зураг оруулах</label>
                <p className="text-xs text-slate-500 mb-4">PNG, SVG эсвэл JPG файл оруулна уу. Transparent background сайн.</p>
                <ImageUpload
                  label=""
                  value={headerStyle.logoUrl}
                  onChange={(url) => setHeaderStyle({ ...headerStyle, logoUrl: url })}
                />
                {headerStyle.logoUrl && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 mb-2">Урьдчилан харах:</p>
                    <div className="flex items-center justify-center p-4 bg-slate-100 rounded-lg">
                      <img src={headerStyle.logoUrl} alt="Logo preview" className="max-h-16 w-auto object-contain" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-blue-800">
                  <strong>Зөвлөмж:</strong> Logo-г оруулаагүй бол өгөгдмөл "BG" хэлбэрийн logo харагдана. Тодорхой хэмжээ: 40-60px өндөр.
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span>Буцах</span>
            </button>
            <Button variant="dark" onClick={handleSaveAll}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>Хадгалах</span>
              </span>
            </Button>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  )
}

// Recursive menu item row
interface MenuItemRowProps {
  item: MenuItem
  level: number
  getChildren: (parentId: string) => MenuItem[]
  onEdit: (item: MenuItem) => void
  onDelete: (item: MenuItem) => void
  expandedIds: Set<string>
  onToggle: (id: string) => void
}

function MenuItemRow({ item, level, getChildren, onEdit, onDelete, expandedIds, onToggle }: MenuItemRowProps) {
  const children = getChildren(item.id)
  const hasChildren = children.length > 0
  const isHashLink = item.href === '#' || item.href.startsWith('#')
  const isExpanded = expandedIds.has(item.id)
  
  // Түвшний өнгө
  const levelColors = [
    'border-l-teal-500 bg-white',
    'border-l-blue-400 bg-slate-50/70',
    'border-l-purple-400 bg-slate-100/50',
  ]
  
  return (
    <>
      <div 
        className={`flex items-center justify-between px-3 py-2.5 hover:bg-slate-100/80 border-l-4 transition-colors ${levelColors[level] || levelColors[2]}`}
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Нээх/хаах товч */}
          {hasChildren ? (
            <button 
              onClick={() => onToggle(item.id)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
            >
              <svg 
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <span className="w-6 h-6 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            </span>
          )}
          
          {/* Цэсний нэр */}
          <span 
            className={`font-medium ${item.isActive ? 'text-slate-900' : 'text-slate-400 line-through'} ${item.font || 'font-sans'}`}
            style={{ color: item.isActive && item.textColor ? item.textColor : undefined }}
          >
            {item.title_mn}
          </span>
          
          {/* Badge-ууд */}
          {item.font && item.font !== 'font-sans' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
              {item.font.replace('font-', '')}
            </span>
          )}
          {item.textColor && item.textColor !== '#1f2937' && (
            <div 
              className="w-4 h-4 rounded border border-slate-200 shadow-sm" 
              style={{ backgroundColor: item.textColor }}
              title={`Өнгө: ${item.textColor}`}
            />
          )}
          {isHashLink && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
              dropdown
            </span>
          )}
          {hasChildren && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600">
              {children.length}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* URL */}
          {!isHashLink && (
            <span className="text-xs text-slate-400 truncate max-w-[150px] hidden sm:block">
              {item.href}
            </span>
          )}
          
          {/* Төлөв */}
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          
          {/* Үйлдлүүд */}
          <div className="flex items-center">
            <button 
              onClick={() => onEdit(item)} 
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Засах"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete(item)} 
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Устгах"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Хүүхэд цэсүүд */}
      {hasChildren && isExpanded && (
        <div className="animate-in slide-in-from-top-1 duration-200">
          {children.map(child => (
            <MenuItemRow
              key={child.id}
              item={child}
              level={level + 1}
              getChildren={getChildren}
              onEdit={onEdit}
              onDelete={onDelete}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </>
  )
}

// Color input component
function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-9 rounded border border-slate-200 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1.5 rounded border border-slate-200 text-sm"
        />
      </div>
    </div>
  )
}
