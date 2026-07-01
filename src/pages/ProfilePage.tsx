import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import TopBar from '../components/TopBar'

const roleLabel: Record<string, string> = {
  warga: 'Warga',
  satpam: 'Satpam',
}

const roleColor: Record<string, string> = {
  warga: 'bg-blue-100 text-blue-700',
  satpam: 'bg-green-100 text-green-700',
}

export default function ProfilePage() {
  const { currentUser, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!currentUser) return null

  const menuItems = [
    {
      section: 'Akun',
      items: [
        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, label: 'Edit Profil', desc: 'Ubah nama, foto, dan kontak' },
        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>, label: 'Ubah PIN', desc: 'Ganti PIN keamanan Anda' },
        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, label: 'Data Unit', desc: `Unit ${currentUser.unitNo} · ${currentUser.complex}` },
      ],
    },
    {
      section: 'Keamanan',
      items: [
        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>, label: 'Pengaturan Notifikasi', desc: 'Atur jenis notifikasi yang diterima' },
        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, label: 'Riwayat Laporan Saya', desc: 'Lihat semua laporan yang pernah dikirim', action: () => navigate('/incidents') },
        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, label: 'Kontak Satpam', desc: 'Hubungi petugas keamanan', action: () => navigate('/satpam-contact') },
      ],
    },
    {
      section: 'Aplikasi',
      items: [
        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>, label: 'Bantuan & FAQ', desc: 'Panduan penggunaan aplikasi' },
        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>, label: 'Beri Rating', desc: 'Nilai pengalaman Anda' },
        { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Tentang Si Aman', desc: 'Versi 2.1.0 · si-aman.id' },
      ],
    },
  ]

  return (
    <div className="pb-24">
      <TopBar title="Profil Saya" />

      {/* Profile header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-600 px-5 pt-4 pb-10 relative overflow-hidden">
        <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-white/10 rounded-full" />
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl border-2 border-white/30">
            {currentUser.avatar}
          </div>
          <div>
            <h2 className="text-white text-xl font-extrabold">{currentUser.name}</h2>
            <p className="text-blue-200/80 text-sm">{currentUser.phone}</p>
            <div className="mt-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${roleColor[currentUser.role]}`}>
                {roleLabel[currentUser.role]}
              </span>
            </div>
          </div>
        </div>

        {/* Unit info */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-white/15 rounded-2xl px-4 py-3 backdrop-blur-sm">
            <p className="text-blue-200/70 text-xs">Unit</p>
            <p className="text-white font-bold text-sm">{currentUser.unitNo}</p>
          </div>
          <div className="bg-white/15 rounded-2xl px-4 py-3 backdrop-blur-sm">
            <p className="text-blue-200/70 text-xs">Komplek</p>
            <p className="text-white font-bold text-sm truncate">{currentUser.complex.split(' ').slice(-2).join(' ')}</p>
          </div>
        </div>
      </div>

      {/* Offset card */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-3xl shadow-lg shadow-blue-100/40 border border-blue-50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Alamat</p>
              <p className="text-sm font-bold text-blue-950">{currentUser.address}</p>
            </div>
          </div>
          <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full">Terverifikasi</span>
        </div>
      </div>

      {/* Menu sections */}
      <div className="px-4 mt-5 space-y-5">
        {menuItems.map((section) => (
          <div key={section.section}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">{section.section}</p>
            <div className="bg-white rounded-2xl border border-blue-50 overflow-hidden">
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-blue-50/50 transition-colors press-effect ${
                    i > 0 ? 'border-t border-blue-50' : ''
                  }`}
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-blue-950">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-4 h-4 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-red-50 border border-red-200 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all press-effect"
        >
          Keluar dari Akun
        </button>

        <p className="text-center text-xs text-gray-400 pb-2">
          Si Aman v2.1.0 · © 2026 · Semarang
        </p>
      </div>
    </div>
  )
}
