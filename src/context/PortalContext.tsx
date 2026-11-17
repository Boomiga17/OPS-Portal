import React, { createContext, useContext, useState, useEffect } from 'react'

export interface UserProfile {
  name: string
  email: string
  role: string
  department: string
  phone: string
  avatarInitial: string
}

export interface PortalSettings {
  darkMode: boolean
  density: 'comfortable' | 'compact'
  accentColor: string
  emailNotifications: boolean
  qaAlerts: boolean
  overdueAlerts: boolean
  browserAlerts: boolean
  soundAlerts: boolean
  twoFactorAuth: boolean
  defaultPage: string
  refreshInterval: string
}

export interface ClientItem {
  id: string
  name: string
  country: string
  tech: 'Next.js' | 'React.js'
  techStyle: string
  env: 'Production' | 'Staging' | 'Development'
  envStyle: string
  ordering: {
    dot: string
    label: 'Active' | 'In Progress' | 'Not Started'
    color: string
  }
  qa: 'Signed Off' | 'Pending' | 'In Review' | 'Not Started'
  stage: {
    label: string
    style: string
  }
  status: {
    dot: string
    label: string
    color: string
  }
  priority: 'High' | 'Medium' | 'Low'
  migration: {
    dot: string
    label: 'Completed' | 'In Progress' | 'Planned'
    color: string
  }
  domain?: string
  updated?: string
  features?: {
    offers: 'enabled' | 'progress' | 'na'
    loyalty: 'enabled' | 'progress' | 'na'
    events: 'enabled' | 'progress' | 'na'
    reservation: 'enabled' | 'progress' | 'na'
  }
}

interface PortalContextType {
  // Sidebar state
  isCollapsed: boolean
  toggleCollapse: () => void
  setIsCollapsed: (val: boolean) => void

  // Mobile navigation
  isMobileNavOpen: boolean
  toggleMobileNav: () => void
  closeMobileNav: () => void

  // Settings modal
  isSettingsOpen: boolean
  settingsTab: string
  openSettings: (tab?: string) => void
  closeSettings: () => void
  setSettingsTab: (tab: string) => void

  // Presentation Deck Mode (Slides)
  isPresentationOpen: boolean
  openPresentation: () => void
  closePresentation: () => void

  // Add Client Modal
  isAddClientOpen: boolean
  openAddClient: () => void
  closeAddClient: () => void

  // Import / Export Modal
  isImportOpen: boolean
  openImport: () => void
  closeImport: () => void

  // Client Details Modal
  selectedClient: ClientItem | null
  setSelectedClient: (client: ClientItem | null) => void

  // Client Store & CRUD
  clients: ClientItem[]
  addClient: (client: ClientItem) => void
  updateClient: (id: string, updates: Partial<ClientItem>) => void
  deleteClient: (id: string) => void

  // Column Visibility Controls
  visibleColumns: { [key: string]: boolean }
  toggleColumn: (key: string) => void
  resetColumns: () => void

  // User profile
  user: UserProfile
  updateUser: (updates: Partial<UserProfile>) => void

  // System settings
  settings: PortalSettings
  updateSettings: (updates: Partial<PortalSettings>) => void

  // Dark mode
  darkMode: boolean
  toggleDarkMode: () => void
}

const DEFAULT_USER: UserProfile = {
  name: 'John Doe',
  email: 'john.doe@orbit.com',
  role: 'Admin',
  department: 'Operations Command',
  phone: '+1 (555) 019-2834',
  avatarInitial: 'J',
}

const DEFAULT_SETTINGS: PortalSettings = {
  darkMode: false,
  density: 'comfortable',
  accentColor: '#ef3340',
  emailNotifications: true,
  qaAlerts: true,
  overdueAlerts: true,
  browserAlerts: true,
  soundAlerts: false,
  twoFactorAuth: false,
  defaultPage: '/dashboard',
  refreshInterval: '1m',
}

