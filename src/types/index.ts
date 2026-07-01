export type UserRole = 'warga' | 'satpam' | 'pkd'

export interface User {
  id: string
  name: string
  role: UserRole
  avatar: string
  phone: string
  address: string
  complex: string
  unitNo: string
  pin?: string
}

export interface Incident {
  id: string
  reportedBy: string
  reporterAddress: string
  type: IncidentType
  status: IncidentStatus
  timestamp: Date
  location: { lat: number; lng: number; label: string }
  description: string
  isEmergency: boolean
  respondedBy?: string
}

export type IncidentType =
  | 'maling'
  | 'kerusuhan'
  | 'kebakaran'
  | 'mencurigakan'
  | 'lainnya'

export type IncidentStatus = 'aktif' | 'ditangani' | 'selesai'

export interface Notification {
  id: string
  type: 'darurat' | 'info' | 'sukses' | 'peringatan'
  title: string
  message: string
  timestamp: Date
  read: boolean
  incidentId?: string
}

export interface CCTVCamera {
  id: string
  name: string
  location: string
  status: 'online' | 'offline'
  thumbnail: string
  isAIEnabled: boolean
}

export interface SecurityOfficer {
  id: string
  name: string
  phone: string
  status: 'bertugas' | 'istirahat' | 'offline'
  location: string
  shift: string
}
