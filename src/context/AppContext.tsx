import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User, Notification, Incident } from '../types'
import { mockUsers, mockNotifications, mockIncidents } from '../data/mockData'

interface AppContextType {
  currentUser: User | null
  login: (userId: string, pin: string) => boolean
  logout: () => void
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  unreadCount: number
  incidents: Incident[]
  addIncident: (inc: Omit<Incident, 'id' | 'timestamp'>) => void
  speakerActive: boolean
  setSpeakerActive: (v: boolean) => void
  emergencyActive: boolean
  setEmergencyActive: (v: boolean) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)
  const [speakerActive, setSpeakerActive] = useState(false)
  const [emergencyActive, setEmergencyActive] = useState(false)

  const login = (userId: string, pin: string): boolean => {
    const user = mockUsers.find((u) => u.id === userId && u.pin === pin)
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentUser(null)
    setEmergencyActive(false)
    setSpeakerActive(false)
  }

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const addIncident = (inc: Omit<Incident, 'id' | 'timestamp'>) => {
    const newInc: Incident = {
      ...inc,
      id: `inc${Date.now()}`,
      timestamp: new Date(),
    }
    setIncidents((prev) => [newInc, ...prev])

    // Add emergency notification
    const newNotif: Notification = {
      id: `n${Date.now()}`,
      type: 'darurat',
      title: 'Sinyal Darurat Aktif',
      message: `${newInc.reporterAddress} — ${newInc.description}`,
      timestamp: new Date(),
      read: false,
      incidentId: newInc.id,
    }
    setNotifications((prev) => [newNotif, ...prev])

    if (inc.isEmergency) {
      setSpeakerActive(true)
      setEmergencyActive(true)
    }
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        notifications,
        markNotificationRead,
        unreadCount,
        incidents,
        addIncident,
        speakerActive,
        setSpeakerActive,
        emergencyActive,
        setEmergencyActive,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
