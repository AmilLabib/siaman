import { useState } from 'react'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import type { IncidentType } from '../types'

const crimeTypes: { type: IncidentType; label: string; desc: string }[] = [
  { type: 'maling', label: 'Pencurian / Maling', desc: 'Tindak pencurian, perampokan, atau percobaan pembobolan' },
  { type: 'kerusuhan', label: 'Kerusuhan / Perkelahian', desc: 'Perselisihan, perkelahian, atau ancaman kekerasan' },
  { type: 'kebakaran', label: 'Kebakaran', desc: 'Kebakaran properti atau potensi bahaya api' },
  { type: 'mencurigakan', label: 'Orang Mencurigakan', desc: 'Pergerakan mencurigakan, tidak dikenal, atau mengancam' },
  { type: 'lainnya', label: 'Lainnya', desc: 'Kejadian lain yang membutuhkan perhatian kepolisian' },
]

type Step = 'form' | 'confirm' | 'sending' | 'sent'

export default function LaporPolisiPage() {
  const { currentUser, incidents, addIncident } = useApp()
  const [step, setStep] = useState<Step>('form')
  const [crimeType, setCrimeType] = useState<IncidentType>('maling')
  const [location, setLocation] = useState(currentUser?.address || '')
  const [description, setDescription] = useState('')
  const [suspectDesc, setSuspectDesc] = useState('')
  const [priority, setPriority] = useState<'rendah' | 'sedang' | 'tinggi'>('sedang')

  const activeIncidents = incidents.filter((i) => i.status === 'aktif')

  const handleSubmit = () => {
    setStep('confirm')
  }

  const handleConfirm = () => {
    setStep('sending')
    setTimeout(() => {
      addIncident({
        reportedBy: currentUser?.name || '',
        reporterAddress: location,
        type: crimeType,
        status: 'aktif',
        location: { lat: -6.9667, lng: 110.4167, label: location },
        description: `[LAPORAN SATPAM] ${description}${suspectDesc ? ` | Deskripsi tersangka: ${suspectDesc}` : ''}`,
        isEmergency: priority === 'tinggi',
      })
      setStep('sent')
    }, 2000)
  }

  const crimeInfo = crimeTypes.find((c) => c.type === crimeType)!

  return (
    <div className="pb-24">
      <TopBar title="Lapor ke Kepolisian" showBack />

      {/* Satpam badge */}
      <div className="mx-4 mt-3 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
        </div>
        <div>
          <p className="text-xs font-bold text-blue-700">Lapor ke Kepolisian</p>
          <p className="text-xs text-blue-500">Laporan langsung terhubung ke polsek terdekat</p>
        </div>
      </div>

      {/* Active incidents to reference */}
      {activeIncidents.length > 0 && (
        <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-xs font-bold text-red-700 mb-2">Kejadian Aktif yang Bisa Dilaporkan</p>
          {activeIncidents.map((inc) => (
            <button
              key={inc.id}
              onClick={() => {
                setLocation(inc.location.label)
                setDescription(inc.description)
              }}
              className="w-full text-left p-2 bg-white rounded-xl mb-1 last:mb-0 press-effect"
            >
              <p className="text-xs font-bold text-blue-950">{inc.reporterAddress}</p>
              <p className="text-xs text-gray-500 truncate">{inc.description}</p>
            </button>
          ))}
        </div>
      )}

      {step === 'form' && (
        <div className="px-4 mt-4 space-y-5">
          {/* Crime type */}
          <div>
            <label className="block text-xs font-bold text-blue-700 mb-2">Jenis Kejahatan *</label>
            <div className="space-y-2">
              {crimeTypes.map((c) => (
                <button
                  key={c.type}
                  onClick={() => setCrimeType(c.type)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${
                    crimeType === c.type ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-200'
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm text-blue-950">{c.label}</p>
                    <p className="text-xs text-gray-500">{c.desc}</p>
                  </div>
                  {crimeType === c.type && (
                    <div className="ml-auto w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-blue-700 mb-2">Lokasi Kejadian *</label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Jl. Subroto No. 14, Blok B..."
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-blue-700 mb-2">Kronologi Kejadian *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kronologi kejadian secara detail..."
              rows={3}
              className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Suspect description */}
          <div>
            <label className="block text-xs font-bold text-blue-700 mb-2">Deskripsi Tersangka (jika ada)</label>
            <textarea
              value={suspectDesc}
              onChange={(e) => setSuspectDesc(e.target.value)}
              placeholder="Ciri-ciri fisik, kendaraan, pakaian, dll..."
              rows={2}
              className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-blue-700 mb-2">Tingkat Prioritas</label>
            <div className="flex gap-2">
              {(['rendah', 'sedang', 'tinggi'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all capitalize ${
                    priority === p
                      ? p === 'tinggi' ? 'border-red-500 bg-red-50 text-red-600' :
                        p === 'sedang' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' :
                        'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                >
                  {p === 'tinggi' ? 'Tinggi' : p === 'sedang' ? 'Sedang' : 'Rendah'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!location || !description}
            className="w-full py-4 bg-blue-700 text-white font-extrabold rounded-2xl disabled:opacity-50 press-effect hover:bg-blue-800 transition-all shadow-lg"
          >
            Lanjut ke Konfirmasi →
          </button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="px-4 mt-4">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5 mb-5">
            <h3 className="font-extrabold text-orange-800 mb-4">Konfirmasi Laporan ke Polisi</h3>
            <div className="space-y-3">
              {[
                { label: 'Jenis', value: crimeInfo.label },
                { label: 'Lokasi', value: location },
                { label: 'Kronologi', value: description },
                { label: 'Prioritas', value: priority.charAt(0).toUpperCase() + priority.slice(1) },
                { label: 'Dilaporkan oleh', value: currentUser?.name + ' (Satpam)' },
              ].map((r) => (
                <div key={r.label} className="flex gap-3">
                  <span className="text-xs text-orange-600/60 font-semibold w-24 flex-shrink-0">{r.label}</span>
                  <span className="text-xs text-orange-800 font-semibold flex-1">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('form')} className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-2xl">
              ← Edit
            </button>
            <button onClick={handleConfirm} className="flex-1 py-3.5 bg-blue-700 text-white font-extrabold rounded-2xl press-effect">
              Kirim ke Polisi
            </button>
          </div>
        </div>
      )}

      {step === 'sending' && (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-ping-slow">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth={1.5} className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </div>
          <h3 className="text-xl font-extrabold text-blue-950 mb-2">Mengirim Laporan...</h3>
          <p className="text-blue-500 text-sm text-center">Menghubungi Polsek Semarang Tengah</p>
        </div>
      )}

      {step === 'sent' && (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5} className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-extrabold text-blue-950 mb-2">Laporan Terkirim!</h3>
          <p className="text-blue-500 text-sm text-center mb-2">
            Laporan berhasil dikirim ke Polsek Semarang Tengah.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3 mt-2 text-center">
            <p className="text-xs text-blue-600 font-semibold">No. Referensi</p>
            <p className="text-blue-900 font-extrabold text-lg">#RPT-{Date.now().toString().slice(-6)}</p>
          </div>
          <p className="text-gray-400 text-xs mt-4 text-center">Polisi akan merespons dalam ~15 menit</p>

          <button
            onClick={() => setStep('form')}
            className="mt-6 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-2xl press-effect"
          >
            Buat Laporan Baru
          </button>
        </div>
      )}
    </div>
  )
}
