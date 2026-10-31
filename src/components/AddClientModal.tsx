import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Building2, Sparkles, CheckCircle2 } from 'lucide-react'
import { usePortal } from '../context/PortalContext'
import type { ClientItem } from '../context/PortalContext'

export default function AddClientModal() {
  const { isAddClientOpen, closeAddClient, addClient } = usePortal()

  const [name, setName] = useState('')
  const [country, setCountry] = useState('USA')
  const [tech, setTech] = useState<'Next.js' | 'React.js'>('Next.js')
  const [env, setEnv] = useState<'Production' | 'Staging' | 'Development'>('Production')
  const [ordering, setOrdering] = useState<'Active' | 'In Progress' | 'Not Started'>('Active')
  const [qa, setQa] = useState<'Signed Off' | 'Pending' | 'In Review' | 'Not Started'>('Signed Off')
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High')
  const [status, setStatus] = useState('Live')
  const [stage, setStage] = useState('Completed')
  const [migration, setMigration] = useState<'Completed' | 'In Progress' | 'Planned'>('Completed')
  const [domain, setDomain] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isAddClientOpen) {
        setErrorMessage('')
        setSuccessMessage('')
        closeAddClient()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAddClientOpen, closeAddClient])

  // Quick fill sample
  const handleQuickFill = () => {
    const samples = [
      { name: 'Copper Chimney Express', country: 'USA', domain: 'copperchimney.com' },
      { name: 'Bukhara Grand Lounge', country: 'UAE', domain: 'bukharagrand.ae' },
      { name: 'Dishoom Bombay Cafe', country: 'UK', domain: 'dishoombombay.co.uk' },
      { name: 'Saravanaa Bhavan Central', country: 'USA', domain: 'saravanaacentral.com' },
    ]
    const chosen = samples[Math.floor(Math.random() * samples.length)]
    setName(chosen.name)
    setCountry(chosen.country)
    setDomain(chosen.domain)
    setErrorMessage('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setErrorMessage('Please enter a restaurant or client name.')
      return
    }

    const cleanDomain = domain.trim() || `${name.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}.com`

    const newClient: ClientItem = {
      id: `client-${Date.now()}`,
      name: name.trim(),
      country: country.trim() || 'USA',
      tech,
      techStyle: tech === 'Next.js' ? 'bg-neutral-900 text-white' : 'bg-[#3b82f6] text-white',
      env,
      envStyle: env === 'Production' ? 'bg-[#e5f4e8] text-[#4caf60]' : env === 'Staging' ? 'bg-[#ffeed9] text-[#e27b4e]' : 'bg-[#ede9fe] text-[#7c3aed]',
      ordering: {
        dot: ordering === 'Active' ? 'bg-[#22c55e]' : ordering === 'In Progress' ? 'bg-[#d4af37]' : 'bg-neutral-400',
        label: ordering,
        color: ordering === 'Active' ? '#22c55e' : ordering === 'In Progress' ? '#d4af37' : '#94a3b8',
      },
      qa,
      stage: {
        label: stage,
        style: stage === 'Completed' ? 'bg-[#e5f4e8] text-[#4caf60]' : stage === 'Testing' ? 'bg-[#fce8e8] text-[#ef3340]' : 'bg-[#fff3b5] text-[#ae8e55]',
      },
      status: {
        dot: status === 'Live' ? 'bg-[#22c55e]' : status === 'Staging' ? 'bg-[#d4af37]' : 'bg-neutral-400',
        label: status,
        color: status === 'Live' ? '#22c55e' : status === 'Staging' ? '#d4af37' : '#94a3b8',
      },
      priority,
      migration: {
        dot: migration === 'Completed' ? 'bg-[#22c55e]' : migration === 'In Progress' ? 'bg-[#d4af37]' : 'bg-neutral-400',
        label: migration,
        color: migration === 'Completed' ? '#22c55e' : migration === 'In Progress' ? '#d4af37' : '#94a3b8',
      },
      domain: cleanDomain,
      updated: 'Just now',
      features: {
        offers: 'enabled',
        loyalty: 'enabled',
        events: 'progress',
        reservation: 'enabled',
      },
    }

    addClient(newClient)
    setSuccessMessage(`"${newClient.name}" has been added!`)

    setTimeout(() => {
      setName('')
      setDomain('')
      setSuccessMessage('')
      closeAddClient()
    }, 500)
  }

  if (!isAddClientOpen) return null

  return createPortal(
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeAddClient()
        }}
      >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-lg max-h-[92vh] overflow-y-auto custom-scrollbar rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#ef3340]">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-neutral-900">Add New Client</h3>
                  <p className="text-[11.5px] text-neutral-500">Register new enterprise restaurant site to tracker</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeAddClient}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Fill Suggestion */}
            <div className="mt-3 flex items-center justify-between bg-neutral-50 rounded-xl px-3 py-2 border border-neutral-100 text-[11px]">
              <span className="text-neutral-600 font-medium">Want to test quickly?</span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="flex items-center gap-1 font-bold text-[#ef3340] hover:underline cursor-pointer"
              >
                <Sparkles size={12} /> Auto-fill sample
              </button>
            </div>

            {errorMessage && (
              <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-[11.5px] text-[#ef3340] font-semibold border border-red-100">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mt-3 rounded-lg bg-green-50 p-2.5 text-[11.5px] text-[#22c55e] font-semibold border border-green-100 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-3.5 space-y-3.5 text-[12px]">
              {/* Client Name & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errorMessage) setErrorMessage('')
                    }}
                    placeholder="e.g. Copper Chimney Express"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none focus:ring-1 focus:ring-[#ef3340]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Country / Region</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. USA, UK, UAE"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                  />
                </div>
              </div>

              {/* Domain */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Domain URL</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. copperchimney.com (optional)"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                />
              </div>

              {/* Technology & Environment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Technology</label>
                  <select
                    value={tech}
                    onChange={(e) => setTech(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] bg-white focus:border-[#ef3340] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Next.js">Next.js 14 App Router</option>
                    <option value="React.js">React.js 18 Legacy</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Environment</label>
                  <select
                    value={env}
                    onChange={(e) => setEnv(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] bg-white focus:border-[#ef3340] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="Development">Development</option>
                  </select>
                </div>
              </div>

              {/* Embedded Ordering & QA Sign-off */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Embedded Ordering</label>
                  <select
                    value={ordering}
                    onChange={(e) => setOrdering(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] bg-white focus:border-[#ef3340] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Active">Active (Live in Prod)</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">QA Sign-off</label>
                  <select
                    value={qa}
                    onChange={(e) => setQa(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] bg-white focus:border-[#ef3340] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Signed Off">Signed Off</option>
                    <option value="In Review">In Review</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Started">Not Started</option>
                  </select>
                </div>
              </div>

              {/* Priority, Status, Stage, Migration */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-200 px-2.5 py-2 text-[12px] bg-white focus:border-[#ef3340] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => {
                      const newStatus = e.target.value
                      setStatus(newStatus)
                      if (newStatus === 'Live') setStage('Completed')
                      else if (newStatus === 'Staging') setStage('Testing')
                      else setStage('In Progress')
                    }}
                    className="w-full rounded-lg border border-neutral-200 px-2.5 py-2 text-[12px] bg-white focus:border-[#ef3340] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Live">Live</option>
                    <option value="Staging">Staging</option>
                    <option value="Dev">Dev</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-2.5 py-2 text-[12px] bg-white focus:border-[#ef3340] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Testing">Testing</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Migration</label>
                  <select
                    value={migration}
                    onChange={(e) => setMigration(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-200 px-2.5 py-2 text-[12px] bg-white focus:border-[#ef3340] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={closeAddClient}
                  className="rounded-lg bg-neutral-100 px-4 py-2 text-[12px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-[#ef3340] px-4 py-2 text-[12px] font-bold text-white hover:bg-red-600 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Add Client <Plus size={15} strokeWidth={3} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>,
    document.body
  )
}
