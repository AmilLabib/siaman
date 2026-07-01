import { useState } from 'react'
import type React from 'react'
import { useApp } from '../context/AppContext'
import TopBar from '../components/TopBar'
import type { IncidentStatus, IncidentType } from '../types'

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} jam lalu`
  const days = Math.floor(hrs / 24)
  return `${days} hari lalu`
}

const statusConfig: Record<IncidentStatus, { label: string; bg: string; text: string }> = {
  aktif: { label: 'Aktif', bg: 'bg-red-100', text: 'text-red-600' },
  ditangani: { label: 'Ditangani', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  selesai: { label: 'Selesai', bg: 'bg-green-100', text: 'text-green-700' },
}

const typeIcon: Record<IncidentType, React.ReactElement> = {
  maling: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  kerusuhan: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  kebakaran: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
  mencurigakan: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  lainnya: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
}

const typeLabel: Record<IncidentType, string> = {
  maling: 'Maling',
  kerusuhan: 'Kerusuhan',
  kebakaran: 'Kebakaran',
  mencurigakan: 'Mencurigakan',
  lainnya: 'Lainnya',
}

export default function IncidentsPage() {
  const { incidents } = useApp()
  const [filter, setFilter] = useState<IncidentStatus | 'semua'>('semua')

  const filtered = filter === 'semua' ? incidents : incidents.filter((i) => i.status === filter)

  const counts = {
    semua: incidents.length,
    aktif: incidents.filter((i) => i.status === 'aktif').length,
    ditangani: incidents.filter((i) => i.status === 'ditangani').length,
    selesai: incidents.filter((i) => i.status === 'selesai').length,
  }

  return (
    <div className="pb-24">
      <TopBar title="Riwayat Laporan" />

      {/* Filter tabs */}
      <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
        {(['semua', 'aktif', 'ditangani', 'selesai'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {f === 'semua' ? 'Semua' : f === 'aktif' ? 'Aktif' : f === 'ditangani' ? 'Ditangani' : 'Selesai'}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              filter === f ? 'bg-white/30 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={1.5} className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="font-bold text-blue-950">Tidak ada laporan</p>
          <p className="text-gray-400 text-sm mt-1">Belum ada kejadian dalam kategori ini</p>
        </div>
      ) : (
        <div className="px-4 space-y-3 pt-2">
          {filtered.map((inc) => {
            const sc = statusConfig[inc.status]
            return (
              <div key={inc.id} className={`bg-white border rounded-2xl p-4 ${
                inc.status === 'aktif' ? 'border-red-200' : 'border-blue-100'
              }`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      inc.status === 'aktif' ? 'bg-red-100 text-red-500' : inc.status === 'ditangani' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {typeIcon[inc.type]}
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-blue-950">{typeLabel[inc.type]}</p>
                      <p className="text-xs text-gray-500">{formatRelative(inc.timestamp)}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
                    {sc.label}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-3.5 h-3.5 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <p className="text-xs text-blue-700">{inc.location.label}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-3.5 h-3.5 flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-xs text-gray-600 leading-relaxed">{inc.description}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-blue-50 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Dilaporkan oleh: <span className="font-semibold text-blue-700">{inc.reportedBy}</span></p>
                    {inc.respondedBy && (
                      <p className="text-xs text-gray-400">Ditangani: <span className="font-semibold text-green-700">{inc.respondedBy}</span></p>
                    )}
                  </div>
                  {inc.isEmergency && (
                    <span className="text-xs bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-full">Darurat</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
