import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, ChevronRight, Play, Pause, Maximize, Minimize,
  Rocket, Globe, CheckCircle2, ShieldCheck, Tag, Heart, Sparkles, CalendarDays,
  ArrowLeft, LayoutDashboard
} from 'lucide-react'
import logoImg from '../assets/red logo.png'
import { usePortal } from '../context/PortalContext'

const getStatusLabel = (c: any) => (typeof c?.status === 'object' ? c?.status?.label : c?.status) || ''
const getOrderingLabel = (c: any) => (typeof c?.ordering === 'object' ? c?.ordering?.label : c?.ordering) || ''

export default function PresentationPage() {
  const navigate = useNavigate()
  const { clients } = usePortal()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const safeClients = Array.isArray(clients) ? clients : []

  const slides = [
    {
      id: 'overview',
      tabLabel: 'Portfolio Overview',
      title: 'Operations Command Center',
      subtitle: 'Executive Portfolio Briefing • Q4 2026',
      render: () => {
        const liveCount = safeClients.filter(c => getStatusLabel(c).toLowerCase() === 'live').length || 6
        const nextCount = safeClients.filter(c => c?.tech === 'Next.js').length || 6
        const total = safeClients.length || 8
        const nextPercent = Math.round((nextCount / total) * 100)

        return (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-neutral-900 text-white p-6 shadow-xl relative overflow-hidden border border-neutral-800">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
                <Globe size={28} className="text-[#3b82f6] mb-3" />
                <p className="text-[38px] font-extrabold leading-none">{total}</p>
                <p className="text-[13.5px] font-semibold text-neutral-300 mt-1.5">Total Client Sites</p>
                <p className="text-[11.5px] text-neutral-500 mt-2">Active enterprise portfolio</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-[#22c55e] to-emerald-700 text-white p-6 shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                <CheckCircle2 size={28} className="mb-3 text-emerald-100" />
                <p className="text-[38px] font-extrabold leading-none">{liveCount}</p>
                <p className="text-[13.5px] font-semibold text-emerald-100 mt-1.5">Live in Production</p>
                <p className="text-[11.5px] text-emerald-200 mt-2">Zero downtime SLA target</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-[#ef3340] to-rose-700 text-white p-6 shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                <Rocket size={28} className="mb-3 text-rose-100" />
                <p className="text-[38px] font-extrabold leading-none">{nextPercent}%</p>
                <p className="text-[13.5px] font-semibold text-rose-100 mt-1.5">Next.js 14 Cutover</p>
                <p className="text-[11.5px] text-rose-200 mt-2">{nextCount} of {total} migrated</p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-[#e27b4e] to-amber-700 text-white p-6 shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                <ShieldCheck size={28} className="mb-3 text-amber-100" />
                <p className="text-[38px] font-extrabold leading-none">99.98%</p>
                <p className="text-[13.5px] font-semibold text-amber-100 mt-1.5">Global Uptime</p>
                <p className="text-[11.5px] text-amber-200 mt-2">All ordering gateways nominal</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-7 border border-neutral-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-[#ef3340] text-xs font-bold">
                  ★
                </span>
                <h3 className="text-[17px] font-bold text-neutral-900">Executive Summary & Operational Posture</h3>
              </div>
              <p className="text-[13.5px] text-neutral-600 leading-relaxed">
                Brisque Operations Command Center manages client hospitality sites across the United States, United Kingdom, and the UAE. Our modern Next.js 14 stack delivers high-speed menu renders, instant cart updates, and direct POS synchronization for Clover and Toast.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl bg-[#f8f9fa] p-4 border border-neutral-100">
                  <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Fastest Cutover</p>
                  <p className="text-[14px] font-bold text-neutral-900 mt-1">Bheema Next.js</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Completed in under 3 weeks</p>
                </div>
                <div className="rounded-xl bg-[#f8f9fa] p-4 border border-neutral-100">
                  <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Top Volume Site</p>
                  <p className="text-[14px] font-bold text-neutral-900 mt-1">Amudham Restaurant</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">42,000+ orders this month</p>
                </div>
                <div className="rounded-xl bg-[#f8f9fa] p-4 border border-neutral-100">
                  <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Target Sign-Off</p>
                  <p className="text-[14px] font-bold text-neutral-900 mt-1">Pakka Spice & Aaha</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Final QA in progress</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    },
    {
      id: 'rollout',
      tabLabel: 'Ordering Gateway',
      title: 'Embedded Ordering Rollout',
      subtitle: 'Ordering Gateway & Menu Sync Status',
      render: () => {
        const activeOrdering = safeClients.filter(c => getOrderingLabel(c).toLowerCase() === 'active').length || 5
        const inProg = safeClients.filter(c => getOrderingLabel(c).toLowerCase().includes('progress')).length || 2

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="rounded-2xl bg-white p-7 border border-neutral-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-[17px] font-bold text-neutral-900">Ordering Capabilities Breakdown</h3>
                <p className="text-[12px] text-neutral-500 mt-1">Active gateway vs pending integration rollout</p>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-[13px] font-bold text-neutral-700 mb-1.5">
                    <span>Active Embedded Gateway ({activeOrdering} Sites)</span>
                    <span className="text-[#22c55e]">62.5%</span>
                  </div>
                  <div className="h-3.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-[#22c55e] rounded-full transition-all duration-500" style={{ width: '62.5%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[13px] font-bold text-neutral-700 mb-1.5">
                    <span>In Progress Setup ({inProg} Sites)</span>
                    <span className="text-[#e27b4e]">25.0%</span>
                  </div>
                  <div className="h-3.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-[#e27b4e] rounded-full transition-all duration-500" style={{ width: '25%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[13px] font-bold text-neutral-700 mb-1.5">
                    <span>Planned Setup (1 Site)</span>
                    <span className="text-[#ef3340]">12.5%</span>
                  </div>
                  <div className="h-3.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-[#ef3340] rounded-full transition-all duration-500" style={{ width: '12.5%' }} />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 text-[12px] text-neutral-600 space-y-1">
                <p className="font-semibold text-neutral-800">Supported Gateways & POS Providers:</p>
                <p>• Stripe Embedded Checkout with Apple Pay & Google Pay</p>
                <p>• Clover & Toast real-time bi-directional menu modifiers sync</p>
                <p>• Worldpay UK card processing for international venues</p>
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-900 text-white p-7 shadow-xl flex flex-col justify-between border border-neutral-800">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold mb-4">
                  Financial Performance
                </span>
                <p className="text-[44px] font-extrabold leading-none tracking-tight">$1.84M</p>
                <p className="text-[14px] text-neutral-300 mt-2 font-medium">Monthly volume through Brisque Embedded Ordering</p>
                <p className="text-[12px] text-neutral-500 mt-1">Up +28% quarter-over-quarter</p>
              </div>

              <div className="space-y-3 pt-6 border-t border-neutral-800">
                <div className="flex justify-between text-[12px]">
                  <span className="text-neutral-400">Average Gateway Latency</span>
                  <span className="font-bold text-white">142ms</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-neutral-400">Cart Checkout Conversion</span>
                  <span className="font-bold text-emerald-400">94.8%</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-neutral-400">PCI-DSS Security Compliance</span>
                  <span className="font-bold text-white">Level 1 Certified</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    },
    {
      id: 'features',
      tabLabel: 'Feature Matrix',
      title: 'Feature Rollout Matrix',
      subtitle: 'Offers, Loyalty, Reservation & Event Ordering',
      render: () => (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-br from-[#fffdf0] to-[#fff8c4] p-6 border border-[#fde68a] text-neutral-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#eab308] shadow-sm mb-4">
                <Tag size={24} />
              </div>
              <p className="text-[32px] font-extrabold">5 Sites</p>
              <p className="text-[14px] font-bold mt-1">Offers Engine</p>
              <p className="text-[11.5px] text-neutral-600 mt-2.5 leading-relaxed">
                Dynamic promo codes, happy hour discounts, and coupon bundle pricing live across North America.
              </p>
            </div>
            <span className="mt-4 inline-block text-[10.5px] font-bold text-amber-800 bg-amber-200/60 rounded-full px-2.5 py-1 self-start">
              62.5% Adoption
            </span>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] p-6 border border-[#bbf7d0] text-neutral-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#22c55e] shadow-sm mb-4">
                <Heart size={24} />
              </div>
              <p className="text-[32px] font-extrabold">4 Sites</p>
              <p className="text-[14px] font-bold mt-1">Loyalty Rewards</p>
              <p className="text-[11.5px] text-neutral-600 mt-2.5 leading-relaxed">
                Tiered points accumulation, cashback vouchers, and VIP member perks integrated into customer logins.
              </p>
            </div>
            <span className="mt-4 inline-block text-[10.5px] font-bold text-emerald-800 bg-emerald-200/60 rounded-full px-2.5 py-1 self-start">
              50.0% Adoption
            </span>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] p-6 border border-[#bfdbfe] text-neutral-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#3b82f6] shadow-sm mb-4">
                <Sparkles size={24} />
              </div>
              <p className="text-[32px] font-extrabold">3 Sites</p>
              <p className="text-[14px] font-bold mt-1">Event Catering</p>
              <p className="text-[11.5px] text-neutral-600 mt-2.5 leading-relaxed">
                Bulk order workflows, customized party trays, and calendar booking for corporate catering events.
              </p>
            </div>
            <span className="mt-4 inline-block text-[10.5px] font-bold text-blue-800 bg-blue-200/60 rounded-full px-2.5 py-1 self-start">
              37.5% Adoption
            </span>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#fff1f2] to-[#ffe4e6] p-6 border border-[#fecdd3] text-neutral-900 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#ef4444] shadow-sm mb-4">
                <CalendarDays size={24} />
              </div>
              <p className="text-[32px] font-extrabold">4 Sites</p>
              <p className="text-[14px] font-bold mt-1">Table Reservation</p>
              <p className="text-[11.5px] text-neutral-600 mt-2.5 leading-relaxed">
                Real-time floor plan bookings with SMS confirmation webhooks and automated waitlist tracking.
              </p>
            </div>
            <span className="mt-4 inline-block text-[10.5px] font-bold text-rose-800 bg-rose-200/60 rounded-full px-2.5 py-1 self-start">
              50.0% Adoption
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'migration',
      tabLabel: 'Next.js Migration',
      title: 'React → Next.js Migration Status',
      subtitle: 'Q4 2026 Core Infrastructure Upgrade',
      render: () => (
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white p-7 border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-[16px] text-neutral-900">Architecture Transition Progress</span>
                <p className="text-[12px] text-neutral-500 mt-0.5">Cutover of legacy React SPAs to Next.js 14 App Router</p>
              </div>
              <span className="text-[16px] font-extrabold text-[#ef3340]">75% Completed</span>
            </div>

            <div className="h-4 w-full rounded-full bg-neutral-100 overflow-hidden flex">
              <div className="h-full bg-[#22c55e]" style={{ width: '50%' }} title="Completed (4)" />
              <div className="h-full bg-[#ef3340]" style={{ width: '25%' }} title="Testing (2)" />
              <div className="h-full bg-[#facc15]" style={{ width: '12.5%' }} title="In Progress (1)" />
              <div className="h-full bg-neutral-300" style={{ width: '12.5%' }} title="Planning (1)" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px] pt-2">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#22c55e]" />
                <span className="font-bold text-neutral-800">4 Completed</span>
                <span className="text-neutral-400">(50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#ef3340]" />
                <span className="font-bold text-neutral-800">2 Testing</span>
                <span className="text-neutral-400">(25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-[#facc15]" />
                <span className="font-bold text-neutral-800">1 In Progress</span>
                <span className="text-neutral-400">(12.5%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-neutral-300" />
                <span className="font-bold text-neutral-800">1 Planning</span>
                <span className="text-neutral-400">(12.5%)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-xl bg-white p-4 border border-neutral-200">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Planning</span>
              <p className="font-bold text-[13px] text-neutral-900 mt-1">Monks Allen</p>
              <p className="text-[11px] text-neutral-500 mt-1">React 18 → Next.js 14</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-400">
                <span>Progress: 15%</span>
                <span>Q1 2027</span>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 border border-neutral-200">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">In Progress</span>
              <p className="font-bold text-[13px] text-neutral-900 mt-1">Sangam Restaurant</p>
              <p className="text-[11px] text-neutral-500 mt-1">Yoga • Redux to Zustand</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-400">
                <span>Progress: 65%</span>
                <span>Q4 2026</span>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 border border-neutral-200">
              <span className="text-[10px] font-bold text-[#ef3340] uppercase tracking-wider">Testing (QA)</span>
              <p className="font-bold text-[13px] text-neutral-900 mt-1">Aaha & Pakka Spice</p>
              <p className="text-[11px] text-neutral-500 mt-1">Final regression run</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-400">
                <span>Progress: 90%</span>
                <span>Nov 2026</span>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 border border-neutral-200">
              <span className="text-[10px] font-bold text-[#22c55e] uppercase tracking-wider">Completed</span>
              <p className="font-bold text-[13px] text-neutral-900 mt-1">Amudham & Bheema</p>
              <p className="text-[11px] text-neutral-500 mt-1">Live in production</p>
              <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-400">
                <span>Progress: 100%</span>
                <span>Live</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'roadmap',
      tabLabel: 'Roadmap & Strategy',
      title: 'Strategic Priorities & Roadmap',
      subtitle: 'Next Steps and Deliverables for Q1 2027',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-md bg-red-50 text-[#ef3340] text-[10.5px] font-bold uppercase tracking-wider">
                Milestone 1
              </span>
              <h4 className="text-[17px] font-bold text-neutral-900 mt-3">100% Next.js Cutover</h4>
              <p className="text-[12.5px] text-neutral-600 mt-3 leading-relaxed">
                Complete migration of Sangam and Monks Allen by end of Q4 2026. Deprecate legacy React 18 instances to simplify CI/CD pipelines.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-neutral-500">
              <span>Target: Dec 31, 2026</span>
              <span className="text-amber-600">On Track</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-md bg-blue-50 text-[#3b82f6] text-[10.5px] font-bold uppercase tracking-wider">
                Milestone 2
              </span>
              <h4 className="text-[17px] font-bold text-neutral-900 mt-3">Multi-location POS Sync</h4>
              <p className="text-[12.5px] text-neutral-600 mt-3 leading-relaxed">
                Expand Clover and Toast bi-directional menu syncing to ensure inventory levels match in real-time across high-volume restaurant chains.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-neutral-500">
              <span>Target: Jan 31, 2027</span>
              <span className="text-blue-600">In Design</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-[#22c55e] text-[10.5px] font-bold uppercase tracking-wider">
                Milestone 3
              </span>
              <h4 className="text-[17px] font-bold text-neutral-900 mt-3">Universal Customer App</h4>
              <p className="text-[12.5px] text-neutral-600 mt-3 leading-relaxed">
                Roll out PWA companion application allowing repeat diners to re-order, book tables, and redeem loyalty points across all partner venues.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-semibold text-neutral-500">
              <span>Target: Feb 28, 2027</span>
              <span className="text-emerald-600">Planned</span>
            </div>
          </div>
        </div>
      )
    }
  ]

  const totalSlides = slides.length

  const handleNext = useCallback(() => {
    setCurrentSlide(s => (s + 1) % totalSlides)
  }, [totalSlides])

  const handlePrev = useCallback(() => {
    setCurrentSlide(s => (s - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      handleNext()
    }, 4500)
    return () => clearInterval(timer)
  }, [isPlaying, handleNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'Escape') {
        navigate('/admin-panel')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, navigate])

  const activeSlide = slides[currentSlide] || slides[0]

  return (
    <div className={`min-h-screen bg-[#f4f5f7] flex flex-col ${isFullscreen ? 'p-0' : 'p-3 sm:p-6'}`}>
      {/* Top Deck Navigation Bar */}
      <header className="rounded-2xl bg-white border border-neutral-200/80 px-4 sm:px-6 py-3.5 shadow-xs flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin-panel')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[12px] font-semibold transition-colors cursor-pointer"
            title="Return to Admin Panel (Esc)"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>

          <div className="h-5 w-px bg-neutral-200" />

          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Brisque" className="h-5 object-contain" />
            <span className="text-[12px] font-bold text-neutral-800 hidden md:inline">Executive Presentation</span>
          </div>
        </div>

        {/* Slide Tabs */}
        <div className="hidden lg:flex items-center gap-1 bg-[#f8f9fa] p-1 rounded-xl border border-neutral-100">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all cursor-pointer ${
                currentSlide === idx ? 'bg-[#ef3340] text-white shadow-xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
              }`}
            >
              {s.tabLabel}
            </button>
          ))}
        </div>

        {/* Deck Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-semibold transition-all cursor-pointer ${
              isPlaying ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(f => !f)}
            className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11.5px] font-semibold transition-colors cursor-pointer"
            title="Go to Dashboard"
          >
            <LayoutDashboard size={13} />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Slide Presentation Stage */}
      <main className="flex-1 my-4 flex flex-col justify-center">
        <div className="w-full max-w-6xl mx-auto">
          {/* Slide Heading */}
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ef3340] bg-red-50 px-3 py-1 rounded-full border border-red-100 inline-block mb-2">
              Brisque Executive Briefing • Slide {currentSlide + 1} of {totalSlides}
            </span>
            <h1 className="text-[24px] sm:text-[30px] font-extrabold text-neutral-900 tracking-tight">
              {activeSlide.title}
            </h1>
            <p className="text-[13px] sm:text-[14px] text-neutral-500 mt-1 max-w-xl mx-auto">
              {activeSlide.subtitle}
            </p>
          </div>

          {/* Animated Slide Canvas */}
          <div className="min-h-[460px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.28 }}
              >
                {activeSlide.render()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Bottom Deck Navigation Controller */}
      <footer className="rounded-2xl bg-white border border-neutral-200/80 px-4 sm:px-6 py-3.5 shadow-xs flex items-center justify-between gap-4 shrink-0 max-w-6xl mx-auto w-full">
        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-10 bg-[#ef3340]' : 'w-2.5 bg-neutral-300 hover:bg-neutral-400'
              }`}
              title={`Jump to ${s.tabLabel}`}
            />
          ))}
        </div>

        {/* Counter and Arrows */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-neutral-500 hidden sm:inline">
            Slide <b className="text-neutral-900">{currentSlide + 1}</b> of {totalSlides}
            <span className="text-neutral-400 text-[10.5px] ml-2">(Use ← → keys)</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[12px] font-semibold transition-colors cursor-pointer"
              title="Previous Slide (← or Space)"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ef3340] hover:bg-red-600 text-white text-[12px] font-bold transition-colors cursor-pointer shadow-sm"
              title="Next Slide (→)"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
