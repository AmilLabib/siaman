import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import TopBar from '../components/TopBar'

const roleLabel: Record<string, string> = {
  warga: 'Warga',
  satpam: 'Satpam',
  pkd: 'Pos Keamanan Desa',
}

const roleColor: Record<string, string> = {
  warga: 'bg-blue-100 text-blue-700',
  satpam: 'bg-green-100 text-green-700',
  pkd: 'bg-orange-100 text-orange-700',
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
        { icon: '👤', label: 'Edit Profil', desc: 'Ubah nama, foto, dan kontak' },
        { icon: '🔑', label: 'Ubah PIN', desc: 'Ganti PIN keamanan Anda' },
        { icon: '🏠', label: 'Data Unit', desc: `Unit ${currentUser.unitNo} · ${currentUser.complex}` },
      ],
    },
    {
      section: 'Keamanan',
      items: [
        { icon: '🔔', label: 'Pengaturan Notifikasi', desc: 'Atur jenis notifikasi yang diterima' },
        { icon: '📋', label: 'Riwayat Laporan Saya', desc: 'Lihat semua laporan yang pernah dikirim', action: () => navigate('/incidents') },
        { icon: '🛡️', label: 'Kontak Satpam', desc: 'Hubungi petugas keamanan', action: () => navigate('/satpam-contact') },
      ],
    },
    {
      section: 'Aplikasi',
      items: [
        { icon: '💬', label: 'Bantuan & FAQ', desc: 'Panduan penggunaan aplikasi' },
        { icon: '⭐', label: 'Beri Rating', desc: 'Nilai pengalaman Anda' },
        { icon: 'ℹ️', label: 'Tentang Si Aman', desc: 'Versi 2.1.0 · si-aman.id' },
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
              <span className="text-xl">🏡</span>
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
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
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
