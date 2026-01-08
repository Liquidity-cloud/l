'use client'

import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Input, Button, PageHeader } from '@/components/FormElements'
import { useSaveReset } from '@/hooks/useSaveReset'
import { SaveResetButtons } from '@/components/SaveResetButtons'

interface FooterData {
  logoText: string
  description: { mn: string; en: string }
  address: { mn: string; en: string }
  email: string
  phone: string
  facebook: string
  instagram: string
  twitter: string
  copyright: { mn: string; en: string }
  // Styling options
  bgColor: string
  textColor: string
  accentColor: string
  titleSize: string
  textSize: string
  iconColor: string
}

const defaultData: FooterData = {
  logoText: 'BichilGlobus',
  description: {
    mn: 'Таны бизнесийг дэлхийд холбох финтек шийдлүүд. Бид хурдан, найдвартай, ил тод үйлчилгээг эрхэмлэнэ.',
    en: 'Fintech solutions connecting your business to the world. We prioritize fast, reliable, and transparent service.'
  },
  address: {
    mn: 'Улаанбаатар хот',
    en: 'Ulaanbaatar City'
  },
  email: 'info@bichilglobus.mn',
  phone: '+976 9999-9999',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  twitter: 'https://twitter.com',
  copyright: {
    mn: 'Бүх эрх хуулиар хамгаалагдсан.',
    en: 'All rights reserved.'
  },
  // Default styling
  bgColor: '#ffffff',
  textColor: '#4b5563',
  accentColor: '#14b8a6',
  titleSize: 'text-base',
  textSize: 'text-sm',
  iconColor: '#14b8a6'
}

