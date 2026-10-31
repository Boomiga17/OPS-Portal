import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CheckCircle2, Circle, Clock, Globe, MinusCircle, Rocket, Search, ShieldCheck,
  Calendar, MonitorPlay, ArrowUpRight,
  Eye, Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown, Download, Plus, Minus,
  LayoutDashboard, Users, Boxes, Share2, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import DonutChart from '../components/DonutChart'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Pagination from '../components/Pagination'
import ColumnsDropdown from '../components/ColumnsDropdown'
import { usePortal } from '../context/PortalContext'

const stats = [
  ['Total Websites', 8, Globe, 'bg-[#3478b9]'],
  ['Order Completed', 5, CheckCircle2, 'bg-[#4caf60]'],
  ['Ordering in Progress', 2, Clock, 'bg-[#e27b4e]'],
  ['Migrated to Next.JS', 6, Rocket, 'bg-[#bf3d3d]'],
  ['QA / Ready', 4, ShieldCheck, 'bg-[#ae8e55]'],
] as const

const rollout = [
  ['Order Completed', 5, '62%', '#4caf60'],
  ['In Progress',     2, '25%', '#f2a04b'],
  ['Not Started',     1, '13%', '#ef3340'],
  ['NA',              0, '0%',  '#e5e7eb'],
] as const

const prioritiesData = [
  { title: 'Amudham Restaurant', subtitle: 'Embedded Ordering', week: 'October 5th Week', priority: 'Medium', date: 'Nov 5, 2026', status: 'Review', assignee: 'Sarah K.' },
  { title: 'Bheema – Next.js Migration', subtitle: 'Migration', week: 'October 5th Week', priority: 'High', date: 'Nov 3, 2026', status: 'In progress', assignee: 'Yoga' },
  { title: 'Manam Onam Event Page', subtitle: 'Event Ordering', week: 'October 5th Week', priority: 'High', date: 'Oct 28, 2026', status: 'Completed', assignee: 'Raj' },
  { title: 'Monks Allen Hotfix [Order type · Modifiers · Cart value]', subtitle: 'Bug Fix', week: 'October 5th Week', priority: 'Low', date: 'Oct 22, 2026', overdue: true, status: 'In progress', assignee: 'Unassigned' },
  { title: 'Manam Reservation [React → Next.js]', subtitle: 'Reservation', week: 'October 5th Week', priority: 'High', date: 'Nov 8, 2026', status: 'Block', assignee: 'Dev Team' },
  { title: 'Sangam Next.js Migration', subtitle: 'Migration', week: 'October 5th Week', priority: 'High', date: 'Nov 10, 2026', status: 'In progress', assignee: 'Yoga' },
  { title: 'Aaha Kitchen Emb Ordering', subtitle: 'Embedded Ordering', week: 'October 5th Week', priority: 'High', date: 'Nov 12, 2026', status: 'In progress', assignee: 'Sarah K.' },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } },
}



const adminFeaturesData = [
  { client: 'Amudham Restaurant', country: 'USA', emb: 'Active', offers: 'Enabled', loyalty: 'Enabled', reservation: 'Enabled', event: 'In Progress' },
  { client: 'Bheema Next.js', country: 'USA', emb: 'Active', offers: 'Enabled', loyalty: 'Enabled', reservation: 'Enabled', event: 'Enabled' },
  { client: 'Sangam Restaurant', country: 'USA', emb: 'In Progress', offers: 'In Progress', loyalty: 'In Progress', reservation: 'Enabled', event: 'Not Available' },
  { client: 'Manam Onam', country: 'UAE', emb: 'Active', offers: 'Enabled', loyalty: 'In Progress', reservation: 'In Progress', event: 'Enabled' },
  { client: 'Aaha Kitchen', country: 'UK', emb: 'In Progress', offers: 'Enabled', loyalty: 'Enabled', reservation: 'Not Available', event: 'Not Available' },
  { client: 'Monks Allen', country: 'USA', emb: 'Not Started', offers: 'Not Available', loyalty: 'Not Available', reservation: 'Not Available', event: 'Not Available' },
  { client: 'Pakka Spice Romeoville', country: 'USA', emb: 'Active', offers: 'Enabled', loyalty: 'In Progress', reservation: 'In Progress', event: 'Enabled' },
  { client: 'Madurai Kitchen', country: 'USA', emb: 'Active', offers: 'Enabled', loyalty: 'Enabled', reservation: 'Enabled', event: 'In Progress' },
]

const migrationAdminData = [
  { client: 'Amudham Restaurant', currentStack: 'React 17', targetStack: 'Next.js 14', status: 'Completed', quarter: 'Q3 2026', priority: 'High', progress: 100 },
  { client: 'Bheema Next.js', currentStack: 'React 18', targetStack: 'Next.js 14', status: 'Completed', quarter: 'Q3 2026', priority: 'High', progress: 100 },
  { client: 'Sangam Restaurant', currentStack: 'React 18', targetStack: 'Next.js 14', status: 'In Progress', quarter: 'Q4 2026', priority: 'High', progress: 65 },
  { client: 'Manam Onam', currentStack: 'React 17', targetStack: 'Next.js 14', status: 'Completed', quarter: 'Q3 2026', priority: 'Medium', progress: 100 },
  { client: 'Aaha Kitchen', currentStack: 'React 18', targetStack: 'Next.js 14', status: 'Testing', quarter: 'Q4 2026', priority: 'High', progress: 85 },
  { client: 'Monks Allen', currentStack: 'React 18', targetStack: 'Next.js 14', status: 'Planning', quarter: 'Q1 2027', priority: 'Low', progress: 15 },
  { client: 'Pakka Spice Romeoville', currentStack: 'React 18', targetStack: 'Next.js 14', status: 'Testing', quarter: 'Q4 2026', priority: 'High', progress: 90 },
  { client: 'Madurai Kitchen', currentStack: 'React 17', targetStack: 'Next.js 14', status: 'Completed', quarter: 'Q3 2026', priority: 'Medium', progress: 100 },
]

