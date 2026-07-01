import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { mockOfficers, mockCCTV, complexStats } from '../data/mockData'
import type { IncidentStatus } from '../types'

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} jam lalu`
  return `${Math.floor(hrs / 24)} hari lalu`
}

const statusConfig: Record<IncidentStatus, { label: string; bg: string; text: string }> = {
  aktif: { label: 'Aktif', bg: 'bg-red-100', text: 'text-red-600' },
  ditangani: { label: 'Ditangani', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  selesai: { label: 'Selesai', bg: 'bg-green-100', text: 'text-green-700' },
}

export default function SatpamDashboard() {
  const { currentUser, incidents, unreadCount, speakerActive, setSpeakerActive } = useApp()
  const navigate = useNavigate()

  const activeIncidents = incidents.filter((i) => i.status === 'aktif')
  const pendingIncidents = incidents.filter((i) => i.status === 'ditangani')
  const onlineCCTV = mockCCTV.filter((c) => c.status === 'online').length
  const onlineOfficers = mockOfficers.filter((o) => o.status === 'bertugas').length

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-800 px-5 pt-14 pb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 430 30" fill="white"><path d="M0 30H430V15C360 0 280 30 215 15C150 0 70 30 0 15V30Z"/></svg>
        </div>
        <div className="relative z-10 flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping-slow" />
              <span className="text-green-300 text-xs font-bold uppercase tracking-widest">Bertugas</span>
            </div>
            <h1 className="text-white text-2xl font-extrabold">{currentUser?.name?.split(' ')[0]}</h1>
            <p className="text-blue-200/70 text-xs mt-0.5">Satpam · {currentUser?.unitNo}</p>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick stats */}
        <div className="relative z-10 grid grid-cols-4 gap-2">
          {[
            { val: activeIncidents.length, label: 'Aktif', color: activeIncidents.length > 0 ? 'text-red-300' : 'text-white' },
            { val: pendingIncidents.length, label: 'Proses', color: 'text-yellow-300' },
            { val: onlineOfficers, label: 'Satpam', color: 'text-green-300' },
            { val: onlineCCTV, label: 'CCTV', color: 'text-blue-300' },
          ].map((s) => (
            <div key={s.label} className="bg-white/15 rounded-2xl p-3 text-center backdrop-blur-sm">
              <p className={`text-xl font-extrabold ${s.color}`}>{s.val}</p>
              <p className="text-white/60 text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active incidents alert */}
      {activeIncidents.length > 0 && (
        <div className="mx-4 mt-4">
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping-slow" />
              <p className="font-extrabold text-red-700 text-sm">{activeIncidents.length} Kejadian Aktif</p>
            </div>
            {activeIncidents.map((inc) => (
              <div key={inc.id} className="bg-white rounded-xl p-3 mb-2 last:mb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm text-blue-950">{inc.reporterAddress}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{inc.description}</p>
                    <p className="text-xs text-red-400 mt-1">{formatRelative(inc.timestamp)}</p>
                  </div>
                  <button
                    onClick={() => navigate('/map')}
                    className="ml-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg press-effect"
                  >
                    Navigasi →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Speaker control */}
      <div className="mx-4 mt-4">
        <div className={`rounded-2xl p-4 border-2 transition-all ${
          speakerActive ? 'bg-blue-50 border-blue-300' : 'bg-white border-blue-100'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                speakerActive ? 'bg-blue-600' : 'bg-gray-100'
              }`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-6 h-6 ${speakerActive ? 'text-white' : 'text-gray-400'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 000-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <div>
                <p className="font-extrabold text-blue-950 text-sm">Speaker / Toa Komplek</p>
                <p className={`text-xs ${speakerActive ? 'text-blue-500 font-semibold' : 'text-gray-400'}`}>
                  {speakerActive ? '● Sedang aktif — pengumuman darurat' : 'Nonaktif'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSpeakerActive(!speakerActive)}
              className={`w-14 h-7 rounded-full transition-all relative ${
                speakerActive ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${
                speakerActive ? 'left-7' : 'left-0.5'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 mt-5">
        <h2 className="text-sm font-extrabold text-blue-950 mb-3">Aksi Cepat</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Semua Laporan', path: '/incidents', color: 'bg-blue-50 border-blue-100',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
            { label: 'Monitor CCTV', path: '/cctv', color: 'bg-indigo-50 border-indigo-100',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6 text-indigo-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
            { label: 'Peta Komplek', path: '/map', color: 'bg-green-50 border-green-100',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6 text-green-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> },
            { label: 'Kontak Darurat', path: '/satpam-contact', color: 'bg-orange-50 border-orange-100',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6 text-orange-600"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className={`${a.color} border rounded-2xl p-4 flex items-center gap-3 press-effect hover:shadow-md transition-all`}
            >
              {a.icon}
              <span className="text-sm font-bold text-blue-950 text-left leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent incidents */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-blue-950">Laporan Masuk</h2>
          <button onClick={() => navigate('/incidents')} className="text-xs text-blue-500 font-semibold">Semua</button>
        </div>
        <div className="space-y-2">
          {incidents.slice(0, 4).map((inc) => {
            const sc = statusConfig[inc.status]
            return (
              <div key={inc.id} className={`bg-white border rounded-2xl p-4 ${
                inc.status === 'aktif' ? 'border-red-200' : 'border-blue-100'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    inc.status === 'aktif' ? 'bg-red-100' : inc.status === 'ditangani' ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-5 h-5 ${inc.status === 'aktif' ? 'text-red-500' : inc.status === 'ditangani' ? 'text-yellow-600' : 'text-green-600'}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-blue-950 truncate">{inc.reporterAddress}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${sc.bg} ${sc.text}`}>
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{inc.description}</p>
                    <p className="text-xs text-blue-400 mt-1">{formatRelative(inc.timestamp)}</p>
                  </div>
                </div>
                {inc.status === 'aktif' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigate('/map')}
                      className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl press-effect"
                    >
                      Navigasi
                    </button>
                    <button className="flex-1 py-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl press-effect">
                      Tangani
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats summary */}
      <div className="px-4 mt-6 mb-4">
        <div className="bg-gradient-to-br from-blue-800 to-blue-600 rounded-3xl p-5">
          <p className="text-blue-200 text-xs font-semibold mb-3">Statistik Hari Ini</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: incidents.filter((i) => i.status === 'selesai').length, label: 'Selesai Ditangani' },
              { val: complexStats.activeCCTV, label: 'CCTV Aktif' },
              { val: onlineOfficers, label: 'Petugas Bertugas' },
              { val: `${complexStats.satisfactionRate}%`, label: 'Warga Puas' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white text-xl font-extrabold">{s.val}</p>
                <p className="text-blue-200/70 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
