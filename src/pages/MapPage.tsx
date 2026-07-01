import { useState } from 'react'
import { useApp } from '../context/AppContext'
import TopBar from '../components/TopBar'
import { mockOfficers } from '../data/mockData'

// Mock map positions for incidents and officers
const INCIDENTS_POSITIONS = [
  { id: 'inc1', x: 45, y: 30, label: 'Jl. Subroto No. 14', type: 'selesai' },
  { id: 'inc3', x: 30, y: 55, label: 'Jl. Mawar No. 3', type: 'ditangani' },
  { id: 'inc4', x: 65, y: 45, label: 'Jl. Anggrek No. 11', type: 'aktif' },
]

const OFFICER_POSITIONS = [
  { id: 'off1', x: 20, y: 80, name: 'Agus W.' },
  { id: 'off2', x: 70, y: 20, name: 'Dedi K.' },
]

const CCTV_POSITIONS = [
  { id: 'cam1', x: 15, y: 15, name: 'Gerbang Utama' },
  { id: 'cam2', x: 35, y: 65, name: 'Parkir A' },
  { id: 'cam3', x: 55, y: 30, name: 'Blok B' },
  { id: 'cam4', x: 75, y: 60, name: 'Taman' },
]

type MapLayer = 'kejadian' | 'satpam' | 'cctv'