export default function FooterPage() {
  const { data, setData, saveSuccess, handleSave: saveData, handleReset } = useSaveReset<FooterData>('footerConfig', defaultData)
  const [lang, setLang] = useState<'mn' | 'en'>('mn')

  return (
    <AdminLayout title="Footer">
      <div className="max-w-4xl mx-auto">
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
          title="Footer удирдлага"
          description="Веб сайтын доод хэсгийн мэдээлэл"
          action={
            <SaveResetButtons 
              onSave={saveData}
              onReset={handleReset}
              confirmMessage="Та хадгалахдаа итгэлтэй байна уу?"
            />
          }
        />

        {/* Live Preview */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-50">
          <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-white/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Preview
              </span>
            </div>
          </div>
          <div className="p-4">
            <footer className="text-white rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: data.bgColor }}>
              <div className="px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Column 1 - About */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg" style={{ background: `linear-gradient(to bottom right, ${data.accentColor}, ${data.accentColor}dd)` }}>
                        BG
                      </div>
                      <span className={`${data.titleSize} font-bold text-white`}>{data.logoText}</span>
                    </div>
                    <p className={`${data.textSize} leading-relaxed`} style={{ color: data.textColor }}>
                      {data.description[lang]}
                    </p>
                  </div>

                  {/* Column 2 - Contact */}
                  <div>
                    <h4 className={`${data.titleSize} font-semibold mb-4 text-white`}>
                      {lang === 'mn' ? 'Холбоо барих' : 'Contact Us'}
                    </h4>
                    <div className={`space-y-3 ${data.textSize}`} style={{ color: data.textColor }}>
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: data.iconColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{data.address[lang]}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: data.iconColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{data.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: data.iconColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{data.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3 - Social */}
                  <div>
                    <h4 className={`${data.titleSize} font-semibold mb-4 text-white`}>
                      {lang === 'mn' ? 'Биднийг дагах' : 'Follow Us'}
                    </h4>
                    <div className="flex gap-3">
                      {data.facebook && (
                        <a href={data.facebook} className="w-10 h-10 rounded-full bg-gray-800 hover:bg-teal-600 flex items-center justify-center transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                      )}
                      {data.instagram && (
                        <a href={data.instagram} className="w-10 h-10 rounded-full bg-gray-800 hover:bg-teal-600 flex items-center justify-center transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                          </svg>
                        </a>
                      )}
                      {data.twitter && (
                        <a href={data.twitter} className="w-10 h-10 rounded-full bg-gray-800 hover:bg-teal-600 flex items-center justify-center transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="border-t px-8 py-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className={data.textSize} style={{ color: data.textColor }}>
                    © {new Date().getFullYear()} {data.logoText}. {data.copyright[lang]}
                  </p>
                  <div className={`flex gap-6 ${data.textSize}`} style={{ color: data.textColor }}>
                    <a href="#" className="transition-colors hover:opacity-80">
                      {lang === 'mn' ? 'Нууцлал' : 'Privacy'}
                    </a>
                    <a href="#" className="transition-colors hover:opacity-80">
                      {lang === 'mn' ? 'Үйлчилгээний нөхцөл' : 'Terms of Service'}
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>

        {/* Edit Form - Language Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 inline-flex gap-1">
            <button
              onClick={() => setLang('mn')}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                lang === 'mn'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-200 scale-105'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🇲🇳</span>
                <span>Монгол</span>
              </span>
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                lang === 'en'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-200 scale-105'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🇬🇧</span>
                <span>English</span>
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Үндсэн мэдээлэл */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {lang === 'mn' ? 'Үндсэн мэдээлэл' : 'Basic Information'}
              </h3>
            </div>
            <div className="space-y-4">
              <Input
                label={lang === 'mn' ? 'Лого текст' : 'Logo Text'}
                value={data.logoText}
                onChange={(e) => setData({ ...data, logoText: e.target.value })}
                placeholder="BichilGlobus"
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {lang === 'mn' ? 'Тайлбар' : 'Description'} ({lang === 'mn' ? 'Монгол' : 'English'})
                </label>
                <textarea
                  value={data.description[lang]}
                  onChange={(e) => setData({ 
                    ...data, 
                    description: { ...data.description, [lang]: e.target.value }
                  })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700"
                  placeholder={lang === 'mn' ? 'Компанийн тухай богино тайлбар...' : 'Brief company description...'}
                />
              </div>
            </div>
          </div>

          {/* Холбоо барих */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {lang === 'mn' ? 'Холбоо барих' : 'Contact'}
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {lang === 'mn' ? 'Хаяг' : 'Address'} ({lang === 'mn' ? 'Монгол' : 'English'})
                </label>
                <input
                  type="text"
                  value={data.address[lang]}
                  onChange={(e) => setData({ 
                    ...data, 
                    address: { ...data.address, [lang]: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  placeholder={lang === 'mn' ? 'Улаанбаатар хот, ...' : 'Ulaanbaatar City, ...'}
                />
              </div>
              <Input
                label={lang === 'mn' ? 'И-мэйл' : 'Email'}
                type="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="info@example.com"
              />
              <Input
                label={lang === 'mn' ? 'Утас' : 'Phone'}
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="+976 9999-9999"
              />
            </div>
          </div>

          {/* Нийгмийн сүлжээ */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {lang === 'mn' ? 'Нийгмийн сүлжээ' : 'Social Media'}
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Facebook</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={data.facebook}
                    onChange={(e) => setData({ ...data, facebook: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Instagram</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z"/>
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={data.instagram}
                    onChange={(e) => setData({ ...data, instagram: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Twitter / X</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={data.twitter}
                    onChange={(e) => setData({ ...data, twitter: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Өнгө болон харагдах байдал */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {lang === 'mn' ? 'Өнгө & Үсэг' : 'Colors & Typography'}
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {lang === 'mn' ? 'Арын өнгө' : 'Background Color'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={data.bgColor}
                    onChange={(e) => setData({ ...data, bgColor: e.target.value })}
                    className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={data.bgColor}
                    onChange={(e) => setData({ ...data, bgColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    placeholder="#111827"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {lang === 'mn' ? 'Текстийн өнгө' : 'Text Color'}
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
                    placeholder="#9ca3af"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {lang === 'mn' ? 'Онцлох өнгө' : 'Accent Color'}
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
                    placeholder="#14b8a6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {lang === 'mn' ? 'Иконы өнгө' : 'Icon Color'}
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
                    placeholder="#14b8a6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {lang === 'mn' ? 'Гарчгийн хэмжээ' : 'Title Size'}
                </label>
                <select
                  value={data.titleSize}
                  onChange={(e) => setData({ ...data, titleSize: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="text-sm">Small</option>
                  <option value="text-base">Base</option>
                  <option value="text-lg">Large</option>
                  <option value="text-xl">XL</option>
                  <option value="text-2xl">2XL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {lang === 'mn' ? 'Текстийн хэмжээ' : 'Text Size'}
                </label>
                <select
                  value={data.textSize}
                  onChange={(e) => setData({ ...data, textSize: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="text-xs">XSmall</option>
                  <option value="text-sm">Small</option>
                  <option value="text-base">Base</option>
                  <option value="text-lg">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Copyright</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {lang === 'mn' ? 'Copyright текст' : 'Copyright Text'} ({lang === 'mn' ? 'Монгол' : 'English'})
                </label>
                <input
                  type="text"
                  value={data.copyright[lang]}
                  onChange={(e) => setData({ 
                    ...data, 
                    copyright: { ...data.copyright, [lang]: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  placeholder={lang === 'mn' ? 'Бүх эрх хуулиар хамгаалагдсан.' : 'All rights reserved.'}
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500">
                💡 {lang === 'mn' 
                  ? `Жилийн дугаар автоматаар харагдана: © ${new Date().getFullYear()}` 
                  : `Year is automatically displayed: © ${new Date().getFullYear()}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Helper Section */}
        <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">
                {lang === 'mn' ? 'Хэрэглэгчийн заавар' : 'User Guide'}
              </h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• {lang === 'mn' 
                  ? 'Footer нь веб сайтын бүх хуудсанд харагдана' 
                  : 'Footer is displayed on all website pages'}
                </li>
                <li>• {lang === 'mn' 
                  ? 'Нийгмийн сүлжээний холбоос бүрэн URL хэлбэрээр оруулна' 
                  : 'Enter social media links in full URL format'}
                </li>
                <li>• {lang === 'mn' 
                  ? 'Лого текст болон тайлбар нь брэнд identity-д ашиглагдана' 
                  : 'Logo text and description are used in brand identity'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