const websites = [
  { name: 'Amudham Restaurant', domain: 'amudham.com', client: 'Amudham', framework: 'Next.js', ordering: 'Live', env: 'Production', qa: 'Signed Off', updated: 'Oct 30, 2026' },
  { name: 'Bheema Next.js', domain: 'bheema.com', client: 'Bheema', framework: 'Next.js', ordering: 'Live', env: 'Production', qa: 'Signed Off', updated: 'Oct 28, 2026' },
  { name: 'Sangam Restaurant', domain: 'sangam.com', client: 'Sangam', framework: 'React.js', ordering: 'In Progress', env: 'Staging', qa: 'Pending', updated: 'Oct 25, 2026' },
  { name: 'Manam Onam', domain: 'manamonam.com', client: 'Manam', framework: 'Next.js', ordering: 'Live', env: 'Production', qa: 'Signed Off', updated: 'Oct 20, 2026' },
  { name: 'Aaha Kitchen', domain: 'aahakitchen.co.uk', client: 'Aaha', framework: 'Next.js', ordering: 'In Progress', env: 'Staging', qa: 'Pending', updated: 'Oct 27, 2026' },
  { name: 'Monks Allen', domain: 'monksallen.com', client: 'Monks Allen', framework: 'React.js', ordering: 'Not Started', env: 'Development', qa: 'Not Started', updated: 'Oct 15, 2026' },
  { name: 'Pakka Spice Romeoville', domain: 'pakkasp.com', client: 'Pakka Spice', framework: 'Next.js', ordering: 'Live', env: 'Staging', qa: 'In Review', updated: 'Oct 29, 2026' },
  { name: 'Madurai Kitchen', domain: 'maduraikitchen.com', client: 'Madurai', framework: 'Next.js', ordering: 'Live', env: 'Production', qa: 'Signed Off', updated: 'Oct 26, 2026' },
]

