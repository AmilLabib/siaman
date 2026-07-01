import { useState } from 'react'
import { mockCCTV } from '../data/mockData'
import TopBar from '../components/TopBar'
import type { CCTVCamera } from '../types'

const cameraColors: Record<string, string> = {
  gate: 'from-blue-900 to-blue-700',
  'parking-a': 'from-slate-800 to-slate-600',
  'street-b': 'from-blue-800 to-indigo-700',
  garden: 'from-emerald-800 to-teal-700',
  'gate-back': 'from-gray-700 to-gray-600',
  'parking-c': 'from-slate-700 to-blue-800',
}

function CameraFeed({ cam }: { cam: CCTVCamera }) {
  return (
    <div className={`relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br ${cameraColors[cam.thumbnail] || 'from-gray-800 to-gray-600'}`}>
      {/* Simulated camera feed */}
      <div className="absolute inset-0 flex flex-col justify-between p-2">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${cam.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-white text-[10px] font-semibold bg-black/40 px-1.5 py-0.5 rounded-full">
              {cam.status === 'online' ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
          {cam.isAIEnabled && (
            <span className="text-[9px] font-bold text-yellow-300 bg-black/40 px-1.5 py-0.5 rounded-full">
              🤖 AI
            </span>
          )}
        </div>

        {/* Scan lines effect */}
        {cam.status === 'online' && (
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }} />
        )}

        {/* Center content */}
        {cam.status === 'offline' ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 opacity-40 mx-auto">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-white/40 text-[10px] font-semibold mt-1">Tidak Tersambung</p>
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Bottom info */}
        <div className="bg-black/50 rounded-lg px-2 py-1">
          <p className="text-white text-[10px] font-bold truncate">{cam.name}</p>
          <p className="text-white/60 text-[9px]">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        </div>
      </div>
    </div>
  )
}

export default function CCTVPage() {
  const [fullscreen, setFullscreen] = useState<CCTVCamera | null>(null)
  const [filter, setFilter] = useState<'semua' | 'online' | 'ai'>('semua')

  const filtered = mockCCTV.filter((c) => {
    if (filter === 'online') return c.status === 'online'
    if (filter === 'ai') return c.isAIEnabled
    return true
  })

  const onlineCount = mockCCTV.filter((c) => c.status === 'online').length

  return (
    <div className="pb-24">
      <TopBar
        title="Pantau CCTV"
        rightElement={
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping-slow" />
            <span className="text-green-700 text-xs font-bold">{onlineCount} Online</span>
          </div>
        }
      />

      {/* Filter */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none">
        {(['semua', 'online', 'ai'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {f === 'semua' ? 'Semua' : f === 'online' ? '🟢 Online' : '🤖 AI Enabled'}
          </button>
        ))}
      </div>

      {/* Camera grid */}
      <div className="px-4 space-y-4">
        {/* Featured — first camera large */}
        {filtered[0] && (
          <div>
            <button
              className="w-full"
              onClick={() => setFullscreen(filtered[0])}
            >
              <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${cameraColors[filtered[0].thumbnail] || 'from-gray-800 to-gray-600'}`} style={{ aspectRatio: '16/9' }}>
                <div className="absolute inset-0 flex flex-col justify-between p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${filtered[0].status === 'online' ? 'bg-green-400 animate-ping-slow' : 'bg-red-400'}`} />
                      <span className="text-white text-xs font-bold bg-black/40 px-2 py-0.5 rounded-full">
                        {filtered[0].status === 'online' ? '● LIVE' : 'OFFLINE'}
                      </span>
                    </div>
                    {filtered[0].isAIEnabled && (
                      <span className="text-xs font-bold text-yellow-300 bg-black/40 px-2 py-0.5 rounded-full">🤖 AI Active</span>
                    )}
                  </div>
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 6px)',
                  }} />
                  <div className="bg-black/50 rounded-xl px-3 py-2">
                    <p className="text-white text-sm font-bold">{filtered[0].name}</p>
                    <p className="text-white/60 text-xs">{filtered[0].location} · Tekan untuk perbesar</p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Smaller grid */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.slice(1).map((cam) => (
            <button key={cam.id} onClick={() => setFullscreen(cam)} className="text-left">
              <CameraFeed cam={cam} />
              <p className="text-xs font-bold text-blue-950 mt-1.5 truncate">{cam.name}</p>
              <p className="text-xs text-gray-400 truncate">{cam.location}</p>
            </button>
          ))}
        </div>
      </div>

      {/* AI Detection log */}
      <div className="px-4 mt-6 mb-2">
        <h2 className="text-sm font-extrabold text-blue-950 mb-3">🤖 Log Deteksi AI</h2>
        <div className="space-y-2">
          {[
            { cam: 'Gerbang Utama', event: 'Orang berjalan normal — tidak mencurigakan', time: '08:42', type: 'ok' },
            { cam: 'Parkir Blok A', event: 'Pergerakan kendaraan terdeteksi', time: '07:15', type: 'ok' },
            { cam: 'Taman Tengah', event: '⚠️ Pergerakan di luar jam normal terdeteksi', time: '02:14', type: 'warn' },
          ].map((log, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${
              log.type === 'warn' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100'
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${
                log.type === 'warn' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                {log.type === 'warn' ? '⚠️' : '✅'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-blue-950">{log.cam}</p>
                <p className="text-xs text-gray-500 mt-0.5">{log.event}</p>
              </div>
              <p className="text-xs text-gray-400 flex-shrink-0">{log.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen modal */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-black/80">
            <div>
              <p className="text-white font-bold text-sm">{fullscreen.name}</p>
              <p className="text-gray-400 text-xs">{fullscreen.location}</p>
            </div>
            <button onClick={() => setFullscreen(null)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className={`flex-1 bg-gradient-to-br ${cameraColors[fullscreen.thumbnail]} flex items-center justify-center relative`}>
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 6px)',
            }} />
            <div className="relative z-10 text-center">
              {fullscreen.status === 'online' ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping-slow" />
                    <span className="text-white font-bold text-sm">LIVE</span>
                    {fullscreen.isAIEnabled && <span className="text-yellow-300 text-sm font-bold">· 🤖 AI</span>}
                  </div>
                  <p className="text-white/50 text-xs">Siaran langsung</p>
                </>
              ) : (
                <p className="text-white/40 text-lg font-bold">OFFLINE</p>
              )}
            </div>
            <div className="absolute bottom-6 left-0 right-0 px-4">
              <div className="bg-black/60 rounded-xl px-4 py-2.5">
                <p className="text-white text-xs">{new Date().toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