// Helper to normalize any client object from localStorage or user input
export function normalizeClient(raw: any, fallbackId?: string): ClientItem {
  const name = typeof raw?.name === 'string' ? raw.name : 'Untitled Client'
  const country = typeof raw?.country === 'string' ? raw.country : 'USA'
  const tech = raw?.tech === 'React.js' ? 'React.js' : 'Next.js'
  const techStyle = tech === 'Next.js' ? 'bg-neutral-900 text-white' : 'bg-[#3b82f6] text-white'
  const env = raw?.env === 'Staging' ? 'Staging' : raw?.env === 'Development' ? 'Development' : 'Production'
  const envStyle = env === 'Production' ? 'bg-[#e5f4e8] text-[#4caf60]' : env === 'Staging' ? 'bg-[#ffeed9] text-[#e27b4e]' : 'bg-[#ede9fe] text-[#7c3aed]'

  // Ordering
  let orderingLabel: 'Active' | 'In Progress' | 'Not Started' = 'Active'
  const rawOrd = typeof raw?.ordering === 'object' ? raw?.ordering?.label : raw?.ordering
  if (rawOrd === 'In Progress' || rawOrd === 'progress') orderingLabel = 'In Progress'
  else if (rawOrd === 'Not Started' || rawOrd === 'na') orderingLabel = 'Not Started'
  const ordering = {
    dot: orderingLabel === 'Active' ? 'bg-[#22c55e]' : orderingLabel === 'In Progress' ? 'bg-[#d4af37]' : 'bg-neutral-400',
    label: orderingLabel,
    color: orderingLabel === 'Active' ? '#22c55e' : orderingLabel === 'In Progress' ? '#d4af37' : '#94a3b8',
  }

  // Status
  let statusLabel = 'Live'
  const rawStat = typeof raw?.status === 'object' ? raw?.status?.label : raw?.status
  if (rawStat) statusLabel = String(rawStat)
  const status = {
    dot: statusLabel.toLowerCase() === 'live' ? 'bg-[#22c55e]' : statusLabel.toLowerCase() === 'staging' ? 'bg-[#d4af37]' : 'bg-neutral-400',
    label: statusLabel,
    color: statusLabel.toLowerCase() === 'live' ? '#22c55e' : statusLabel.toLowerCase() === 'staging' ? '#d4af37' : '#94a3b8',
  }

  // Stage
  let stageLabel = 'Completed'
  const rawStg = typeof raw?.stage === 'object' ? raw?.stage?.label : raw?.stage
  if (rawStg) stageLabel = String(rawStg)
  const stage = {
    label: stageLabel,
    style: stageLabel === 'Completed' ? 'bg-[#e5f4e8] text-[#4caf60]' : stageLabel === 'Testing' ? 'bg-[#fce8e8] text-[#ef3340]' : 'bg-[#fff3b5] text-[#ae8e55]',
  }

  // Priority
  const priority: 'High' | 'Medium' | 'Low' = raw?.priority === 'Low' ? 'Low' : raw?.priority === 'Medium' ? 'Medium' : 'High'

  // Migration
  let migLabel: 'Completed' | 'In Progress' | 'Planned' = 'Completed'
  const rawMig = typeof raw?.migration === 'object' ? raw?.migration?.label : raw?.migration
  if (rawMig === 'In Progress') migLabel = 'In Progress'
  else if (rawMig === 'Planned' || rawMig === 'Planning') migLabel = 'Planned'
  const migration = {
    dot: migLabel === 'Completed' ? 'bg-[#22c55e]' : migLabel === 'In Progress' ? 'bg-[#d4af37]' : 'bg-neutral-400',
    label: migLabel,
    color: migLabel === 'Completed' ? '#22c55e' : migLabel === 'In Progress' ? '#d4af37' : '#94a3b8',
  }

  const qa = raw?.qa === 'Pending' ? 'Pending' : raw?.qa === 'In Review' ? 'In Review' : raw?.qa === 'Not Started' ? 'Not Started' : 'Signed Off'

  return {
    id: raw?.id || fallbackId || `client-${Date.now()}`,
    name,
    country,
    tech,
    techStyle,
    env,
    envStyle,
    ordering,
    qa,
    stage,
    status,
    priority,
    migration,
    domain: raw?.domain || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    updated: raw?.updated || 'Recently',
    features: {
      offers: raw?.features?.offers || 'enabled',
      loyalty: raw?.features?.loyalty || 'enabled',
      events: raw?.features?.events || 'progress',
      reservation: raw?.features?.reservation || 'enabled',
    },
  }
}