export default function MapPage() {
  const { incidents } = useApp()
  const [layers, setLayers] = useState<MapLayer[]>(['kejadian', 'satpam', 'cctv'])
  const [selected, setSelected] = useState<string | null>(null)

  const toggleLayer = (l: MapLayer) => {
    setLayers((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    )
  }

  const activeIncident = incidents.find((i) => i.status === 'aktif')

  return (
    <div className="pb-24">
      <TopBar title="Peta Komplek" />

      {/* Active alert banner */}
      {activeIncident && (
        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-red-700">Kejadian Aktif</p>
            <p className="text-xs text-red-500 truncate">{activeIncident.location.label}</p>
          </div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping-slow" />
        </div>
      )}

      {/* Layer toggles */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none">
        {([
          { key: 'kejadian', label: 'Kejadian' },
          { key: 'satpam', label: 'Satpam' },
          { key: 'cctv', label: 'CCTV' },
        ] as { key: MapLayer; label: string }[]).map((l) => (
          <button
            key={l.key}
            onClick={() => toggleLayer(l.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border-2 transition-all ${
              layers.includes(l.key)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-400'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Map canvas */}
      <div className="mx-4 rounded-3xl overflow-hidden border-2 border-blue-200 shadow-lg" style={{ height: '380px' }}>
        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 relative">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          {/* Roads */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Main road horizontal */}
            <rect x="0" y="47%" width="100%" height="6%" fill="#e2e8f0" rx="2" />
            {/* Main road vertical */}
            <rect x="47%" y="0" width="6%" height="100%" fill="#e2e8f0" rx="2" />
            {/* Secondary road */}
            <rect x="0" y="72%" width="100%" height="4%" fill="#e2e8f0" opacity="0.6" />
            <rect x="72%" y="0" width="4%" height="100%" fill="#e2e8f0" opacity="0.6" />
            {/* Road labels */}
            <text x="5%" y="46%" fill="#94a3b8" fontSize="8" fontFamily="system-ui">Jl. Subroto</text>
            <text x="5%" y="71%" fill="#94a3b8" fontSize="8" fontFamily="system-ui">Jl. Anggrek</text>
          </svg>

          {/* Building blocks */}
          {[
            { x: 5, y: 5, w: 38, h: 38, label: 'Blok A' },
            { x: 55, y: 5, w: 38, h: 38, label: 'Blok B' },
            { x: 5, y: 55, w: 38, h: 38, label: 'Blok C' },
            { x: 55, y: 55, w: 15, h: 15, label: 'Taman' },
            { x: 78, y: 55, w: 15, h: 38, label: 'Blok D' },
          ].map((b) => (
            <div
              key={b.label}
              className="absolute bg-blue-200/50 border border-blue-300/50 rounded-xl flex items-center justify-center"
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
            >
              <span className="text-blue-600/60 text-[10px] font-bold">{b.label}</span>
            </div>
          ))}

          {/* Incident markers */}
          {layers.includes('kejadian') && INCIDENTS_POSITIONS.map((pos) => (
            <button
              key={pos.id}
              onClick={() => setSelected(selected === pos.id ? null : pos.id)}
              className="absolute transform -translate-x-1/2 -translate-y-full"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className={`relative flex flex-col items-center`}>
                <div className={`w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                  pos.type === 'aktif' ? 'bg-red-500 animate-ping-slow' :
                  pos.type === 'ditangani' ? 'bg-yellow-400' : 'bg-green-500'
                }`}>
                  <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M6 18h12" /></svg>
                </div>
                {selected === pos.id && (
                  <div className="absolute bottom-full mb-1 bg-white rounded-xl shadow-xl px-3 py-2 w-40 text-left z-10 animate-fade-in">
                    <p className="text-xs font-bold text-blue-950 truncate">{pos.label}</p>
                    <p className={`text-xs font-semibold ${
                      pos.type === 'aktif' ? 'text-red-500' : pos.type === 'ditangani' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {pos.type === 'aktif' ? 'Aktif' : pos.type === 'ditangani' ? 'Ditangani' : 'Selesai'}
                    </p>
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Officer markers */}
          {layers.includes('satpam') && OFFICER_POSITIONS.map((pos) => (
            <button
              key={pos.id}
              onClick={() => setSelected(selected === pos.id ? null : pos.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className="relative flex flex-col items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                </div>
                {selected === pos.id && (
                  <div className="absolute bottom-full mb-1 bg-white rounded-xl shadow-xl px-3 py-2 min-w-max text-left z-10 animate-fade-in">
                    <p className="text-xs font-bold text-blue-950">{pos.name}</p>
                    <p className="text-xs text-green-600 font-semibold">Bertugas</p>
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* CCTV markers */}
          {layers.includes('cctv') && CCTV_POSITIONS.map((pos) => (
            <button
              key={pos.id}
              onClick={() => setSelected(selected === pos.id ? null : pos.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className="relative">
                <div className="w-7 h-7 bg-blue-600 rounded-xl border-2 border-white shadow flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                {selected === pos.id && (
                  <div className="absolute bottom-full mb-1 bg-white rounded-xl shadow-xl px-3 py-2 min-w-max text-left z-10 animate-fade-in">
                    <p className="text-xs font-bold text-blue-950">{pos.name}</p>
                    <p className="text-xs text-blue-500">Online · AI Aktif</p>
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Compass */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow text-xs font-bold text-blue-700">
            N
          </div>

          {/* Scale */}
          <div className="absolute bottom-3 right-3 bg-white/80 rounded-lg px-2 py-1">
            <p className="text-[9px] text-gray-500 font-semibold">≈ 500m</p>
          </div>
        </div>
      </div>

      {/* Officer list */}
      <div className="px-4 mt-5">
        <h2 className="text-sm font-extrabold text-blue-950 mb-3">Satpam Bertugas</h2>
        <div className="space-y-2">
          {mockOfficers.map((off) => (
            <div key={off.id} className="bg-white border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                off.status === 'bertugas' ? 'bg-green-500' : off.status === 'istirahat' ? 'bg-yellow-400' : 'bg-gray-400'
              }`}>
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-blue-950">{off.name}</p>
                <p className="text-xs text-gray-500 truncate">{off.location}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  off.status === 'bertugas' ? 'bg-green-100 text-green-700' :
                  off.status === 'istirahat' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {off.status === 'bertugas' ? 'Bertugas' : off.status === 'istirahat' ? 'Istirahat' : 'Offline'}
                </span>
                <a href={`tel:${off.phone}`} className="text-xs text-blue-500 font-semibold">Hubungi</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
