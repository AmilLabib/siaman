import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { mockUsers } from '../data/mockData'

export default function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [selectedUser, setSelectedUser] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin((p) => p + digit)
      setError('')
    }
  }

  const handleDelete = () => setPin((p) => p.slice(0, -1))

  const handleLogin = () => {
    if (!selectedUser) { setError('Pilih akun terlebih dahulu'); return }
    if (pin.length < 4) { setError('Masukkan PIN 4 digit'); return }
    setLoading(true)
    setTimeout(() => {
      const ok = login(selectedUser, pin)
      setLoading(false)
      if (ok) {
        const user = mockUsers.find((u) => u.id === selectedUser)
        navigate(user?.role === 'warga' ? '/dashboard' : '/satpam')
      } else {
        setError('PIN salah. Coba lagi.')
        setPin('')
      }
    }, 600)
  }

  const roleLabel = (role: string) =>
    role === 'warga' ? 'Warga' : 'Satpam'

  const roleColor = (role: string) =>
    role === 'warga' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30 shadow-2xl">
            <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Si<span className="text-blue-300">Aman</span>
          </h1>
          <p className="text-blue-200/70 text-sm mt-1">Platform Keamanan Komplek Digital</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-blue-900/40 p-6 animate-slide-in-up">
          <h2 className="text-xl font-extrabold text-blue-950 mb-5">Masuk ke Akun</h2>

          {/* User selector */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-blue-600 mb-2">Pilih Akun</label>
            <div className="space-y-2">
              {mockUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => { setSelectedUser(u.id); setPin(''); setError('') }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                    selectedUser === u.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent bg-gray-50 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {u.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm text-blue-950">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.unitNo} · {u.complex}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${roleColor(u.role)}`}>
                    {roleLabel(u.role)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* PIN display */}
          {selectedUser && (
            <div className="mb-5">
              <label className="block text-xs font-bold text-blue-600 mb-2">PIN 4 Digit</label>
              <div className="flex gap-3 justify-center mb-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                      i < pin.length
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-blue-200 bg-gray-50'
                    }`}
                  >
                    {i < pin.length ? (
                      <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-2">
                {['1','2','3','4','5','6','7','8','9','',  '0','⌫'].map((d, i) => (
                  <button
                    key={i}
                    onClick={() => d === '⌫' ? handleDelete() : d !== '' ? handlePinInput(d) : undefined}
                    disabled={d === ''}
                    className={`h-12 rounded-xl font-bold text-lg transition-all press-effect ${
                      d === ''
                        ? 'invisible'
                        : d === '⌫'
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        : 'bg-gray-50 text-blue-950 hover:bg-blue-50 active:bg-blue-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-xs font-semibold text-center mb-3 animate-fade-in">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !selectedUser || pin.length < 4}
            className="w-full py-4 bg-blue-600 text-white font-extrabold rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-300/30 press-effect"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="30 60" />
                </svg>
                Masuk...
              </span>
            ) : 'Masuk →'}
          </button>

          <p className="text-center text-xs text-blue-400 mt-4">
            Demo: PIN warga <strong>1234</strong> · satpam <strong>5678</strong>
          </p>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="text-center pb-6">
        <p className="text-blue-300/50 text-xs">© 2026 Si Aman · Semarang, Jawa Tengah</p>
      </div>
    </div>
  )
}