export const INITIAL_CLIENTS: ClientItem[] = [
  {
    id: 'client-1',
    name: 'Amudham Restaurant',
    country: 'USA',
    tech: 'Next.js',
    techStyle: 'bg-neutral-900 text-white',
    env: 'Production',
    envStyle: 'bg-[#e5f4e8] text-[#4caf60]',
    ordering: { dot: 'bg-[#22c55e]', label: 'Active', color: '#22c55e' },
    qa: 'Signed Off',
    stage: { label: 'Completed', style: 'bg-[#e5f4e8] text-[#4caf60]' },
    status: { dot: 'bg-[#22c55e]', label: 'Live', color: '#22c55e' },
    priority: 'High',
    migration: { dot: 'bg-[#22c55e]', label: 'Completed', color: '#22c55e' },
    domain: 'amudham.com',
    updated: 'Oct 30, 2026',
    features: { offers: 'enabled', loyalty: 'enabled', events: 'progress', reservation: 'enabled' },
  },
  {
    id: 'client-2',
    name: 'Bheema Next.js',
    country: 'USA',
    tech: 'Next.js',
    techStyle: 'bg-neutral-900 text-white',
    env: 'Production',
    envStyle: 'bg-[#e5f4e8] text-[#4caf60]',
    ordering: { dot: 'bg-[#22c55e]', label: 'Active', color: '#22c55e' },
    qa: 'Signed Off',
    stage: { label: 'Completed', style: 'bg-[#e5f4e8] text-[#4caf60]' },
    status: { dot: 'bg-[#22c55e]', label: 'Live', color: '#22c55e' },
    priority: 'High',
    migration: { dot: 'bg-[#22c55e]', label: 'Completed', color: '#22c55e' },
    domain: 'bheema.com',
    updated: 'Oct 28, 2026',
    features: { offers: 'enabled', loyalty: 'enabled', events: 'enabled', reservation: 'enabled' },
  },
  {
    id: 'client-3',
    name: 'Sangam Restaurant',
    country: 'USA',
    tech: 'React.js',
    techStyle: 'bg-[#3b82f6] text-white',
    env: 'Staging',
    envStyle: 'bg-[#ffeed9] text-[#e27b4e]',
    ordering: { dot: 'bg-[#d4af37]', label: 'In Progress', color: '#d4af37' },
    qa: 'Pending',
    stage: { label: 'In Progress', style: 'bg-[#fff3b5] text-[#ae8e55]' },
    status: { dot: 'bg-[#d4af37]', label: 'Staging', color: '#d4af37' },
    priority: 'High',
    migration: { dot: 'bg-[#d4af37]', label: 'In Progress', color: '#d4af37' },
    domain: 'sangam.com',
    updated: 'Oct 25, 2026',
    features: { offers: 'progress', loyalty: 'progress', events: 'na', reservation: 'enabled' },
  },
  {
    id: 'client-4',
    name: 'Manam Onam',
    country: 'UAE',
    tech: 'Next.js',
    techStyle: 'bg-neutral-900 text-white',
    env: 'Production',
    envStyle: 'bg-[#e5f4e8] text-[#4caf60]',
    ordering: { dot: 'bg-[#22c55e]', label: 'Active', color: '#22c55e' },
    qa: 'Signed Off',
    stage: { label: 'Completed', style: 'bg-[#e5f4e8] text-[#4caf60]' },
    status: { dot: 'bg-[#22c55e]', label: 'Live', color: '#22c55e' },
    priority: 'Medium',
    migration: { dot: 'bg-[#22c55e]', label: 'Completed', color: '#22c55e' },
    domain: 'manamonam.com',
    updated: 'Oct 20, 2026',
    features: { offers: 'enabled', loyalty: 'progress', events: 'enabled', reservation: 'progress' },
  },
  {
    id: 'client-5',
    name: 'Aaha Kitchen',
    country: 'UK',
    tech: 'Next.js',
    techStyle: 'bg-neutral-900 text-white',
    env: 'Staging',
    envStyle: 'bg-[#ffeed9] text-[#e27b4e]',
    ordering: { dot: 'bg-[#d4af37]', label: 'In Progress', color: '#d4af37' },
    qa: 'Pending',
    stage: { label: 'In Progress', style: 'bg-[#fff3b5] text-[#ae8e55]' },
    status: { dot: 'bg-[#d4af37]', label: 'Staging', color: '#d4af37' },
    priority: 'High',
    migration: { dot: 'bg-[#22c55e]', label: 'Completed', color: '#22c55e' },
    domain: 'aahakitchen.co.uk',
    updated: 'Oct 27, 2026',
    features: { offers: 'enabled', loyalty: 'enabled', events: 'na', reservation: 'na' },
  },
  {
    id: 'client-6',
    name: 'Monks Allen',
    country: 'USA',
    tech: 'React.js',
    techStyle: 'bg-[#3b82f6] text-white',
    env: 'Development',
    envStyle: 'bg-[#ede9fe] text-[#7c3aed]',
    ordering: { dot: 'bg-neutral-400', label: 'Not Started', color: '#94a3b8' },
    qa: 'Not Started',
    stage: { label: 'Planning', style: 'bg-neutral-100 text-neutral-500' },
    status: { dot: 'bg-neutral-400', label: 'Dev', color: '#94a3b8' },
    priority: 'Low',
    migration: { dot: 'bg-neutral-400', label: 'Planned', color: '#94a3b8' },
    domain: 'monksallen.com',
    updated: 'Oct 15, 2026',
    features: { offers: 'na', loyalty: 'na', events: 'na', reservation: 'na' },
  },
  {
    id: 'client-7',
    name: 'Pakka Spice Romeoville',
    country: 'USA',
    tech: 'Next.js',
    techStyle: 'bg-neutral-900 text-white',
    env: 'Staging',
    envStyle: 'bg-[#ffeed9] text-[#e27b4e]',
    ordering: { dot: 'bg-[#22c55e]', label: 'Active', color: '#22c55e' },
    qa: 'In Review',
    stage: { label: 'Testing', style: 'bg-[#fce8e8] text-[#ef3340]' },
    status: { dot: 'bg-[#d4af37]', label: 'Staging', color: '#d4af37' },
    priority: 'High',
    migration: { dot: 'bg-[#22c55e]', label: 'Completed', color: '#22c55e' },
    domain: 'pakkasp.com',
    updated: 'Oct 29, 2026',
    features: { offers: 'enabled', loyalty: 'progress', events: 'enabled', reservation: 'progress' },
  },
  {
    id: 'client-8',
    name: 'Madurai Kitchen',
    country: 'USA',
    tech: 'Next.js',
    techStyle: 'bg-neutral-900 text-white',
    env: 'Production',
    envStyle: 'bg-[#e5f4e8] text-[#4caf60]',
    ordering: { dot: 'bg-[#22c55e]', label: 'Active', color: '#22c55e' },
    qa: 'Signed Off',
    stage: { label: 'Completed', style: 'bg-[#e5f4e8] text-[#4caf60]' },
    status: { dot: 'bg-[#22c55e]', label: 'Live', color: '#22c55e' },
    priority: 'Medium',
    migration: { dot: 'bg-[#22c55e]', label: 'Completed', color: '#22c55e' },
    domain: 'maduraikitchen.com',
    updated: 'Oct 26, 2026',
    features: { offers: 'enabled', loyalty: 'enabled', events: 'progress', reservation: 'enabled' },
  },
]

