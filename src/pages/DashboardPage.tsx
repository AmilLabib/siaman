import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { mockOfficers, complexStats } from '../data/mockData'
import type { IncidentType } from '../types'

type SOSStep = 'idle' | 'confirm' | 'pin' | 'sending' | 'sent'

export default function DashboardPage() {
  const { currentUser, unreadCount, incidents, addIncident, speakerActive, emergencyActive, setEmergencyActive, setSpeakerActive } = useApp()
  const navigate = useNavigate()
  const [sosStep, setSosStep] = useState<SOSStep>('idle')
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [selectedType, setSelectedType] = useState<IncidentType>('maling')
  const [description, setDescription] = useState('')

  const activeIncidents = incidents.filter((i) => i.status === 'aktif')
  const ondutyOfficer = mockOfficers.find((o) => o.status === 'bertugas')

  const handleSOS = () => setSosStep('confirm')

  const handleConfirm = () => { setSosStep('pin'); setPin(''); setPinError('') }

  const handlePinDigit = (d: string) => {
    if (pin.length < 4) setPin((p) => p + d)
  }

  const handlePinDelete = () => setPin((p) => p.slice(0, -1))

  const handleSend = () => {
    if (pin !== currentUser?.pin) { setPinError('PIN salah'); setPin(''); return }
    setSosStep('sending')
    setTimeout(() => {
      addIncident({
        reportedBy: currentUser?.name || '',
        reporterAddress: currentUser?.address || '',
        type: selectedType,
        status: 'aktif',
        location: { lat: -6.9667, lng: 110.4167, label: currentUser?.address || '' },
        description: description || `Sinyal darurat dari ${currentUser?.address}`,
        isEmergency: true,
      })
      setSosStep('sent')
      setTimeout(() => setSosStep('idle'), 3000)
    }, 1500)
  }

  const cancelSOS = () => { setSosStep('idle'); setPin(''); setPinError(''); setDescription('') }

  const typeLabels: Record<IncidentType, string> = {
    maling: '🦹 Maling',
    kerusuhan: '⚠️ Kerusuhan',
    kebakaran: '🔥 Kebakaran',
    mencurigakan: '👁️ Mencurigakan',
    lainnya: '📋 Lainnya',
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 10) return 'Selamat Pagi'
    if (h < 15) return 'Selamat Siang'
    if (h < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-600 px-5 pt-14 pb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 430 30" fill="white"><path d="M0 30H430V15C360 0 280 30 215 15C150 0 70 30 0 15V30Z"/></svg>
        </div>
        <div className="relative z-10 flex items-start justify-between mb-6">
          <div>
            <p className="text-blue-200 text-sm font-medium">{greeting()},</p>
            <h1 className="text-white text-2xl font-extrabold leading-tight">{currentUser?.name?.split(' ')[0]} 👋</h1>
            <p className="text-blue-200/70 text-xs mt-0.5">{currentUser?.complex} · {currentUser?.unitNo}</p>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
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

        {/* Status strip */}
        <div className="relative z-10 flex gap-3">
          <div className="flex-1 bg-white/15 rounded-2xl px-4 py-3 backdrop-blur-sm border border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping-slow" />
              <span className="text-white text-xs font-semibold">Aman</span>
            </div>
            <p className="text-white/70 text-xs mt-0.5">Status Komplek</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-2xl px-4 py-3 backdrop-blur-sm border border-white/20">
            <p className="text-white text-sm font-bold">{ondutyOfficer?.name.split(' ')[0] || 'N/A'}</p>
            <p className="text-white/70 text-xs mt-0.5">Satpam Bertugas</p>
          </div>
          {speakerActive && (
            <div className="flex-1 bg-red-500/80 rounded-2xl px-3 py-3 border border-red-400/50">
              <p className="text-white text-xs font-bold">📢 Speaker</p>
              <p className="text-white/80 text-xs mt-0.5">Aktif</p>
            </div>
          )}
        </div>
      </div>

      {/* Active incident banner */}
      {activeIncidents.length > 0 && (
        <div className="mx-4 mt-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">!</span>
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-red-700 text-sm">⚠️ Kejadian Aktif di Komplek</p>
              <p className="text-red-600/80 text-xs mt-0.5 leading-relaxed">
                {activeIncidents[0].reporterAddress} — {activeIncidents[0].description}
              </p>
              <button
                onClick={() => navigate('/incidents')}
                className="mt-2 text-xs text-red-600 font-bold underline"
              >
                Lihat Detail →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS Button */}
      <div className="flex flex-col items-center mt-8 px-5">
        <p className="text-blue-600/60 text-xs font-semibold mb-5 uppercase tracking-widest">Tombol Darurat</p>
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-52 h-52 bg-blue-100 rounded-full sos-ring" />
          <div className="absolute w-44 h-44 bg-blue-200/60 rounded-full sos-ring" style={{ animationDelay: '0.5s' }} />
          <button
            onClick={handleSOS}
            className="relative z-10 w-40 h-40 bg-gradient-to-br from-blue-700 to-blue-500 rounded-full shadow-2xl shadow-blue-400/50 flex flex-col items-center justify-center gap-2 border-4 border-white press-effect hover:from-blue-600 hover:to-blue-400 transition-all"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-white font-extrabold text-sm leading-none">LAPOR</span>
            <span className="text-white font-extrabold text-xs leading-none text-center px-2">KEJADIAN</span>
          </button>
        </div>
        <p className="text-blue-700/50 text-xs text-center max-w-xs leading-relaxed">
          Tekan tombol untuk mengirim sinyal darurat ke seluruh warga, satpam, dan mengaktifkan speaker komplek
        </p>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-8">
        <h2 className="text-sm font-extrabold text-blue-950 mb-3">Aksi Cepat</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📹', label: 'Pantau CCTV', path: '/cctv', color: 'bg-blue-50 border-blue-100' },
            { icon: '🛡️', label: 'Hubungi Satpam', path: '/satpam-contact', color: 'bg-green-50 border-green-100' },
            { icon: '📋', label: 'Riwayat Laporan', path: '/incidents', color: 'bg-orange-50 border-orange-100' },
            { icon: '🗺️', label: 'Peta Komplek', path: '/map', color: 'bg-indigo-50 border-indigo-100' },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className={`${a.color} border rounded-2xl p-4 flex items-center gap-3 press-effect hover:shadow-md transition-all`}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-sm font-bold text-blue-950 text-left leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-blue-950">Aktivitas Terbaru</h2>
          <button onClick={() => navigate('/incidents')} className="text-xs text-blue-500 font-semibold">Lihat semua</button>
        </div>
        <div className="space-y-3">
          {incidents.slice(0, 3).map((inc) => (
            <div key={inc.id} className="bg-white border border-blue-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                  inc.status === 'aktif' ? 'bg-red-100' : inc.status === 'ditangani' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  {inc.type === 'maling' ? '🦹' : inc.type === 'kebakaran' ? '🔥' : inc.type === 'kerusuhan' ? '⚠️' : '👁️'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-blue-950 truncate">{inc.reporterAddress}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                      inc.status === 'aktif' ? 'bg-red-100 text-red-600' :
                      inc.status === 'ditangani' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {inc.status === 'aktif' ? 'Aktif' : inc.status === 'ditangani' ? 'Ditangani' : 'Selesai'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{inc.description}</p>
                  <p className="text-xs text-blue-400 mt-1">{formatRelative(inc.timestamp)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mt-8 mb-4">
        <div className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-3xl p-5">
          <p className="text-blue-200 text-xs font-semibold mb-3">Statistik Komplek</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: complexStats.totalUnits, label: 'Total Unit' },
              { val: complexStats.activeResidents, label: 'Warga Aktif' },
              { val: complexStats.incidentsPrevented, label: 'Kejahatan Dicegah' },
              { val: `${complexStats.satisfactionRate}%`, label: 'Kepuasan Warga' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white text-xl font-extrabold">{s.val}</p>
                <p className="text-blue-200/70 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency speaker toggle */}
      {emergencyActive && (
        <div className="px-5 mb-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-red-700 text-sm">🔊 Speaker Komplek</p>
                <p className="text-xs text-red-500">{speakerActive ? 'Sedang aktif — pengumuman darurat' : 'Nonaktif'}</p>
              </div>
              <button
                onClick={() => { setSpeakerActive(!speakerActive); if (speakerActive) setEmergencyActive(false) }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  speakerActive ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {speakerActive ? 'Matikan' : 'Aktifkan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS Modal */}
      {sosStep !== 'idle' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end" onClick={(e) => e.target === e.currentTarget && cancelSOS()}>
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-6 animate-slide-in-up">
            {sosStep === 'confirm' && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="#ef4444" className="w-8 h-8">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-center text-blue-950 mb-2">Kirim Sinyal Darurat?</h3>
                <p className="text-center text-blue-700/60 text-sm mb-5">
                  Seluruh warga dan satpam akan diberitahu. Speaker komplek akan aktif otomatis.
                </p>

                {/* Type selector */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-blue-600 mb-2">Jenis Kejadian</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(typeLabels) as IncidentType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedType(t)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border-2 transition-all ${
                          selectedType === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 bg-gray-50 text-gray-600'
                        }`}
                      >
                        {typeLabels[t]}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Deskripsi singkat kejadian (opsional)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-5"
                />

                <div className="flex gap-3">
                  <button onClick={cancelSOS} className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200">
                    Batal
                  </button>
                  <button onClick={handleConfirm} className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 press-effect">
                    Ya, Kirim Darurat →
                  </button>
                </div>
              </>
            )}

            {sosStep === 'pin' && (
              <>
                <h3 className="text-xl font-extrabold text-center text-blue-950 mb-1">Verifikasi PIN</h3>
                <p className="text-center text-blue-700/60 text-sm mb-5">Masukkan PIN 4 digit Anda</p>
                <div className="flex gap-3 justify-center mb-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center ${
                      i < pin.length ? 'border-blue-500 bg-blue-50' : 'border-blue-200 bg-gray-50'
                    }`}>
                      {i < pin.length && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                    </div>
                  ))}
                </div>
                {pinError && <p className="text-red-500 text-xs text-center font-semibold mb-3">{pinError}</p>}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
                    <button key={i}
                      onClick={() => d === '⌫' ? handlePinDelete() : d !== '' ? handlePinDigit(d) : undefined}
                      disabled={d === ''}
                      className={`h-12 rounded-xl font-bold text-lg press-effect ${
                        d === '' ? 'invisible' : d === '⌫' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-blue-950 hover:bg-blue-50'
                      }`}
                    >{d}</button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={cancelSOS} className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-xl">Batal</button>
                  <button
                    onClick={handleSend}
                    disabled={pin.length < 4}
                    className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-xl disabled:opacity-50 press-effect"
                  >
                    Kirim →
                  </button>
                </div>
              </>
            )}

            {sosStep === 'sending' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-ping-slow">
                  <svg viewBox="0 0 24 24" fill="#ef4444" className="w-10 h-10">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-blue-950 mb-2">Mengirim Sinyal...</h3>
                <p className="text-blue-700/60 text-sm">Memberitahu seluruh warga & satpam</p>
              </div>
            )}

            {sosStep === 'sent' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5} className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-blue-950 mb-2">Sinyal Terkirim!</h3>
                <p className="text-blue-700/60 text-sm">Warga dan satpam telah diberitahu. Speaker aktif.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

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
