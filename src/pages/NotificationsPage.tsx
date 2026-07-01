import { useApp } from '../context/AppContext'
import TopBar from '../components/TopBar'

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

const typeConfig = {
  darurat: {
    bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  },
  info: {
    bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 000-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
  },
  sukses: {
    bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  peringatan: {
    bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  },
}

export default function NotificationsPage() {
  const { notifications, markNotificationRead, unreadCount } = useApp()

  return (
    <div className="pb-24">
      <TopBar
        title="Notifikasi"
        rightElement={
          unreadCount > 0 ? (
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
              {unreadCount} baru
            </span>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={1.5} className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-blue-950 font-bold mb-1">Tidak ada notifikasi</p>
          <p className="text-blue-400 text-sm text-center">Semua notifikasi komplek akan muncul di sini</p>
        </div>
      ) : (
        <div className="px-4 py-2 space-y-3">
          {/* Unread section */}
          {notifications.some((n) => !n.read) && (
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest px-1 pt-2">Belum Dibaca</p>
          )}
          {notifications.filter((n) => !n.read).map((notif) => {
            const cfg = typeConfig[notif.type]
            return (
              <button
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`w-full text-left ${cfg.bg} border ${cfg.border} rounded-2xl p-4 relative animate-fade-in`}
              >
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 pr-4">
                    <p className="font-bold text-sm text-blue-950 leading-tight">{notif.title}</p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatRelative(notif.timestamp)}</p>
                  </div>
                </div>
              </button>
            )
          })}

          {/* Read section */}
          {notifications.some((n) => n.read) && (
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 pt-4">Sudah Dibaca</p>
          )}
          {notifications.filter((n) => n.read).map((notif) => {
            const cfg = typeConfig[notif.type]
            return (
              <div
                key={notif.id}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 opacity-70"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white grayscale opacity-60">
                    {cfg.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-700 leading-tight">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatRelative(notif.timestamp)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
