import TopBar from '../components/TopBar'
import { mockOfficers } from '../data/mockData'

export default function SatpamContactPage() {
  return (
    <div className="pb-24">
      <TopBar title="Hubungi Satpam" showBack />

      {/* Emergency call CTA */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-blue-700 to-blue-500 rounded-3xl p-5">
        <p className="text-blue-200 text-xs font-semibold mb-1">Darurat?</p>
        <h2 className="text-white text-xl font-extrabold mb-3">Hubungi Pos Keamanan</h2>
        <a
          href="tel:+628139876543"
          className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 press-effect hover:bg-blue-50 transition-all"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="#2563eb" className="w-5 h-5">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </div>
          <div>
            <p className="font-extrabold text-blue-700 text-sm">Telepon Pos Utama</p>
            <p className="text-blue-500 text-xs">+62 813-9876-5432</p>
          </div>
          <div className="ml-auto">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth={2.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>

      {/* Officers list */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-extrabold text-blue-950 mb-3">Petugas Saat Ini</h2>
        <div className="space-y-3">
          {mockOfficers.map((off) => (
            <div key={off.id} className="bg-white border border-blue-100 rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 ${
                  off.status === 'bertugas' ? 'bg-green-500' : off.status === 'istirahat' ? 'bg-yellow-400' : 'bg-gray-400'
                }`}>
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-blue-950">{off.name}</p>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      off.status === 'bertugas' ? 'bg-green-100 text-green-700' :
                      off.status === 'istirahat' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {off.status === 'bertugas' ? '● Bertugas' : off.status === 'istirahat' ? 'Istirahat' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{off.location}</p>
                  <p className="text-xs text-blue-400 mt-0.5">{off.shift}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:${off.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm font-bold text-blue-700 hover:bg-blue-100 transition-all press-effect"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  Telepon
                </a>
                <a
                  href={`https://wa.me/${off.phone.replace(/[^0-9]/g, '')}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 border border-green-200 rounded-xl text-sm font-bold text-green-700 hover:bg-green-100 transition-all press-effect"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Police number */}
      <div className="px-4 mt-6 mb-2">
        <h2 className="text-sm font-extrabold text-blue-950 mb-3">Kontak Darurat</h2>
        <div className="space-y-2">
          {[
            { label: 'Kepolisian (110)', number: '110', color: 'bg-blue-50 border-blue-200 text-blue-700',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
            { label: 'Pemadam Kebakaran (113)', number: '113', color: 'bg-orange-50 border-orange-200 text-orange-700',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg> },
            { label: 'Ambulans (118)', number: '118', color: 'bg-red-50 border-red-200 text-red-700',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
            { label: 'SAR / Basarnas (115)', number: '115', color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg> },
          ].map((c) => (
            <a
              key={c.label}
              href={`tel:${c.number}`}
              className={`flex items-center gap-3 ${c.color} border rounded-2xl p-3.5 press-effect hover:opacity-80 transition-all`}
            >
              {c.icon}
              <div className="flex-1">
                <p className="font-bold text-sm">{c.label}</p>
              </div>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 opacity-60">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
