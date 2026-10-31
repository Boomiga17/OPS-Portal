import { useState } from 'react'
import { 
  Tag, Heart, Sparkles, CalendarDays, Check, Settings2, Minus, Search, RotateCcw
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import offersImg from '../assets/Offers.png'
import loyaltyImg from '../assets/Loyalty.png'
import eventImg from '../assets/Event.png'
import reservationImg from '../assets/Reservation.png'

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

type FeatureStatus = 'enabled' | 'progress' | 'na'

interface ClientFeatureRow {
  id: string
  name: string
  country: string
  offers: FeatureStatus
  loyalty: FeatureStatus
  events: FeatureStatus
  reservation: FeatureStatus
}

const initialMatrixClients: ClientFeatureRow[] = [
  { id: '1', name: 'Amudham Restaurant', country: 'USA', offers: 'enabled', loyalty: 'enabled', events: 'progress', reservation: 'enabled' },
  { id: '2', name: 'Bheema Next.js', country: 'USA', offers: 'enabled', loyalty: 'enabled', events: 'enabled', reservation: 'enabled' },
  { id: '3', name: 'Sangam Restaurant', country: 'USA', offers: 'progress', loyalty: 'progress', events: 'na', reservation: 'enabled' },
  { id: '4', name: 'Manam Onam', country: 'UAE', offers: 'enabled', loyalty: 'progress', events: 'enabled', reservation: 'progress' },
  { id: '5', name: 'Aaha Kitchen', country: 'UK', offers: 'enabled', loyalty: 'enabled', events: 'na', reservation: 'na' },
  { id: '6', name: 'Monks Allen', country: 'USA', offers: 'na', loyalty: 'na', events: 'na', reservation: 'na' },
  { id: '7', name: 'Pakka Spice Romeoville', country: 'USA', offers: 'enabled', loyalty: 'progress', events: 'enabled', reservation: 'progress' },
  { id: '8', name: 'Madurai Kitchen', country: 'USA', offers: 'enabled', loyalty: 'enabled', events: 'progress', reservation: 'enabled' },
]

function StatusCell({ 
  status, 
  onClick 
}: { 
  status: FeatureStatus
  onClick?: () => void 
}) {
  if (status === 'enabled') {
    return (
      <button 
        type="button"
        onClick={onClick}
        title="Click to toggle status"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#e5f4e8] px-2.5 py-1 text-[10.5px] font-semibold text-[#22c55e] hover:ring-2 hover:ring-[#22c55e]/30 transition-all cursor-pointer"
      >
        <Check size={12} strokeWidth={3} /> Enabled
      </button>
    )
  }
  if (status === 'progress') {
    return (
      <button 
        type="button"
        onClick={onClick}
        title="Click to toggle status"
        className="inline-flex items-center gap-1.5 rounded-full bg-[#fffbeb] px-2.5 py-1 text-[10.5px] font-semibold text-[#f59e0b] hover:ring-2 hover:ring-[#f59e0b]/30 transition-all cursor-pointer"
      >
        <Settings2 size={12} /> In Progress
      </button>
    )
  }
  return (
    <button 
      type="button"
      onClick={onClick}
      title="Click to toggle status"
      className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[10.5px] font-medium text-neutral-400 hover:ring-2 hover:ring-neutral-300 transition-all cursor-pointer"
    >
      <Minus size={12} strokeWidth={3} /> N/A
    </button>
  )
}

export default function FeaturesPage() {
  const [matrixClients, setMatrixClients] = useState<ClientFeatureRow[]>(initialMatrixClients)
  const [searchQuery, setSearchQuery] = useState('')
  const [featureFilter, setFeatureFilter] = useState<'all' | 'offers' | 'loyalty' | 'events' | 'reservation'>('all')

  const toggleFeature = (clientId: string, field: 'offers' | 'loyalty' | 'events' | 'reservation') => {
    setMatrixClients(prev => prev.map(c => {
      if (c.id !== clientId) return c
      const current = c[field]
      const next: FeatureStatus = current === 'enabled' ? 'progress' : current === 'progress' ? 'na' : 'enabled'
      return { ...c, [field]: next }
    }))
  }

  // Calculate live counts
  const total = matrixClients.length || 1
  const offersCount = matrixClients.filter(c => c.offers === 'enabled').length
  const offersPercent = ((offersCount / total) * 100).toFixed(1)

  const loyaltyCount = matrixClients.filter(c => c.loyalty === 'enabled').length
  const loyaltyPercent = ((loyaltyCount / total) * 100).toFixed(1)

  const eventsCount = matrixClients.filter(c => c.events === 'enabled').length
  const eventsPercent = ((eventsCount / total) * 100).toFixed(1)

  const reservationCount = matrixClients.filter(c => c.reservation === 'enabled').length
  const reservationPercent = ((reservationCount / total) * 100).toFixed(1)

  const filteredClients = matrixClients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.country.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchSearch) return false
    if (featureFilter === 'offers') return c.offers === 'enabled'
    if (featureFilter === 'loyalty') return c.loyalty === 'enabled'
    if (featureFilter === 'events') return c.events === 'enabled'
    if (featureFilter === 'reservation') return c.reservation === 'enabled'
    return true
  })

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f1f3f5] font-sans text-[12px] p-2.5 sm:p-4 gap-4 lg:gap-6">
      {/* Sidebar (Desktop sticky + Mobile drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 py-1 min-w-0">
        <div className="w-full pb-10">
          {/* Responsive Header */}
          <Header title="Brisque OPS" subtitle="Operations Command Center" searchPlaceholder="Search Features..." />

          {/* Main Dashboard Blocks */}
          <motion.main 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="rounded-[16px] bg-white p-4 sm:p-6 shadow-sm space-y-6 sm:space-y-8"
          >
            {/* Features Rollout Section */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] sm:text-[18px] font-bold text-neutral-900">Features</h2>
                  <p className="mt-1 text-[12px] sm:text-[13px] text-neutral-500">Rollout status for Offers, Loyalty, Reservation and Event Ordering across the client portfolio</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMatrixClients(initialMatrixClients)}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                  title="Reset to default matrix"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>
              
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Offer Card */}
                <div 
                  onClick={() => setFeatureFilter(f => f === 'offers' ? 'all' : 'offers')}
                  className={`relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#fffdf0] to-[#fff8c4] p-4 sm:p-5 shadow-sm border transition-all cursor-pointer ${
                    featureFilter === 'offers' ? 'border-[#eab308] ring-2 ring-[#eab308]/40 scale-[1.02]' : 'border-[#fde68a] hover:border-[#facc15]'
                  }`}
                >
                  <img src={offersImg} alt="Offers" className="absolute right-0 top-0 h-[120%] w-auto object-cover opacity-80 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-[#eab308] shadow-sm">
                      <Tag size={14} />
                    </div>
                    <p className="mt-3 text-[24px] sm:text-[26px] font-bold leading-none text-neutral-900">{offersCount}</p>
                    <p className="mt-1 font-bold text-[13px] text-neutral-900">Offers</p>
                    <p className="mt-0.5 text-[10px] text-neutral-600">Promotional offers enabled</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-[#fde047]/40 overflow-hidden">
                        <div className="h-full rounded-full bg-[#eab308] transition-all duration-500" style={{ width: `${offersPercent}%` }} />
                      </div>
                      <span className="text-[10.5px] font-bold text-neutral-800">{offersPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Loyalty Card */}
                <div 
                  onClick={() => setFeatureFilter(f => f === 'loyalty' ? 'all' : 'loyalty')}
                  className={`relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] p-4 sm:p-5 shadow-sm border transition-all cursor-pointer ${
                    featureFilter === 'loyalty' ? 'border-[#22c55e] ring-2 ring-[#22c55e]/40 scale-[1.02]' : 'border-[#bbf7d0] hover:border-[#86efac]'
                  }`}
                >
                  <img src={loyaltyImg} alt="Loyalty" className="absolute right-0 top-0 h-[120%] w-auto object-cover opacity-80 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-[#22c55e] shadow-sm">
                      <Heart size={14} />
                    </div>
                    <p className="mt-3 text-[24px] sm:text-[26px] font-bold leading-none text-neutral-900">{loyaltyCount}</p>
                    <p className="mt-1 font-bold text-[13px] text-neutral-900">Loyalty</p>
                    <p className="mt-0.5 text-[10px] text-neutral-600">Loyalty rewards active</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-[#86efac]/40 overflow-hidden">
                        <div className="h-full rounded-full bg-[#22c55e] transition-all duration-500" style={{ width: `${loyPercent(loyaltyCount, total)}%` }} />
                      </div>
                      <span className="text-[10.5px] font-bold text-neutral-800">{loyaltyPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Event Ordering Card */}
                <div 
                  onClick={() => setFeatureFilter(f => f === 'events' ? 'all' : 'events')}
                  className={`relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] p-4 sm:p-5 shadow-sm border transition-all cursor-pointer ${
                    featureFilter === 'events' ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/40 scale-[1.02]' : 'border-[#bfdbfe] hover:border-[#93c5fd]'
                  }`}
                >
                  <img src={eventImg} alt="Event Ordering" className="absolute right-0 top-0 h-[120%] w-auto object-cover opacity-80 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-[#3b82f6] shadow-sm">
                      <Sparkles size={14} />
                    </div>
                    <p className="mt-3 text-[24px] sm:text-[26px] font-bold leading-none text-neutral-900">{eventsCount}</p>
                    <p className="mt-1 font-bold text-[13px] text-neutral-900">Event Ordering</p>
                    <p className="mt-0.5 text-[10px] text-neutral-600">Catering & bulk event ordering</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-[#93c5fd]/40 overflow-hidden">
                        <div className="h-full rounded-full bg-[#3b82f6] transition-all duration-500" style={{ width: `${eventsPercent}%` }} />
                      </div>
                      <span className="text-[10.5px] font-bold text-neutral-800">{eventsPercent}%</span>
                    </div>
                  </div>
                </div>

                {/* Reservation Card */}
                <div 
                  onClick={() => setFeatureFilter(f => f === 'reservation' ? 'all' : 'reservation')}
                  className={`relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#fff1f2] to-[#ffe4e6] p-4 sm:p-5 shadow-sm border transition-all cursor-pointer ${
                    featureFilter === 'reservation' ? 'border-[#ef4444] ring-2 ring-[#ef4444]/40 scale-[1.02]' : 'border-[#fecdd3] hover:border-[#fca5a5]'
                  }`}
                >
                  <img src={reservationImg} alt="Reservation" className="absolute right-0 top-0 h-[120%] w-auto object-cover opacity-80 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-[#ef4444] shadow-sm">
                      <CalendarDays size={14} />
                    </div>
                    <p className="mt-3 text-[24px] sm:text-[26px] font-bold leading-none text-neutral-900">{reservationCount}</p>
                    <p className="mt-1 font-bold text-[13px] text-neutral-900">Reservation</p>
                    <p className="mt-0.5 text-[10px] text-neutral-600">Table booking live</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-[#fca5a5]/40 overflow-hidden">
                        <div className="h-full rounded-full bg-[#ef4444] transition-all duration-500" style={{ width: `${reservationPercent}%` }} />
                      </div>
                      <span className="text-[10.5px] font-bold text-neutral-800">{reservationPercent}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Client Rollout Matrix Section */}
            <motion.section variants={itemVariants}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-[15px] sm:text-[16px] font-bold text-neutral-900">Client Rollout Matrix</h2>
                  <p className="mt-0.5 text-[11.5px] sm:text-[12px] text-neutral-500">
                    Click any badge to toggle status (Enabled → In Progress → N/A). Filter by clicking cards above.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {featureFilter !== 'all' && (
                    <button
                      type="button"
                      onClick={() => setFeatureFilter('all')}
                      className="rounded-lg bg-red-50 text-[#ef3340] border border-red-200 px-2.5 py-1.5 text-[11px] font-semibold hover:bg-red-100 transition-colors"
                    >
                      Clear Filter ({featureFilter})
                    </button>
                  )}
                  <div className="w-full sm:w-[220px]">
                    <label className="relative block">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Client..." 
                        className="w-full rounded-lg bg-[#f8f9fa] py-2 pl-9 pr-3 text-[12px] focus:outline-none transition-all hover:bg-neutral-100 border border-neutral-100 focus:bg-white focus:border-neutral-300" 
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Table with Smooth Horizontal Scroll */}
              <div className="w-full overflow-x-auto custom-scrollbar pb-3">
                <div className="min-w-[650px]">
                  <table className="w-full text-left text-[11.5px] border-separate border-spacing-y-2.5">
                    <thead>
                      <tr className="bg-[#fff1f2] text-neutral-700">
                        <th className="px-5 py-3.5 font-semibold rounded-l-[12px] whitespace-nowrap">Client</th>
                        <th className="px-5 py-3.5 font-semibold whitespace-nowrap">Offers</th>
                        <th className="px-5 py-3.5 font-semibold whitespace-nowrap">Loyalty</th>
                        <th className="px-5 py-3.5 font-semibold whitespace-nowrap">Event Ordering</th>
                        <th className="px-5 py-3.5 font-semibold rounded-r-[12px] whitespace-nowrap">Reservation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-neutral-400 bg-[#f8f9fa] rounded-xl font-medium">
                            No clients match your search query.
                          </td>
                        </tr>
                      ) : (
                        filteredClients.map((c) => (
                          <tr key={c.id} className="bg-[#f8f9fa] hover:bg-neutral-100 transition-colors">
                            <td className="px-5 py-3.5 rounded-l-[12px] whitespace-nowrap">
                              <p className="font-bold text-neutral-900 text-[12px]">{c.name}</p>
                              <p className="text-neutral-400 mt-0.5 text-[10px]">{c.country}</p>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <StatusCell status={c.offers} onClick={() => toggleFeature(c.id, 'offers')} />
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <StatusCell status={c.loyalty} onClick={() => toggleFeature(c.id, 'loyalty')} />
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <StatusCell status={c.events} onClick={() => toggleFeature(c.id, 'events')} />
                            </td>
                            <td className="px-5 py-3.5 rounded-r-[12px] whitespace-nowrap">
                              <StatusCell status={c.reservation} onClick={() => toggleFeature(c.id, 'reservation')} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Footer Legend */}
              <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-[11px] text-neutral-500">
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  <span className="flex items-center gap-1.5 font-semibold text-[#22c55e]">
                    <Check size={12} strokeWidth={3} /> Enabled
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-[#f59e0b]">
                    <Settings2 size={12} /> In Progress
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-neutral-400">
                    <Minus size={12} strokeWidth={3} /> Not Available
                  </span>
                </div>
                <div className="font-semibold text-neutral-600">
                  {filteredClients.length} of {matrixClients.length} Clients Tracked
                </div>
              </div>
            </motion.section>
          </motion.main>
        </div>
      </div>
    </div>
  )
}

function loyPercent(count: number, total: number) {
  return ((count / total) * 100).toFixed(1)
}
