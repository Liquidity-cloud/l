
'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import ImageUpload from '@/components/ImageUpload'
import Image from 'next/image'

interface AboutSection {
  section_id: string
  title_mn: string
  title_en: string
  content_mn: string
  content_en: string
  image_url: string
  display_order: number
}

interface CompanyStat {
  stat_id: number
  label_mn: string
  label_en: string
  value: string
  icon: string
  display_order: number
}

interface TeamMember {
  member_id: number
  name_mn: string
  name_en: string
  position_mn: string
  position_en: string
  email: string
  phone: string
  image_url: string
  display_order: number
}

export default function AboutAdminPage() {
  const [sections, setSections] = useState<AboutSection[]>([])
  const [stats, setStats] = useState<CompanyStat[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sections' | 'stats' | 'team'>('sections')

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/about')
      if (!res.ok) throw new Error('Failed to fetch data')
      const data = await res.json()
      const validSections = (data.sections || []).filter((s: any) => s.section_id && s.section_id !== 'undefined' && s.section_id !== 'null');
      setSections(validSections)
      setStats(data.stats || [])
      setTeam(data.team || [])
    } catch (error) {
      console.error('Error fetching about data:', error)
      alert('Мэдээлэл татахад алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- SECTIONS ---
  const updateSection = (id: string, field: keyof AboutSection, value: string | number) => {
    setSections(sections.map(s => s.section_id === id ? { ...s, [field]: value } : s))
  }

  const saveSection = async (section: AboutSection) => {
    if (!section.section_id || section.section_id === 'undefined') {
      alert('Section ID is missing. Please refresh the page.');
      return;
    }
    if (!section.title_mn || !section.content_mn) {
      alert('Гарчиг болон Агуулга (Монгол) заавал байх ёстой.')
      return
    }
    try {
      const res = await fetch(`/api/admin/about/sections/${section.section_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section)
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update section');
      }
      alert('Амжилттай хадгаллаа')
    } catch (error) {
      console.error(error)
      alert('Хадгалахад алдаа гарлаа')
    }
  }

  // --- STATS ---
  const addStat = async () => {
    try {
      const newStat = {
        label_mn: 'Шинэ үзүүлэлт',
        label_en: 'New Stat',
        value: '0',
        icon: '',
        display_order: stats.length + 1
      }
      const res = await fetch('/api/admin/about/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStat)
      })
      if (!res.ok) throw new Error('Failed to create stat')
      const created = await res.json()
      setStats([...stats, created])
    } catch (error) {
      console.error(error)
      alert('Нэмэхэд алдаа гарлаа')
    }
  }

  const deleteStat = async (id: number) => {
    if (!confirm('Устгах уу?')) return
    try {
      const res = await fetch(`/api/admin/about/stats/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete stat')
      setStats(stats.filter(s => s.stat_id !== id))
    } catch (error) {
      console.error(error)
      alert('Устгахад алдаа гарлаа')
    }
  }

  const updateStatState = (id: number, field: keyof CompanyStat, value: string | number) => {
    setStats(stats.map(s => s.stat_id === id ? { ...s, [field]: value } : s))
  }

  const saveStat = async (stat: CompanyStat) => {
    try {
      const res = await fetch(`/api/admin/about/stats/${stat.stat_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stat)
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update stat');
      }
      alert('Амжилттай хадгаллаа')
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Хадгалахад алдаа гарлаа')
    }
  }

  // --- TEAM ---
  const addTeamMember = async () => {
    try {
      const newMember = {
        name_mn: 'Шинэ гишүүн',
        name_en: 'New Member',
        position_mn: 'Албан тушаал',
        position_en: 'Position',
        email: '',
        phone: '',
        image_url: '',
        display_order: team.length + 1
      }
      const res = await fetch('/api/admin/about/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      })
      if (!res.ok) throw new Error('Failed to create team member')
      const created = await res.json()
      setTeam([...team, created])
    } catch (error) {
      console.error(error)
      alert('Нэмэхэд алдаа гарлаа')
    }
  }

  const deleteTeamMember = async (id: number) => {
    if (!confirm('Устгах уу?')) return
    try {
      const res = await fetch(`/api/admin/about/team/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete team member')
      setTeam(team.filter(t => t.member_id !== id))
    } catch (error) {
      console.error(error)
      alert('Устгахад алдаа гарлаа')
    }
  }

  const updateTeamState = (id: number, field: keyof TeamMember, value: string | number) => {
    setTeam(team.map(t => t.member_id === id ? { ...t, [field]: value } : t))
  }

  const saveTeamMember = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/admin/about/team/${member.member_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update team member');
      }
      alert('Амжилттай хадгаллаа')
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Хадгалахад алдаа гарлаа')
    }
  }

  if (loading) return <div className="p-10 text-center">Уншиж байна...</div>

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Бидний тухай</h1>
            <p className="text-slate-600">Компанийн танилцуулга болон бусад мэдээллийг удирдах</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 mb-6">
            <div className="flex gap-2 border-b border-slate-200 pb-4">
              <button
                onClick={() => setActiveTab('sections')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'sections' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                Бүлэгүүд
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'stats' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                Статистик
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'team' ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                Баг хамт олон
              </button>
            </div>
          </div>

          {/* Sections Tab */}
          {activeTab === 'sections' && (
            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.section_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 capitalize">{section.section_id}</h3>
                    <button
                      onClick={() => saveSection(section)}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700"
                    >
                      Хадгалах
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Гарчиг (Монгол)</label>
                      <input
                        type="text"
                        value={section.title_mn}
                        onChange={(e) => updateSection(section.section_id, 'title_mn', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Title (English)</label>
                      <input
                        type="text"
                        value={section.title_en}
                        onChange={(e) => updateSection(section.section_id, 'title_en', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Агуулга (Монгол)</label>
                      <textarea
                        value={section.content_mn}
                        onChange={(e) => updateSection(section.section_id, 'content_mn', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Content (English)</label>
                      <textarea
                        value={section.content_en}
                        onChange={(e) => updateSection(section.section_id, 'content_en', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    {/* Only show Image Upload for intro section (or others if needed), hide for mission/vision/values/history as requested */}
                    {['intro'].includes(section.section_id) && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Зураг</label>
                        <ImageUpload
                          onChange={(url) => updateSection(section.section_id, 'image_url', url)}
                          value={section.image_url || ''}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-900">Компанийн статистик</h2>
                <button
                  onClick={addStat}
                  className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800"
                >
                  + Нэмэх
                </button>
              </div>
              {stats.map((stat) => (
                <div key={stat.stat_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-slate-500">ID: {stat.stat_id}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveStat(stat)}
                        className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                      >
                        Хадгалах
                      </button>
                      <button
                        onClick={() => deleteStat(stat.stat_id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Устгах
                      </button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Label (Монгол)</label>
                      <input
                        type="text"
                        value={stat.label_mn}
                        onChange={(e) => updateStatState(stat.stat_id, 'label_mn', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Label (English)</label>
                      <input
                        type="text"
                        value={stat.label_en}
                        onChange={(e) => updateStatState(stat.stat_id, 'label_en', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Утга</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStatState(stat.stat_id, 'value', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-900">Баг хамт олон</h2>
                <button
                  onClick={addTeamMember}
                  className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800"
                >
                  + Нэмэх
                </button>
              </div>
              {team.map((member) => (
                <div key={member.member_id} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-slate-500">ID: {member.member_id}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveTeamMember(member)}
                        className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                      >
                        Хадгалах
                      </button>
                      <button
                        onClick={() => deleteTeamMember(member.member_id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Устгах
                      </button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Нэр (Монгол)</label>
                      <input
                        type="text"
                        value={member.name_mn}
                        onChange={(e) => updateTeamState(member.member_id, 'name_mn', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Name (English)</label>
                      <input
                        type="text"
                        value={member.name_en}
                        onChange={(e) => updateTeamState(member.member_id, 'name_en', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Албан тушаал (Монгол)</label>
                      <input
                        type="text"
                        value={member.position_mn}
                        onChange={(e) => updateTeamState(member.member_id, 'position_mn', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Position (English)</label>
                      <input
                        type="text"
                        value={member.position_en}
                        onChange={(e) => updateTeamState(member.member_id, 'position_en', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Имэйл</label>
                      <input
                        type="email"
                        value={member.email || ''}
                        onChange={(e) => updateTeamState(member.member_id, 'email', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Утас</label>
                      <input
                        type="text"
                        value={member.phone || ''}
                        onChange={(e) => updateTeamState(member.member_id, 'phone', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Зураг</label>
                      <ImageUpload
                        value={member.image_url || ''}
                        onChange={(url) => updateTeamState(member.member_id, 'image_url', url)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