export default function AdminPanelPage() {
  const navigate = useNavigate()
  const {
    clients,
    deleteClient,
    setSelectedClient,
    visibleColumns,
    openPresentation,
    openAddClient,
    openImport,
  } = usePortal()

  const [activeTab, setActiveTab] = useState('Client Tracker')
  const [clientSearch, setClientSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [sortField, setSortField] = useState<'default' | 'name' | 'tech' | 'priority'>('default')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  // Whenever a client is added, automatically reset filters and show on page 1
  const prevAdminClientsCount = useRef(clients.length)
  useEffect(() => {
    if (clients.length > prevAdminClientsCount.current) {
      setCurrentPage(1)
      setClientSearch('')
      setStatusFilter('All')
      setPriorityFilter('All')
      setSortField('default')
    }
    prevAdminClientsCount.current = clients.length
  }, [clients.length])

  // Filter clients
  const filteredClients = clients
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.country.toLowerCase().includes(clientSearch.toLowerCase()) ||
        (c.domain && c.domain.toLowerCase().includes(clientSearch.toLowerCase()))
      const clientStatus = (typeof c?.status === 'object' ? c?.status?.label : c?.status) || ''
      const matchStatus =
        statusFilter === 'All' || clientStatus.toLowerCase() === statusFilter.toLowerCase()
      const clientPriority = c?.priority || 'Medium'
      const matchPriority =
        priorityFilter === 'All' || clientPriority.toLowerCase() === priorityFilter.toLowerCase()
      return matchSearch && matchStatus && matchPriority
    })
    .sort((a, b) => {
      if (sortField === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
      if (sortField === 'tech') {
        return sortOrder === 'asc' ? a.tech.localeCompare(b.tech) : b.tech.localeCompare(a.tech)
      }
      if (sortField === 'priority') {
        return sortOrder === 'asc' ? a.priority.localeCompare(b.priority) : b.priority.localeCompare(a.priority)
      }
      return 0
    })

  const paginatedClients = filteredClients.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // ── Features Tab State ───────────────────────────────────────
  const [featuresList, setFeaturesList] = useState(adminFeaturesData)
  const [featuresSearch, setFeaturesSearch] = useState('')
  const [featuresCapability, setFeaturesCapability] = useState('All')

  const toggleFeature = (index: number, field: 'emb' | 'offers' | 'loyalty' | 'reservation' | 'event') => {
    setFeaturesList(prev => {
      const next = [...prev]
      const current = next[index][field]
      if (field === 'emb') {
        next[index] = {
          ...next[index],
          emb: current === 'Active' ? 'In Progress' : current === 'In Progress' ? 'Not Started' : 'Active',
        }
      } else {
        next[index] = {
          ...next[index],
          [field]: current === 'Enabled' ? 'In Progress' : current === 'In Progress' ? 'Not Available' : 'Enabled',
        }
      }
      return next
    })
  }

  const filteredFeatures = featuresList.filter(f => {
    const matchSearch = f.client.toLowerCase().includes(featuresSearch.toLowerCase()) ||
                        f.country.toLowerCase().includes(featuresSearch.toLowerCase())
    if (!matchSearch) return false
    if (featuresCapability === 'Embedded Ordering') return f.emb === 'Active'
    if (featuresCapability === 'Offers') return f.offers === 'Enabled'
    if (featuresCapability === 'Loyalty') return f.loyalty === 'Enabled'
    if (featuresCapability === 'Reservation') return f.reservation === 'Enabled'
    if (featuresCapability === 'Event Ordering') return f.event === 'Enabled'
    return true
  })

  // ── Migration Tab State ──────────────────────────────────────
  const [migrationList, setMigrationList] = useState(migrationAdminData)
  const [migrationSearch, setMigrationSearch] = useState('')
  const [migrationStatus, setMigrationStatus] = useState('All')
  const [migrationQuarter, setMigrationQuarter] = useState('All')

  const advanceMigration = (index: number) => {
    setMigrationList(prev => {
      const next = [...prev]
      const current = next[index].status
      const stages = ['Planning', 'In Progress', 'Testing', 'Completed']
      const currentIdx = stages.indexOf(current)
      const nextStage = stages[(currentIdx + 1) % stages.length]
      const progress = nextStage === 'Completed' ? 100 : nextStage === 'Testing' ? 85 : nextStage === 'In Progress' ? 50 : 15
      next[index] = { ...next[index], status: nextStage, progress }
      return next
    })
  }

  const filteredMigrations = migrationList.filter(m => {
    const matchSearch = m.client.toLowerCase().includes(migrationSearch.toLowerCase()) ||
                        m.currentStack.toLowerCase().includes(migrationSearch.toLowerCase()) ||
                        m.targetStack.toLowerCase().includes(migrationSearch.toLowerCase())
    const matchStatus = migrationStatus === 'All' || m.status.toLowerCase() === migrationStatus.toLowerCase()
    const matchQuarter = migrationQuarter === 'All' || m.quarter.toLowerCase() === migrationQuarter.toLowerCase()
    return matchSearch && matchStatus && matchQuarter
  })

  // ── Priorities Tab State ─────────────────────────────────────
  const [prioritiesList, setPrioritiesList] = useState(prioritiesData)
  const [prioritiesSearch, setPrioritiesSearch] = useState('')
  const [prioritiesStatus, setPrioritiesStatus] = useState('All')
  const [prioritiesPriority, setPrioritiesPriority] = useState('All')
  const [prioritiesPage, setPrioritiesPage] = useState(1)
  const [prioritiesPageSize, setPrioritiesPageSize] = useState(4)
  const [isAddPriorityOpen, setIsAddPriorityOpen] = useState(false)
  const [newPrioTitle, setNewPrioTitle] = useState('')
  const [newPrioSubtitle, setNewPrioSubtitle] = useState('Embedded Ordering')
  const [newPrioPriority, setNewPrioPriority] = useState('High')
  const [newPrioDate, setNewPrioDate] = useState('Nov 15, 2026')
  const [newPrioStatus, setNewPrioStatus] = useState('In progress')
  const [newPrioAssignee, setNewPrioAssignee] = useState('Dev Team')

  const handleAddPriority = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPrioTitle.trim()) return
    setPrioritiesList(prev => [
      {
        title: newPrioTitle.trim(),
        subtitle: newPrioSubtitle,
        week: 'October 5th Week',
        priority: newPrioPriority,
        date: newPrioDate,
        status: newPrioStatus,
        assignee: newPrioAssignee,
      },
      ...prev
    ])
    setNewPrioTitle('')
    setIsAddPriorityOpen(false)
    setPrioritiesPage(1)
  }

  const filteredPriorities = prioritiesList.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(prioritiesSearch.toLowerCase()) ||
                        p.subtitle.toLowerCase().includes(prioritiesSearch.toLowerCase()) ||
                        p.assignee.toLowerCase().includes(prioritiesSearch.toLowerCase())
    const matchStatus = prioritiesStatus === 'All' || p.status.toLowerCase() === prioritiesStatus.toLowerCase()
    const matchPriority = prioritiesPriority === 'All' || p.priority.toLowerCase() === prioritiesPriority.toLowerCase()
    return matchSearch && matchStatus && matchPriority
  })
  const paginatedPriorities = filteredPriorities.slice(
    (prioritiesPage - 1) * prioritiesPageSize,
    prioritiesPage * prioritiesPageSize
  )

  // ── Websites Tab State ───────────────────────────────────────
  const [websitesList, setWebsitesList] = useState(websites)
  const [websitesSearch, setWebsitesSearch] = useState('')
  const [websitesFramework, setWebsitesFramework] = useState('All')
  const [websitesOrdering, setWebsitesOrdering] = useState('All')
  const [websitesPage, setWebsitesPage] = useState(1)
  const [websitesPageSize, setWebsitesPageSize] = useState(4)

  const filteredWebsites = websitesList.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(websitesSearch.toLowerCase()) ||
                        w.domain.toLowerCase().includes(websitesSearch.toLowerCase()) ||
                        w.client.toLowerCase().includes(websitesSearch.toLowerCase())
    const matchFramework = websitesFramework === 'All' || w.framework.toLowerCase() === websitesFramework.toLowerCase()
    const matchOrdering = websitesOrdering === 'All' || w.ordering.toLowerCase() === websitesOrdering.toLowerCase()
    return matchSearch && matchFramework && matchOrdering
  })
  const paginatedWebsites = filteredWebsites.slice(
    (websitesPage - 1) * websitesPageSize,
    websitesPage * websitesPageSize
  )

  const tabs = [
    { id: 'Dashboard',      label: 'Dashboard',      Icon: LayoutDashboard, count: undefined },
    { id: 'Client Tracker', label: 'Client Tracker',  Icon: Users,           count: clients.length },
    { id: 'Features',       label: 'Features',        Icon: Boxes,           count: featuresList.length },
    { id: 'Migration',      label: 'Migration',       Icon: Share2,          count: migrationList.length },
    { id: 'Priorities',     label: 'Priorities',      Icon: Calendar,        count: prioritiesList.length },
    { id: 'Websites',       label: 'Websites',        Icon: Globe,           count: websitesList.length },
  ]

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f1f3f5] font-sans text-[12px] p-2.5 sm:p-4 gap-4 lg:gap-6">
      {/* Sidebar (Desktop sticky + Mobile drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 py-1 min-w-0">
        <div className="w-full pb-10">
          {/* Responsive Header */}
          <Header title="Brisque OPS" subtitle="Operations Command Center" searchPlaceholder="Search Admin Panel..." />

          {/* Main Dashboard Blocks */}
          <motion.main 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="rounded-[16px] bg-white p-4 sm:p-6 shadow-sm space-y-6"
          >
            {/* Admin Panel Header Section */}
            <motion.section variants={itemVariants}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <h2 className="text-[16px] sm:text-[18px] font-bold text-neutral-900">Admin Panel</h2>
                  <p className="mt-1 text-[12px] sm:text-[13px] text-neutral-500 max-w-3xl">
                    The single source of truth for clients, capabilities, migration milestones and priority assignments.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      openPresentation()
                    }}
                    className="flex items-center gap-2 rounded-lg bg-[#ef3340] px-4 py-2 text-[12px] font-bold text-white shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                    title="Launch Executive Presentation Mode"
                  >
                    <MonitorPlay size={14} /> Present View
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/presentation')}
                    className="flex items-center gap-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 px-3 py-2 text-[12px] font-semibold text-neutral-700 border border-neutral-200 transition-colors cursor-pointer"
                    title="Open Full Page Presentation Deck"
                  >
                    <ArrowUpRight size={14} /> Full Page
                  </button>
                </div>
              </div>
              
              {/* Responsive Animated Tab Nav */}
              <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                {tabs.map(({ id, label, Icon, count }) => {
                  const isActive = activeTab === id
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className="relative flex shrink-0 items-center pb-2 cursor-pointer"
                    >
                      <div className={`flex items-center gap-2 px-3 py-2 text-[12.5px] font-medium rounded-lg transition-colors duration-150 ${
                        isActive ? 'bg-[#ef3340] text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
                      }`}>
                        <Icon size={15} />
                        <span>{label}</span>
                        {count !== undefined && (
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'
                          }`}>
                            {count}
                          </span>
                        )}
                      </div>

                      {isActive && (
                        <motion.span
                          layoutId="activeAdminTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#ef3340]"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {activeTab === 'Dashboard' && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[16px] bg-[#f8f9fa] p-4 sm:p-5 border border-neutral-100">
                  <div>
                    <h3 className="font-bold text-[13.5px] text-neutral-900">Live Snapshot</h3>
                    <p className="mt-1 text-[11.5px] text-neutral-500">All analytics are computed dynamically from Client Tracker, Features, and Migration data.</p>
                  </div>
                  <button onClick={() => setActiveTab('Client Tracker')} className="flex items-center gap-2 rounded-lg bg-[#ef3340] px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:bg-red-600 transition-colors self-start sm:self-auto">
                    Manage Clients <ArrowUpRight size={14} />
                  </button>
                </div>
              )}
            </motion.section>

            {/* TAB: Dashboard View */}
            {activeTab === 'Dashboard' && (
              <>
                <motion.section variants={itemVariants}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                    {stats.map(([label, value, Icon, bg]) => (
                      <div key={label} className={`relative flex min-h-[72px] sm:min-h-[80px] flex-col justify-between rounded-xl ${bg} px-3.5 py-2.5 text-white shadow-sm hover:scale-[1.02] transition-transform`}>
                        <div className="flex items-start justify-between">
                          <p className="text-[20px] sm:text-[22px] font-bold leading-none">{value}</p>
                          <Icon size={16} className="opacity-80" />
                        </div>
                        <p className="mt-1 text-[10.5px] sm:text-[11px] font-medium leading-tight opacity-90">{label}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                <motion.section variants={itemVariants}>
                  <div className="grid gap-4 grid-cols-1 lg:grid-cols-[280px_1fr]">
                    <div className="flex flex-col items-center gap-5 rounded-[16px] bg-[#f8f9fa] p-5 sm:flex-row sm:justify-center lg:flex-col">
                      <DonutChart centerValue={5} centerLabel="Completed" size={130} strokeWidth={12} segments={[{ value: 5, color: '#4caf60' }, { value: 2, color: '#f2a04b' }, { value: 1, color: '#ef3340' }]} />
                      <ul className="w-full space-y-2.5">
                        {rollout.map(([label, value, percent, color]) => (
                          <li key={label} className="flex justify-between text-[11px]">
                            <span className="flex items-center gap-2 text-neutral-500">
                              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                              {label}
                            </span>
                            <span className="text-neutral-400">
                              <b className="mr-3 text-neutral-700">{value}</b>
                              {percent}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col justify-center rounded-[16px] bg-[#f8f9fa] p-5 sm:p-6">
                      <p className="text-[12px] font-medium text-neutral-700">Completed Rate</p>
                      <div className="mt-1 flex flex-wrap items-baseline gap-2">
                        <p className="text-[36px] sm:text-[40px] font-bold leading-none text-[#3cab56]">62%</p>
                        <p className="text-[11.5px] sm:text-[12px] text-neutral-400">5 of 8 Websites have ordering live</p>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                        <div className="h-full w-[62%] bg-[#3cab56]" />
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2 sm:gap-3 text-[10.5px] sm:text-[11px]">
                        <span className="flex items-center gap-1.5 rounded-md bg-[#e5f4e8] px-2.5 py-1.5 text-[#4caf60]"><Clock size={13} />2 In Progress</span>
                        <span className="flex items-center gap-1.5 rounded-md bg-[#fff3b5] px-2.5 py-1.5 text-[#ae8e55]"><Circle size={13} fill="currentColor" className="text-[#facc15]" />1 Not Started</span>
                        <span className="flex items-center gap-1.5 rounded-md bg-white border border-neutral-200 px-2.5 py-1.5 text-neutral-500"><MinusCircle size={13} />0 N/A</span>
                      </div>
                    </div>
                  </div>
                </motion.section>
              </>
            )}

            {/* TAB: Client Tracker */}
            {activeTab === 'Client Tracker' && (
              <motion.section variants={itemVariants}>
                <div className="mt-2">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <label className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Search Clients..."
                          value={clientSearch}
                          onChange={(e) => {
                            setClientSearch(e.target.value)
                            setCurrentPage(1)
                          }}
                          className="w-[180px] sm:w-[240px] rounded-lg bg-[#f8f9fa] py-2 pl-9 pr-3 text-[12px] focus:outline-none transition-all hover:bg-neutral-100 border border-neutral-100"
                        />
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-medium text-neutral-600 hover:bg-neutral-100 border border-neutral-100 focus:outline-none cursor-pointer"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Live">Live (Production)</option>
                        <option value="Staging">Staging</option>
                        <option value="Dev">Dev</option>
                      </select>
                      <select
                        value={priorityFilter}
                        onChange={(e) => {
                          setPriorityFilter(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-medium text-neutral-600 hover:bg-neutral-100 border border-neutral-100 focus:outline-none cursor-pointer"
                      >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <ColumnsDropdown />
                      <button
                        type="button"
                        onClick={openImport}
                        className="flex items-center gap-1.5 rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-bold text-neutral-800 hover:bg-neutral-200 border border-neutral-100 cursor-pointer transition-colors"
                        title="Import or Export client spreadsheets"
                      >
                        Import <Download size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={openAddClient}
                        className="flex items-center gap-1.5 rounded-lg bg-[#ef3340] px-3.5 py-2 text-[11.5px] font-bold text-white shadow-sm hover:bg-red-600 cursor-pointer transition-colors"
                        title="Add a new client to portfolio"
                      >
                        Add Client <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  {/* Table with Horizontal Scroll */}
                  <div className="w-full overflow-x-auto custom-scrollbar pb-3">
                    <div className="min-w-[1050px]">
                      <table className="w-full text-left text-[11.5px] border-separate border-spacing-y-2.5">
                        <thead>
                          <tr className="bg-[#fff1f2] text-neutral-700">
                            {visibleColumns.client && (
                              <th
                                onClick={() => {
                                  if (sortField === 'name') setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
                                  else {
                                    setSortField('name')
                                    setSortOrder('asc')
                                  }
                                }}
                                className="px-4 py-3.5 font-semibold rounded-l-[12px] whitespace-nowrap cursor-pointer hover:bg-red-100/60 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span>Client</span>
                                  <ArrowUpDown size={12} className={sortField === 'name' ? 'text-[#ef3340]' : 'text-neutral-400'} />
                                </div>
                              </th>
                            )}
                            {visibleColumns.tech && (
                              <th
                                onClick={() => {
                                  if (sortField === 'tech') setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
                                  else {
                                    setSortField('tech')
                                    setSortOrder('asc')
                                  }
                                }}
                                className="px-4 py-3.5 font-semibold whitespace-nowrap cursor-pointer hover:bg-red-100/60 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span>Technology</span>
                                  <ArrowUpDown size={12} className={sortField === 'tech' ? 'text-[#ef3340]' : 'text-neutral-400'} />
                                </div>
                              </th>
                            )}
                            {visibleColumns.env && (
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Environment</th>
                            )}
                            {visibleColumns.ordering && (
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Embedded Ordering</th>
                            )}
                            {visibleColumns.qa && (
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap">QA Sign-off</th>
                            )}
                            {visibleColumns.stage && (
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Stage</th>
                            )}
                            {visibleColumns.status && (
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Status</th>
                            )}
                            {visibleColumns.priority && (
                              <th
                                onClick={() => {
                                  if (sortField === 'priority') setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
                                  else {
                                    setSortField('priority')
                                    setSortOrder('asc')
                                  }
                                }}
                                className="px-4 py-3.5 font-semibold whitespace-nowrap cursor-pointer hover:bg-red-100/60 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span>Priority</span>
                                  <ArrowUpDown size={12} className={sortField === 'priority' ? 'text-[#ef3340]' : 'text-neutral-400'} />
                                </div>
                              </th>
                            )}
                            {visibleColumns.migration && (
                              <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Migration</th>
                            )}
                            {visibleColumns.actions && (
                              <th className="px-4 py-3.5 font-semibold rounded-r-[12px] whitespace-nowrap text-center">Actions</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedClients.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="text-center py-10 text-neutral-400 text-xs">
                                No clients matching your search criteria.
                              </td>
                            </tr>
                          ) : (
                            paginatedClients.map((c) => (
                              <tr key={c.id} className="bg-[#f8f9fa] hover:bg-neutral-100 transition-colors group">
                                {visibleColumns.client && (
                                  <td className="px-4 py-3.5 rounded-l-[12px] whitespace-nowrap">
                                    <p className="font-bold text-neutral-900 text-[12px]">{c.name}</p>
                                    <p className="text-neutral-400 mt-0.5 text-[10px]">{c.country} • {c.domain || 'no domain'}</p>
                                  </td>
                                )}
                                {visibleColumns.tech && (
                                  <td className="px-4 py-3.5 whitespace-nowrap">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10.5px] font-medium ${c.techStyle}`}>
                                      {c.tech}
                                    </span>
                                  </td>
                                )}
                                {visibleColumns.env && (
                                  <td className="px-4 py-3.5 whitespace-nowrap">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10.5px] font-medium ${c.envStyle}`}>
                                      {c.env}
                                    </span>
                                  </td>
                                )}
                                {visibleColumns.ordering && (
                                  <td className="px-4 py-3.5 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <span className={`h-1.5 w-1.5 rounded-full ${c.ordering.dot}`} />
                                      <span className="font-medium" style={{ color: c.ordering.color }}>
                                        {c.ordering.label}
                                      </span>
                                    </div>
                                  </td>
                                )}
                                {visibleColumns.qa && (
                                  <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-neutral-700">{c.qa}</td>
                                )}
                                {visibleColumns.stage && (
                                  <td className="px-4 py-3.5 whitespace-nowrap">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10.5px] font-medium ${c.stage.style}`}>
                                      {c.stage.label}
                                    </span>
                                  </td>
                                )}
                                {visibleColumns.status && (
                                  <td className="px-4 py-3.5 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <span className={`h-1.5 w-1.5 rounded-full ${c.status.dot}`} />
                                      <span className="font-medium" style={{ color: c.status.color }}>
                                        {c.status.label}
                                      </span>
                                    </div>
                                  </td>
                                )}
                                {visibleColumns.priority && (
                                  <td className="px-4 py-3.5 whitespace-nowrap">
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium ${
                                        c.priority === 'High'
                                          ? 'bg-[#fce8e8] text-[#ef3340]'
                                          : c.priority === 'Medium'
                                          ? 'bg-[#ffeed9] text-[#e27b4e]'
                                          : 'bg-[#e5f4e8] text-[#4caf60]'
                                      }`}
                                    >
                                      {c.priority}
                                    </span>
                                  </td>
                                )}
                                {visibleColumns.migration && (
                                  <td className="px-4 py-3.5 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <span className={`h-1.5 w-1.5 rounded-full ${c.migration.dot}`} />
                                      <span className="font-medium" style={{ color: c.migration.color }}>
                                        {c.migration.label}
                                      </span>
                                    </div>
                                  </td>
                                )}
                                {visibleColumns.actions && (
                                  <td className="px-4 py-3.5 rounded-r-[12px] whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2.5">
                                      <button
                                        type="button"
                                        onClick={() => setSelectedClient(c)}
                                        className="text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                                        title="View Client Details"
                                      >
                                        <Eye size={15} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedClient(c)}
                                        className="text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                                        title="Edit Client"
                                      >
                                        <Pencil size={14} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete ${c.name}?`)) {
                                            deleteClient(c.id)
                                          }
                                        }}
                                        className="text-[#ef3340] hover:text-red-700 transition-colors cursor-pointer"
                                        title="Delete Client"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Working Interactive Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredClients.length}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                    pageSizeOptions={[4, 8, 10, 20]}
                  />
                </div>
              </motion.section>
            )}

            {/* TAB: Features */}
            {activeTab === 'Features' && (
              <motion.section variants={itemVariants}>
                <div className="mt-2">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <label className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                          type="text" 
                          value={featuresSearch}
                          onChange={(e) => setFeaturesSearch(e.target.value)}
                          placeholder="Search Capabilities..." 
                          className="w-[180px] sm:w-[240px] rounded-lg bg-[#f8f9fa] py-2 pl-9 pr-3 text-[12px] focus:outline-none transition-all hover:bg-neutral-100 border border-neutral-100 focus:bg-white" 
                        />
                      </label>
                      <select
                        value={featuresCapability}
                        onChange={(e) => setFeaturesCapability(e.target.value)}
                        className="rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-medium text-neutral-600 hover:bg-neutral-100 border border-neutral-100 cursor-pointer focus:outline-none"
                      >
                        <option value="All">All Capabilities</option>
                        <option value="Embedded Ordering">Embedded Ordering</option>
                        <option value="Offers">Offers</option>
                        <option value="Loyalty">Loyalty</option>
                        <option value="Reservation">Reservation</option>
                        <option value="Event Ordering">Event Ordering</option>
                      </select>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFeaturesList(adminFeaturesData)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-bold text-neutral-700 hover:bg-neutral-200 border border-neutral-100 cursor-pointer transition-colors"
                      title="Reset features to default"
                    >
                      Reset Default
                    </button>
                  </div>

                  {/* Table Wrapper */}
                  <div className="w-full overflow-x-auto custom-scrollbar pb-3">
                    <div className="min-w-[950px]">
                      <table className="w-full text-center text-[11.5px] border-separate border-spacing-y-2.5">
                        <thead>
                          <tr className="bg-[#fff1f2] text-neutral-700">
                            <th className="px-5 py-3.5 font-semibold text-left rounded-l-[12px] whitespace-nowrap"><div className="flex items-center gap-2">Client <ArrowUp size={12} className="text-neutral-800" /></div></th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Embedded Ordering</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Offers</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Loyalty</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Reservation</th>
                            <th className="px-5 py-3.5 font-semibold rounded-r-[12px] whitespace-nowrap">Event Ordering</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredFeatures.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center py-8 text-neutral-400 bg-[#f8f9fa] rounded-xl font-medium">
                                No clients match your feature search filter.
                              </td>
                            </tr>
                          ) : (
                            filteredFeatures.map((f, i) => (
                              <tr key={i} className="bg-[#f8f9fa] hover:bg-neutral-100 transition-colors group">
                                <td className="px-5 py-3.5 text-left rounded-l-[12px] whitespace-nowrap">
                                  <p className="font-bold text-neutral-900 text-[12px]">{f.client}</p>
                                  <p className="text-neutral-400 mt-0.5 text-[10px]">{f.country}</p>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => toggleFeature(i, 'emb')}
                                    title="Click to toggle status"
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition-all hover:scale-105 cursor-pointer ${
                                      f.emb === 'Active' ? 'bg-[#e5f4e8] text-[#22c55e]' : f.emb === 'In Progress' ? 'bg-[#fffbeb] text-[#f59e0b]' : 'bg-neutral-100 text-neutral-400'
                                    }`}
                                  >
                                    {f.emb}
                                  </button>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => toggleFeature(i, 'offers')}
                                    title="Click to toggle status"
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition-all hover:scale-105 cursor-pointer ${
                                      f.offers === 'Enabled' ? 'bg-[#e5f4e8] text-[#22c55e]' : f.offers === 'In Progress' ? 'bg-[#fffbeb] text-[#f59e0b]' : 'bg-neutral-100 text-neutral-400'
                                    }`}
                                  >
                                    {f.offers}
                                  </button>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => toggleFeature(i, 'loyalty')}
                                    title="Click to toggle status"
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition-all hover:scale-105 cursor-pointer ${
                                      f.loyalty === 'Enabled' ? 'bg-[#e5f4e8] text-[#22c55e]' : f.loyalty === 'In Progress' ? 'bg-[#fffbeb] text-[#f59e0b]' : 'bg-neutral-100 text-neutral-400'
                                    }`}
                                  >
                                    {f.loyalty}
                                  </button>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => toggleFeature(i, 'reservation')}
                                    title="Click to toggle status"
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition-all hover:scale-105 cursor-pointer ${
                                      f.reservation === 'Enabled' ? 'bg-[#e5f4e8] text-[#22c55e]' : f.reservation === 'In Progress' ? 'bg-[#fffbeb] text-[#f59e0b]' : 'bg-neutral-100 text-neutral-400'
                                    }`}
                                  >
                                    {f.reservation}
                                  </button>
                                </td>
                                <td className="px-5 py-3.5 rounded-r-[12px] whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => toggleFeature(i, 'event')}
                                    title="Click to toggle status"
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition-all hover:scale-105 cursor-pointer ${
                                      f.event === 'Enabled' ? 'bg-[#e5f4e8] text-[#22c55e]' : f.event === 'In Progress' ? 'bg-[#fffbeb] text-[#f59e0b]' : 'bg-neutral-100 text-neutral-400'
                                    }`}
                                  >
                                    {f.event}
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* TAB: Migration */}
            {activeTab === 'Migration' && (
              <motion.section variants={itemVariants}>
                <div className="mt-2">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <label className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                          type="text" 
                          value={migrationSearch}
                          onChange={(e) => setMigrationSearch(e.target.value)}
                          placeholder="Search Migrations..." 
                          className="w-[180px] sm:w-[240px] rounded-lg bg-[#f8f9fa] py-2 pl-9 pr-3 text-[12px] focus:outline-none transition-all hover:bg-neutral-100 border border-neutral-100 focus:bg-white" 
                        />
                      </label>
                      <select
                        value={migrationStatus}
                        onChange={(e) => setMigrationStatus(e.target.value)}
                        className="rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-medium text-neutral-600 hover:bg-neutral-100 border border-neutral-100 cursor-pointer focus:outline-none"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Completed">Completed</option>
                        <option value="Testing">Testing</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Planning">Planning</option>
                      </select>
                      <select
                        value={migrationQuarter}
                        onChange={(e) => setMigrationQuarter(e.target.value)}
                        className="rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-medium text-neutral-600 hover:bg-neutral-100 border border-neutral-100 cursor-pointer focus:outline-none"
                      >
                        <option value="All">All Quarters</option>
                        <option value="Q3 2026">Q3 2026</option>
                        <option value="Q4 2026">Q4 2026</option>
                        <option value="Q1 2027">Q1 2027</option>
                      </select>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setMigrationList(migrationAdminData)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-bold text-neutral-700 hover:bg-neutral-200 border border-neutral-100 cursor-pointer transition-colors"
                    >
                      Reset Default
                    </button>
                  </div>

                  {/* Table with Horizontal Scroll */}
                  <div className="w-full overflow-x-auto custom-scrollbar pb-3">
                    <div className="min-w-[950px]">
                      <table className="w-full text-center text-[11.5px] border-separate border-spacing-y-2.5">
                        <thead>
                          <tr className="bg-[#fff1f2] text-neutral-700">
                            <th className="px-5 py-3.5 font-semibold text-left rounded-l-[12px] whitespace-nowrap"><div className="flex items-center gap-2">Client <ArrowUpDown size={12} className="text-neutral-400" /></div></th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Current Stack</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Target Stack</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Status</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Quarter</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Priority</th>
                            <th className="px-5 py-3.5 font-semibold rounded-r-[12px] whitespace-nowrap">Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMigrations.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-8 text-neutral-400 bg-[#f8f9fa] rounded-xl font-medium">
                                No migrations match your search criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredMigrations.map((m, i) => (
                              <tr key={i} className="bg-[#f8f9fa] hover:bg-neutral-100 transition-colors group">
                                <td className="px-5 py-3.5 text-left rounded-l-[12px] whitespace-nowrap font-bold text-neutral-900">
                                  {m.client}
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap text-neutral-600 font-medium">
                                  <span className="inline-block rounded-md bg-white border border-neutral-200 px-2 py-0.5 text-[10.5px]">
                                    {m.currentStack}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap font-medium text-neutral-800">
                                  <span className="inline-block rounded-md bg-neutral-900 text-white px-2 py-0.5 text-[10.5px]">
                                    {m.targetStack}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => advanceMigration(i)}
                                    title="Click to advance stage"
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold transition-all hover:scale-105 cursor-pointer ${
                                      m.status === 'Completed' ? 'bg-[#e5f4e8] text-[#22c55e]' : m.status === 'Testing' ? 'bg-[#fce8e8] text-[#ef3340]' : m.status === 'In Progress' ? 'bg-[#fffbeb] text-[#f59e0b]' : 'bg-neutral-100 text-neutral-500'
                                    }`}
                                  >
                                    {m.status}
                                  </button>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap text-neutral-500 font-medium">
                                  {m.quarter}
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                    m.priority === 'High' ? 'bg-[#fce8e8] text-[#ef3340]' : m.priority === 'Medium' ? 'bg-[#ffeed9] text-[#e27b4e]' : 'bg-[#e5f4e8] text-[#4caf60]'
                                  }`}>
                                    {m.priority}
                                  </span>
                                </td>
                                <td className="px-5 py-3.5 rounded-r-[12px] whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-16 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                                      <div className="h-full bg-[#ef3340] rounded-full" style={{ width: `${m.progress}%` }} />
                                    </div>
                                    <span className="font-bold text-[10.5px] text-neutral-700">{m.progress}%</span>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* TAB: Priorities */}
            {activeTab === 'Priorities' && (
              <motion.section variants={itemVariants}>
                <div className="mt-2">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <label className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                          type="text" 
                          value={prioritiesSearch}
                          onChange={(e) => {
                            setPrioritiesSearch(e.target.value)
                            setPrioritiesPage(1)
                          }}
                          placeholder="Search Task..." 
                          className="w-[180px] sm:w-[240px] rounded-lg bg-[#f8f9fa] py-2 pl-9 pr-3 text-[12px] focus:outline-none transition-all hover:bg-neutral-100 border border-neutral-100 focus:bg-white" 
                        />
                      </label>
                      <select
                        value={prioritiesStatus}
                        onChange={(e) => {
                          setPrioritiesStatus(e.target.value)
                          setPrioritiesPage(1)
                        }}
                        className="rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-medium text-neutral-600 hover:bg-neutral-100 border border-neutral-100 cursor-pointer focus:outline-none"
                      >
                        <option value="All">All Statuses</option>
                        <option value="In progress">In progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Review">Review</option>
                        <option value="Block">Block</option>
                      </select>
                      <select
                        value={prioritiesPriority}
                        onChange={(e) => {
                          setPrioritiesPriority(e.target.value)
                          setPrioritiesPage(1)
                        }}
                        className="rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-medium text-neutral-600 hover:bg-neutral-100 border border-neutral-100 cursor-pointer focus:outline-none"
                      >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <button 
                        type="button"
                        onClick={() => setIsAddPriorityOpen(true)}
                        className="flex items-center gap-1.5 rounded-lg bg-[#ef3340] px-3.5 py-2 text-[11.5px] font-bold text-white shadow-sm hover:bg-red-600 cursor-pointer transition-colors active:scale-95"
                      >
                        Add Priority <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  {/* Table with Horizontal Scroll */}
                  <div className="w-full overflow-x-auto custom-scrollbar pb-3">
                    <div className="min-w-[950px]">
                      <table className="w-full text-center text-[11.5px] border-separate border-spacing-y-2.5">
                        <thead>
                          <tr className="bg-[#fff1f2] text-neutral-700">
                            <th className="px-5 py-3.5 font-semibold text-left rounded-l-[12px] whitespace-nowrap"><div className="flex items-center gap-2">Task <ArrowUpDown size={12} className="text-neutral-400" /></div></th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Week</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Priority</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Due Date</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Status</th>
                            <th className="px-5 py-3.5 font-semibold rounded-r-[12px] whitespace-nowrap">Assignee</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedPriorities.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center py-8 text-neutral-400 bg-[#f8f9fa] rounded-xl font-medium">
                                No priority tasks match your search filters.
                              </td>
                            </tr>
                          ) : (
                            paginatedPriorities.map((row, i) => (
                              <tr key={i} className="bg-[#f8f9fa] hover:bg-neutral-100 transition-colors group">
                                <td className="px-5 py-3.5 text-left rounded-l-[12px] whitespace-nowrap">
                                  <div>
                                    <p className="font-bold text-neutral-900 text-[12px]">{row.title}</p>
                                    <p className="text-neutral-400 mt-0.5 text-[10.5px]">{row.subtitle}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap font-medium text-neutral-500">
                                  {row.week}
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <div className="flex justify-center">
                                    {row.priority === 'High' && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fce8e8] px-2.5 py-1 text-[10.5px] font-medium text-[#ef3340]">
                                        <ArrowUp size={12} />High
                                      </span>
                                    )}
                                    {row.priority === 'Medium' && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ffedd5] px-2.5 py-1 text-[10.5px] font-medium text-[#f97316]">
                                        <Minus size={12} />Medium
                                      </span>
                                    )}
                                    {row.priority === 'Low' && (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-2.5 py-1 text-[10.5px] font-medium text-[#22c55e]">
                                        <ArrowDown size={12} />Low
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <div className="flex flex-col items-center justify-center leading-tight">
                                    <span className={`font-semibold ${row.overdue ? 'text-[#ef3340]' : 'text-neutral-900'}`}>{row.date}</span>
                                    {row.overdue && <span className="text-[10px] font-medium text-[#ef3340]">Over Due</span>}
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-2">
                                    {row.status === 'Review' && (
                                      <><span className="h-1.5 w-1.5 rounded-full bg-neutral-400" /><span className="font-medium text-neutral-400">Review</span></>
                                    )}
                                    {row.status === 'In progress' && (
                                      <><span className="h-1.5 w-1.5 rounded-full bg-[#eab308]" /><span className="font-medium text-[#eab308]">In progress</span></>
                                    )}
                                    {row.status === 'Completed' && (
                                      <><span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" /><span className="font-medium text-[#22c55e]">Completed</span></>
                                    )}
                                    {row.status === 'Block' && (
                                      <><span className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" /><span className="font-medium text-[#ef4444]">Block</span></>
                                    )}
                                  </div>
                                </td>
                                <td className="px-5 py-3.5 rounded-r-[12px] whitespace-nowrap font-medium text-neutral-600">
                                  {row.assignee}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Working Priorities Pagination */}
                  <Pagination
                    currentPage={prioritiesPage}
                    totalItems={filteredPriorities.length}
                    pageSize={prioritiesPageSize}
                    onPageChange={setPrioritiesPage}
                    onPageSizeChange={setPrioritiesPageSize}
                    pageSizeOptions={[3, 4, 7, 10]}
                  />
                </div>
              </motion.section>
            )}

            {/* TAB: Websites */}
            {activeTab === 'Websites' && (
              <motion.section variants={itemVariants}>
                <div className="mt-2">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <label className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input 
                          type="text" 
                          value={websitesSearch}
                          onChange={(e) => {
                            setWebsitesSearch(e.target.value)
                            setWebsitesPage(1)
                          }}
                          placeholder="Search Websites..." 
                          className="w-[180px] sm:w-[240px] rounded-lg bg-[#f8f9fa] py-2 pl-9 pr-3 text-[12px] focus:outline-none transition-all hover:bg-neutral-100 border border-neutral-100 focus:bg-white" 
                        />
                      </label>
                      <select
                        value={websitesFramework}
                        onChange={(e) => {
                          setWebsitesFramework(e.target.value)
                          setWebsitesPage(1)
                        }}
                        className="rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-medium text-neutral-600 hover:bg-neutral-100 border border-neutral-100 cursor-pointer focus:outline-none"
                      >
                        <option value="All">All Frameworks</option>
                        <option value="Next.js">Next.js</option>
                        <option value="React.js">React.js</option>
                      </select>
                      <select
                        value={websitesOrdering}
                        onChange={(e) => {
                          setWebsitesOrdering(e.target.value)
                          setWebsitesPage(1)
                        }}
                        className="rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-medium text-neutral-600 hover:bg-neutral-100 border border-neutral-100 cursor-pointer focus:outline-none"
                      >
                        <option value="All">All Ordering Statuses</option>
                        <option value="Live">Live</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Not Started">Not Started</option>
                      </select>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setWebsitesList(websites)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#f8f9fa] px-3 py-2 text-[11.5px] font-bold text-neutral-700 hover:bg-neutral-200 border border-neutral-100 cursor-pointer transition-colors"
                    >
                      Reset Default
                    </button>
                  </div>

                  {/* Table with Horizontal Scroll */}
                  <div className="w-full overflow-x-auto custom-scrollbar pb-3">
                    <div className="min-w-[950px]">
                      <table className="w-full text-center text-[11.5px] border-separate border-spacing-y-2.5">
                        <thead>
                          <tr className="bg-[#fff1f2] text-neutral-700">
                            <th className="px-5 py-3.5 font-semibold text-left rounded-l-[12px] whitespace-nowrap"><div className="flex items-center gap-2">Website <ArrowUpDown size={12} className="text-neutral-400" /></div></th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Domain</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Client</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Framework</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Ordering Status</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">Environment</th>
                            <th className="px-4 py-3.5 font-semibold whitespace-nowrap">QA Sign-off</th>
                            <th className="px-5 py-3.5 font-semibold rounded-r-[12px] whitespace-nowrap">Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedWebsites.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="text-center py-8 text-neutral-400 bg-[#f8f9fa] rounded-xl font-medium">
                                No websites match your search criteria.
                              </td>
                            </tr>
                          ) : (
                            paginatedWebsites.map((w, i) => (
                              <tr key={i} className="bg-[#f8f9fa] hover:bg-neutral-100 transition-colors group">
                                <td className="px-5 py-3.5 text-left rounded-l-[12px] whitespace-nowrap font-bold text-neutral-900">
                                  {w.name}
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap font-medium text-neutral-400">
                                  {w.domain}
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap font-medium text-neutral-700">
                                  {w.client}
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10.5px] font-medium ${w.framework === 'Next.js' ? 'bg-neutral-900 text-white' : 'bg-[#3b82f6] text-white'}`}>
                                    {w.framework}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-2">
                                    <span className={`h-1.5 w-1.5 rounded-full ${w.ordering === 'Live' ? 'bg-[#22c55e]' : w.ordering === 'In Progress' ? 'bg-[#d4af37]' : 'bg-neutral-400'}`} />
                                    <span className={`font-medium ${w.ordering === 'Live' ? 'text-[#22c55e]' : w.ordering === 'In Progress' ? 'text-[#d4af37]' : 'text-neutral-500'}`}>
                                      {w.ordering}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10.5px] font-medium ${w.env === 'Production' ? 'bg-[#e5f4e8] text-[#4caf60]' : w.env === 'Staging' ? 'bg-[#ffeed9] text-[#e27b4e]' : 'bg-[#ede9fe] text-[#7c3aed]'}`}>
                                    {w.env}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-neutral-700">
                                  {w.qa}
                                </td>
                                <td className="px-5 py-3.5 rounded-r-[12px] whitespace-nowrap font-medium text-neutral-400">
                                  {w.updated}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Working Websites Pagination */}
                  <Pagination
                    currentPage={websitesPage}
                    totalItems={filteredWebsites.length}
                    pageSize={websitesPageSize}
                    onPageChange={setWebsitesPage}
                    onPageSizeChange={setWebsitesPageSize}
                    pageSizeOptions={[3, 4, 7, 10]}
                  />
                </div>
              </motion.section>
            )}
          </motion.main>
        </div>
      </div>

      {/* ── Add Priority Modal ── */}
      <AnimatePresence>
        {isAddPriorityOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-neutral-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-[#ef3340]">
                    <Plus size={16} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-neutral-900">Add Priority Task</h3>
                    <p className="text-[11px] text-neutral-500">Insert task into Admin Priorities Queue</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddPriorityOpen(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddPriority} className="space-y-3.5 text-[12px]">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Task Title / Website</label>
                  <input
                    type="text"
                    required
                    value={newPrioTitle}
                    onChange={(e) => setNewPrioTitle(e.target.value)}
                    placeholder="e.g. Pakka Spice Romeoville"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Category / Subtitle</label>
                  <select
                    value={newPrioSubtitle}
                    onChange={(e) => setNewPrioSubtitle(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                  >
                    <option value="Embedded Ordering">Embedded Ordering</option>
                    <option value="Migration">Migration</option>
                    <option value="Event Ordering">Event Ordering</option>
                    <option value="Reservation">Reservation</option>
                    <option value="Bug Fix">Bug Fix</option>
                    <option value="QA Sign-off">QA Sign-off</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Priority</label>
                    <select
                      value={newPrioPriority}
                      onChange={(e) => setNewPrioPriority(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Status</label>
                    <select
                      value={newPrioStatus}
                      onChange={(e) => setNewPrioStatus(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                    >
                      <option value="In progress">In progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Review">Review</option>
                      <option value="Block">Block</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Due Date</label>
                    <input
                      type="text"
                      value={newPrioDate}
                      onChange={(e) => setNewPrioDate(e.target.value)}
                      placeholder="e.g. Nov 15, 2026"
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Assignee</label>
                    <input
                      type="text"
                      value={newPrioAssignee}
                      onChange={(e) => setNewPrioAssignee(e.target.value)}
                      placeholder="e.g. Yoga"
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddPriorityOpen(false)}
                    className="rounded-lg bg-neutral-100 px-3.5 py-1.5 text-[11.5px] font-semibold text-neutral-700 hover:bg-neutral-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#ef3340] hover:bg-red-600 text-white px-4 py-1.5 text-[11.5px] font-semibold transition-colors cursor-pointer"
                  >
                    Add Priority
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