const DEFAULT_COLUMNS = {
  client: true,
  tech: true,
  env: true,
  ordering: true,
  qa: true,
  stage: true,
  status: true,
  priority: true,
  migration: true,
  actions: true,
}

const PortalContext = createContext<PortalContextType | undefined>(undefined)

export function PortalProvider({ children }: { children: React.ReactNode }) {
  // ── Collapsed Sidebar ───────────────────────────────────────
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('orbit_sidebar_collapsed') ?? localStorage.getItem('brisque_sidebar_collapsed')
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('orbit_sidebar_collapsed', JSON.stringify(isCollapsed))
    } catch (e) {
      console.error(e)
    }
  }, [isCollapsed])

  const toggleCollapse = () => setIsCollapsed((prev) => !prev)

  // ── Mobile Navigation Drawer ────────────────────────────────
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const toggleMobileNav = () => setIsMobileNavOpen((prev) => !prev)
  const closeMobileNav = () => setIsMobileNavOpen(false)

  // ── Presentation Deck Mode ──────────────────────────────────
  const [isPresentationOpen, setIsPresentationOpen] = useState(false)
  const openPresentation = () => setIsPresentationOpen(true)
  const closePresentation = () => setIsPresentationOpen(false)

  // ── Add Client Modal ────────────────────────────────────────
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const openAddClient = () => setIsAddClientOpen(true)
  const closeAddClient = () => setIsAddClientOpen(false)

  // ── Import / Export Modal ───────────────────────────────────
  const [isImportOpen, setIsImportOpen] = useState(false)
  const openImport = () => setIsImportOpen(true)
  const closeImport = () => setIsImportOpen(false)

  // ── Client Detail Modal ─────────────────────────────────────
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null)

  // ── Client Store (Persisted) ────────────────────────────────
  const [clients, setClients] = useState<ClientItem[]>(() => {
    try {
      const saved = localStorage.getItem('orbit_clients_data') ?? localStorage.getItem('brisque_clients_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c, i) => normalizeClient(c, `client-${i + 1}`))
        }
      }
    } catch (e) {
      console.error(e)
    }
    return INITIAL_CLIENTS.map(c => normalizeClient(c))
  })

  useEffect(() => {
    try {
      localStorage.setItem('orbit_clients_data', JSON.stringify(clients))
    } catch (e) {
      console.error(e)
    }
  }, [clients])

  const addClient = (newClient: ClientItem) => {
    setClients((prev) => [newClient, ...prev])
  }

  const updateClient = (id: string, updates: Partial<ClientItem>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    )
  }

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id))
  }

  // ── Column Visibility ───────────────────────────────────────
  const [visibleColumns, setVisibleColumns] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('orbit_table_columns') ?? localStorage.getItem('brisque_table_columns')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    return DEFAULT_COLUMNS
  })

  useEffect(() => {
    try {
      localStorage.setItem('orbit_table_columns', JSON.stringify(visibleColumns))
    } catch (e) {
      console.error(e)
    }
  }, [visibleColumns])

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const resetColumns = () => {
    setVisibleColumns(DEFAULT_COLUMNS)
  }

  // ── Settings Modal ──────────────────────────────────────────
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState('profile')

  const openSettings = (tab = 'profile') => {
    setSettingsTab(tab)
    setIsSettingsOpen(true)
  }

  const closeSettings = () => {
    setIsSettingsOpen(false)
  }

  // ── User Profile ────────────────────────────────────────────
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('orbit_user_profile') ?? localStorage.getItem('brisque_user_profile')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    return DEFAULT_USER
  })

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      if (updates.name && updates.name.trim().length > 0) {
        updated.avatarInitial = updates.name.trim().charAt(0).toUpperCase()
      }
      try {
        localStorage.setItem('orbit_user_profile', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

  // ── System Settings ─────────────────────────────────────────
  const [settings, setSettings] = useState<PortalSettings>(() => {
    try {
      const saved = localStorage.getItem('orbit_portal_settings') ?? localStorage.getItem('brisque_portal_settings')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    return DEFAULT_SETTINGS
  })

  const updateSettings = (updates: Partial<PortalSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates }
      try {
        localStorage.setItem('orbit_portal_settings', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

  // ── Dark Mode ───────────────────────────────────────────────
  const darkMode = settings.darkMode

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !darkMode })
  }

  return (
    <PortalContext.Provider
      value={{
        isCollapsed,
        toggleCollapse,
        setIsCollapsed,
        isMobileNavOpen,
        toggleMobileNav,
        closeMobileNav,
        isPresentationOpen,
        openPresentation,
        closePresentation,
        isAddClientOpen,
        openAddClient,
        closeAddClient,
        isImportOpen,
        openImport,
        closeImport,
        selectedClient,
        setSelectedClient,
        clients,
        addClient,
        updateClient,
        deleteClient,
        visibleColumns,
        toggleColumn,
        resetColumns,
        isSettingsOpen,
        settingsTab,
        openSettings,
        closeSettings,
        setSettingsTab,
        user,
        updateUser,
        settings,
        updateSettings,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </PortalContext.Provider>
  )
}

export function usePortal() {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider')
  }
  return context
}
