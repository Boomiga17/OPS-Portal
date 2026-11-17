import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, ChevronLeft, ChevronRight, Play, Pause, Maximize, Minimize, ArrowUpRight,
  Rocket, Globe, CheckCircle2, ShieldCheck, Tag, Heart, Sparkles, CalendarDays
} from 'lucide-react'
import { usePortal } from '../context/PortalContext'

const getStatusLabel = (c: any) => (typeof c?.status === 'object' ? c?.status?.label : c?.status) || ''
const getOrderingLabel = (c: any) => (typeof c?.ordering === 'object' ? c?.ordering?.label : c?.ordering) || ''

export default function PresentationModal() {
  const navigate = useNavigate()
  const { isPresentationOpen, closePresentation, clients } = usePortal()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const safeClients = Array.isArray(clients) ? clients : []

  const slides = [
    {
      id: 'overview',
      title: 'Operations Command Center',
      subtitle: 'Executive Portfolio Briefing • Q4 2026',
      render: () => {
        const liveCount = safeClients.filter(c => getStatusLabel(c).toLowerCase() === 'live').length || 6
        const nextCount = safeClients.filter(c => c?.tech === 'Next.js').length || 6
        const total = safeClients.length || 8
        const nextPercent = Math.round((nextCount / total) * 100)

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-neutral-900 text-white p-5 shadow-lg">
                <Globe size={24} className="text-[#3b82f6] mb-3" />
                <p className="text-[32px] font-bold leading-none">{total}</p>
                <p className="text-[13px] font-medium text-neutral-400 mt-1">Total Client Sites</p>
                <p className="text-[11px] text-neutral-500 mt-2">Active enterprise portfolio</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#22c55e] to-emerald-700 text-white p-5 shadow-lg">
                <CheckCircle2 size={24} className="mb-3" />
                <p className="text-[32px] font-bold leading-none">{liveCount}</p>
                <p className="text-[13px] font-medium text-emerald-100 mt-1">Live in Production</p>
                <p className="text-[11px] text-emerald-200 mt-2">High availability SLA</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#ef3340] to-rose-700 text-white p-5 shadow-lg">
                <Rocket size={24} className="mb-3" />
                <p className="text-[32px] font-bold leading-none">{nextPercent}%</p>
                <p className="text-[13px] font-medium text-rose-100 mt-1">Next.js 14 Modernized</p>
                <p className="text-[11px] text-rose-200 mt-2">{nextCount} of {total} migrated</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#e27b4e] to-amber-700 text-white p-5 shadow-lg">
                <ShieldCheck size={24} className="mb-3" />
                <p className="text-[32px] font-bold leading-none">99.98%</p>
                <p className="text-[13px] font-medium text-amber-100 mt-1">System Uptime</p>
                <p className="text-[11px] text-amber-200 mt-2">Zero critical incidents</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm">
              <h3 className="text-[16px] font-bold text-neutral-900 mb-2">Executive Summary</h3>
              <p className="text-[13px] text-neutral-600 leading-relaxed">
                Orbit Operations Command Center oversees restaurant web architecture and embedded ordering capabilities across North America, the UK, and UAE. Modernization to Next.js 14 App Router is on schedule with 75% complete cutover and 100% QA pass rate on live ordering gateways.
              </p>
            </div>
          </div>
        )
      }
    },
    {
      id: 'rollout',
      title: 'Embedded Ordering Rollout',
      subtitle: 'Ordering Gateway & Menu Sync Status',
      render: () => {
        const activeOrdering = safeClients.filter(c => getOrderingLabel(c).toLowerCase() === 'active').length || 5
        const inProg = safeClients.filter(c => getOrderingLabel(c).toLowerCase().includes('progress')).length || 2

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm space-y-4">
              <h3 className="text-[16px] font-bold text-neutral-900">Ordering Capabilities Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[12px] font-bold text-neutral-700 mb-1">
                    <span>Active Gateway ({activeOrdering} Sites)</span>
                    <span className="text-[#22c55e]">62.5%</span>
                  </div>
                  <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-[#22c55e] rounded-full" style={{ width: '62.5%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-bold text-neutral-700 mb-1">
                    <span>In Progress ({inProg} Sites)</span>
                    <span className="text-[#e27b4e]">25.0%</span>
                  </div>
                  <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-[#e27b4e] rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] font-bold text-neutral-700 mb-1">
                    <span>Planned Setup (1 Site)</span>
                    <span className="text-[#ef3340]">12.5%</span>
                  </div>
                  <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full bg-[#ef3340] rounded-full" style={{ width: '12.5%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-900 text-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold mb-3">
                  Key Metric
                </span>
                <p className="text-[32px] font-bold">$1.84M</p>
                <p className="text-[13px] text-neutral-400 mt-1">Processed monthly through Embedded Ordering</p>
              </div>
              <p className="text-[11.5px] text-neutral-400 mt-4 pt-4 border-t border-neutral-800">
                Stripe & Worldpay gateway latencies average under 180ms across all deployed instances.
              </p>
            </div>
          </div>
        )
      }
    },
    {
      id: 'features',
      title: 'Feature Rollout Matrix',
      subtitle: 'Offers, Loyalty, Reservation & Event Ordering',
      render: () => (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-[#fffdf0] to-[#fff8c4] p-5 border border-[#fde68a] text-neutral-900 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-[#eab308] shadow-xs mb-3">
              <Tag size={20} />
            </div>
            <p className="text-[28px] font-bold">5 Sites</p>
            <p className="text-[13px] font-bold mt-1">Offers Engine</p>
            <p className="text-[11px] text-neutral-600 mt-2">Dynamic promo codes, happy hour discounts, and bundle pricing live.</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] p-5 border border-[#bbf7d0] text-neutral-900 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-[#22c55e] shadow-xs mb-3">
              <Heart size={20} />
            </div>
            <p className="text-[28px] font-bold">4 Sites</p>
            <p className="text-[13px] font-bold mt-1">Loyalty Rewards</p>
            <p className="text-[11px] text-neutral-600 mt-2">Tiered points accumulation, cash-back vouchers and VIP perks.</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] p-5 border border-[#bfdbfe] text-neutral-900 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-[#3b82f6] shadow-xs mb-3">
              <Sparkles size={20} />
            </div>
            <p className="text-[28px] font-bold">3 Sites</p>
            <p className="text-[13px] font-bold mt-1">Event Catering</p>
            <p className="text-[11px] text-neutral-600 mt-2">Bulk ordering, customized party trays, and calendar booking.</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#fff1f2] to-[#ffe4e6] p-5 border border-[#fecdd3] text-neutral-900 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-[#ef4444] shadow-xs mb-3">
              <CalendarDays size={20} />
            </div>
            <p className="text-[28px] font-bold">4 Sites</p>
            <p className="text-[13px] font-bold mt-1">Table Reservation</p>
            <p className="text-[11px] text-neutral-600 mt-2">Real-time floor plan bookings with SMS confirmation hooks.</p>
          </div>
        </div>
      )
    },
    {
      id: 'migration',
      title: 'React → Next.js Migration Status',
      subtitle: 'Q4 2026 Core Infrastructure Upgrade',
      render: () => (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-[14px] text-neutral-900">Architecture Transition Progress</span>
              <span className="text-[13px] font-bold text-[#ef3340]">75% Completed</span>
            </div>
            <div className="h-3 w-full rounded-full bg-neutral-100 overflow-hidden flex">
              <div className="h-full bg-[#22c55e]" style={{ width: '50%' }} title="Completed (4)" />
              <div className="h-full bg-[#ef3340]" style={{ width: '25%' }} title="Testing (2)" />
              <div className="h-full bg-[#facc15]" style={{ width: '12.5%' }} title="In Progress (1)" />
              <div className="h-full bg-neutral-300" style={{ width: '12.5%' }} title="Planning (1)" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[11px]">
              <div><span className="inline-block h-2 w-2 rounded-full bg-[#22c55e] mr-1" /> 4 Completed (50%)</div>
              <div><span className="inline-block h-2 w-2 rounded-full bg-[#ef3340] mr-1" /> 2 Testing (25%)</div>
              <div><span className="inline-block h-2 w-2 rounded-full bg-[#facc15] mr-1" /> 1 In Progress (12.5%)</div>
              <div><span className="inline-block h-2 w-2 rounded-full bg-neutral-300 mr-1" /> 1 Planning (12.5%)</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'roadmap',
      title: 'Strategic Priorities & Roadmap',
      subtitle: 'Next Steps and Deliverables for Q1 2027',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white p-5 border border-neutral-200 shadow-sm">
            <span className="text-[10.5px] font-bold text-[#ef3340] uppercase tracking-wider">Milestone 1</span>
            <h4 className="text-[15px] font-bold text-neutral-900 mt-2">100% Next.js Cutover</h4>
            <p className="text-[12px] text-neutral-600 mt-2 leading-relaxed">
              Complete migration of Sangam and Monks Allen by end of Q4 2026. Deprecate legacy React 18 instances.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 border border-neutral-200 shadow-sm">
            <span className="text-[10.5px] font-bold text-[#3b82f6] uppercase tracking-wider">Milestone 2</span>
            <h4 className="text-[15px] font-bold text-neutral-900 mt-2">Multi-location POS Sync</h4>
            <p className="text-[12px] text-neutral-600 mt-2 leading-relaxed">
              Expand Clover and Toast bi-directional menu syncing to ensure inventory levels match in real-time.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 border border-neutral-200 shadow-sm">
            <span className="text-[10.5px] font-bold text-[#22c55e] uppercase tracking-wider">Milestone 3</span>
            <h4 className="text-[15px] font-bold text-neutral-900 mt-2">Universal Customer App</h4>
            <p className="text-[12px] text-neutral-600 mt-2 leading-relaxed">
              Roll out PWA companion application allowing repeat diners to re-order across all Orbit partner restaurants.
            </p>
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
    if (!isPresentationOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'Escape') {
        closePresentation()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPresentationOpen, handleNext, handlePrev, closePresentation])

  if (!isPresentationOpen || typeof document === 'undefined') return null

  const activeSlide = slides[currentSlide] || slides[0]

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closePresentation()
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 flex flex-col bg-[#f8f9fa] shadow-2xl border border-neutral-200 overflow-hidden ${
          isFullscreen 
            ? 'fixed inset-0 w-full h-full rounded-none' 
            : 'w-full max-w-5xl rounded-3xl max-h-[92vh] min-h-[580px]'
        }`}
      >
        {/* Top Slide Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ef3340]">
              Orbit Executive Briefing
            </span>
            <h2 className="text-[17px] font-bold text-neutral-900">{activeSlide.title}</h2>
            <p className="text-[11.5px] text-neutral-500">{activeSlide.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                closePresentation()
                navigate('/presentation')
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-semibold transition-all cursor-pointer"
              title="Open in Dedicated Full Page (/presentation)"
            >
              <ArrowUpRight size={13} />
              <span>Full Page</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                isPlaying ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(f => !f)}
              className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>

            <button
              type="button"
              onClick={closePresentation}
              className="p-2 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-[#ef3340] transition-colors cursor-pointer"
              title="Close Presentation (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Slide Content with Transition */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {activeSlide.render()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Slide Controller */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-neutral-200 shrink-0">
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-8 bg-[#ef3340]' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                }`}
                title={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11.5px] font-semibold text-neutral-500">
              Slide <b className="text-neutral-900">{currentSlide + 1}</b> of {totalSlides}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                title="Previous Slide (←)"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ef3340] hover:bg-red-600 text-white transition-colors cursor-pointer shadow-sm"
                title="Next Slide (→)"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
