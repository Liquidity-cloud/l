"use client";

import { useState, useMemo, useEffect } from "react";
import Container from "@/components/Container";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

interface Branch {
  branch_id: number;
  branch_name: string;
  address: string;
  work_days: string | null;
  work_hours: string | null;
  latitude: string | null;
  longitude: string | null;
  phone_numbers: string[] | null;
  province_name: string | null;
  district_name: string | null;
  region_name: string | null;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeRegion, setActiveRegion] = useState<"all" | "ulaanbaatar" | "aimag">("all");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/branches`);
        if (!res.ok) throw new Error('Failed to fetch branches');
        const data = await res.json();
        setBranches(data);
      } catch (err) {
        console.error('Error loading branches:', err);
        setError('Салбарын мэдээлэл авахад алдаа гарлаа');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  // Шүүлтүүр
  const filteredBranches = useMemo(() => {
    if (activeRegion === "ulaanbaatar") {
      return branches.filter((b) => b.province_name === "Улаанбаатар" || b.region_name === "Улаанбаатар");
    } else if (activeRegion === "aimag") {
      return branches.filter((b) => b.province_name !== "Улаанбаатар" && b.region_name !== "Улаанбаатар");
    }
    return branches;
  }, [activeRegion, branches]);

  // Google Maps URL
  const getMapUrl = () => {
    if (filteredBranches.length === 0) return "";

    // Default center (Ulaanbaatar)
    let centerLat = 47.9184;
    let centerLng = 106.9177;
    let zoom = 12;

    if (selectedBranch && selectedBranch.latitude && selectedBranch.longitude) {
      centerLat = parseFloat(selectedBranch.latitude);
      centerLng = parseFloat(selectedBranch.longitude);
      zoom = 15;
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${centerLat},${centerLng}&zoom=${zoom}`;
    } else if (filteredBranches.length > 0) {
      // Calculate center of all visible branches
      const validBranches = filteredBranches.filter(b => b.latitude && b.longitude);
      if (validBranches.length > 0) {
        centerLat = validBranches.reduce((sum, b) => sum + parseFloat(b.latitude!), 0) / validBranches.length;
        centerLng = validBranches.reduce((sum, b) => sum + parseFloat(b.longitude!), 0) / validBranches.length;
        zoom = activeRegion === "all" ? 6 : 11;
      }
    }

    return `https://maps.google.com/maps?q=${centerLat},${centerLng}&z=${zoom}&output=embed`;
  };

  const getDirectionsUrl = (branch: Branch) => {
    if (!branch.latitude || !branch.longitude) return "#";
    return `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;
  };

  return (
    <main className="min-h-screen bg-white">
      <Container>
        <div className="py-6 md:py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Салбарын байршил</h1>

          {/* Шүүлтүүр */}
          <div className="flex items-center gap-1 mb-8 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => {
                setActiveRegion("all");
                setSelectedBranch(null);
              }}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${activeRegion === "all"
                ? "text-teal-600 border-teal-600"
                : "text-gray-500 border-transparent hover:text-gray-900"
                }`}
            >
              Бүгд
            </button>
            <button
              onClick={() => {
                setActiveRegion("ulaanbaatar");
                setSelectedBranch(null);
              }}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${activeRegion === "ulaanbaatar"
                ? "text-teal-600 border-teal-600"
                : "text-gray-500 border-transparent hover:text-gray-900"
                }`}
            >
              Улаанбаатар
            </button>
            <button
              onClick={() => {
                setActiveRegion("aimag");
                setSelectedBranch(null);
              }}
              className={`px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${activeRegion === "aimag"
                ? "text-teal-600 border-teal-600"
                : "text-gray-500 border-transparent hover:text-gray-900"
                }`}
            >
              Орон нутаг
            </button>
          </div>

          {/* Loading / Error States */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              {error}
            </div>
          ) : (
            /* Контент */
            <div className="space-y-6">
              {/* Google Map */}
              <div className="h-[300px] md:h-[400px] bg-gray-100 rounded-2xl overflow-hidden relative shadow-inner">
                <iframe
                  src={getMapUrl()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Салбаруудын байршил"
                />
              </div>

              {/* Салбарын жагсаалт */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBranches.map((branch) => (
                  <div
                    key={branch.branch_id}
                    onClick={() => setSelectedBranch(branch)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${selectedBranch?.branch_id === branch.branch_id
                      ? "border-teal-500 bg-teal-50 shadow-md"
                      : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Pin icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${selectedBranch?.branch_id === branch.branch_id
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-500"
                        }`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{branch.branch_name}</h3>
                          {branch.district_name && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              {branch.district_name}
                            </span>
                          )}
                          {branch.province_name && branch.province_name !== 'Улаанбаатар' && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                              {branch.province_name}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{branch.address}</p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                          {branch.phone_numbers && branch.phone_numbers.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{branch.phone_numbers[0]}</span>
                            </div>
                          )}

                          {branch.work_hours && (
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{branch.work_hours}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3">
                          <a
                            href={getDirectionsUrl(branch)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
                          >
                            <span>Чиглэл авах</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBranches.length === 0 && (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">Одоогоор салбар байхгүй байна</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
