'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/Container';
import Image from 'next/image';

interface AboutSection {
  section_id: string;
  title_mn: string;
  title_en: string;
  content_mn: string;
  content_en: string;
  image_url: string;
  display_order: number;
}

interface TeamMember {
  member_id: number;
  name_mn: string;
  name_en: string;
  position_mn: string;
  position_en: string;
  image_url: string;
  email: string;
  phone: string;
  display_order: number;
}

interface CompanyStat {
  stat_id: number;
  label_mn: string;
  label_en: string;
  value: string;
  icon: string;
  display_order: number;
}

export default function AboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<CompanyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001';
        console.log('Fetching about data from:', `${BACKEND_URL}/api/about`);
        const res = await fetch(`${BACKEND_URL}/api/about`, { cache: 'no-store' });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText} - ${errorText}`);
        }
        const data = await res.json();
        setSections(data.sections || []);
        setTeam(data.team || []);
        setStats(data.stats || []);
      } catch (error) {
        console.error('Error fetching about data:', error);
        // Set empty data to avoid inconsistent state, though initial state is empty
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSection = (id: string) => sections.find(s => s.section_id === id);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
        <p className="mt-2 text-gray-500">Ачаалж байна...</p>
      </div>
    );
  }

  const intro = getSection('intro');
  const mission = getSection('mission');
  const vision = getSection('vision');
  const values = getSection('values');
  const history = getSection('history');

  return (
    <div className="py-16 md:py-24">
      <Container>
        {/* Hero / Intro */}
        {intro && (
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{intro.title_mn}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto whitespace-pre-line">
              {intro.content_mn}
            </p>
            {intro.image_url && intro.image_url !== 'undefined' && (
              <div className="mt-8 relative h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={intro.image_url.startsWith('http') ? intro.image_url : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001'}${intro.image_url}`}
                  alt={intro.title_mn}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        )}

        {/* Stats Section */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat) => (
              <div key={stat.stat_id} className="text-center p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold text-teal-600 mb-2">{stat.value}</div>
                <div className="text-gray-900 font-medium">{stat.label_mn}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label_en}</div>
              </div>
            ))}
          </div>
        )}

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-12 mb-16">
          {mission && (
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:border-teal-200 transition-colors">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl"></span>
              </div>
              <h2 className="text-2xl font-semibold mb-4">{mission.title_mn}</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {mission.content_mn}
              </p>
            </div>
          )}

          {vision && (
            <div className="bg-white p-8 rounded-xl shadow-sm border hover:border-orange-200 transition-colors">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👁️</span>
              </div>
              <h2 className="text-2xl font-semibold mb-4">{vision.title_mn}</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {vision.content_mn}
              </p>
            </div>
          )}
        </section>

        {/* Values */}
        {values && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">{values.title_mn}</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
              <p className="text-lg text-gray-700 whitespace-pre-line leading-relaxed">
                {values.content_mn}
              </p>
            </div>
          </section>
        )}

        {/* History */}
        {history && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">{history.title_mn}</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {history.image_url && history.image_url !== 'undefined' && (
                  <div className="w-full md:w-1/3 relative h-64 rounded-xl overflow-hidden">
                    <Image
                      src={history.image_url.startsWith('http') ? history.image_url : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001'}${history.image_url}`}
                      alt={history.title_mn}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                    {history.content_mn}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Team Section */}
        {team.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10">Манай баг</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map(member => (
                <div key={member.member_id} className="bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-lg transition-all duration-300 group">
                  <div className="relative h-80 bg-gray-100 overflow-hidden">
                    {member.image_url ? (
                      <Image
                        src={member.image_url.startsWith('http') ? member.image_url : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:3001'}${member.image_url}`}
                        alt={member.name_mn}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900">{member.name_mn}</h3>
                    <p className="text-teal-600 font-medium mb-2">{member.position_mn}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </Container>
    </div>
  )
}

