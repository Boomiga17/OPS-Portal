import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Building2, Globe, CheckCircle2, Trash2, Save
} from 'lucide-react'
import { usePortal } from '../context/PortalContext'
import type { ClientItem } from '../context/PortalContext'

export default function ClientDetailModal() {
  const { selectedClient, setSelectedClient, updateClient, deleteClient } = usePortal()

  if (!selectedClient) return null

  return (
    <ClientDetailDialog
      key={selectedClient.id}
      client={selectedClient}
      onClose={() => setSelectedClient(null)}
      onUpdate={(updates) => updateClient(selectedClient.id, updates)}
      onDelete={() => {
        deleteClient(selectedClient.id)
        setSelectedClient(null)
      }}
    />
  )
}

interface DialogProps {
  client: ClientItem
  onClose: () => void
  onUpdate: (updates: Partial<ClientItem>) => void
  onDelete: () => void
}

function ClientDetailDialog({ client, onClose, onUpdate, onDelete }: DialogProps) {
  const [formData, setFormData] = useState<ClientItem>({ ...client })
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    onUpdate({
      name: formData.name,
      country: formData.country,
      tech: formData.tech,
      techStyle: formData.tech === 'Next.js' ? 'bg-neutral-900 text-white' : 'bg-[#3b82f6] text-white',
      env: formData.env,
      envStyle: formData.env === 'Production' ? 'bg-[#e5f4e8] text-[#4caf60]' : formData.env === 'Staging' ? 'bg-[#ffeed9] text-[#e27b4e]' : 'bg-[#ede9fe] text-[#7c3aed]',
      ordering: {
        dot: formData.ordering.label === 'Active' ? 'bg-[#22c55e]' : formData.ordering.label === 'In Progress' ? 'bg-[#d4af37]' : 'bg-neutral-400',
        label: formData.ordering.label,
        color: formData.ordering.label === 'Active' ? '#22c55e' : formData.ordering.label === 'In Progress' ? '#d4af37' : '#94a3b8',
      },
      qa: formData.qa,
      stage: {
        label: formData.stage.label,
        style: formData.stage.label === 'Completed' ? 'bg-[#e5f4e8] text-[#4caf60]' : formData.stage.label === 'Testing' ? 'bg-[#fce8e8] text-[#ef3340]' : 'bg-[#fff3b5] text-[#ae8e55]',
      },
      status: {
        dot: formData.status.label === 'Live' ? 'bg-[#22c55e]' : formData.status.label === 'Staging' ? 'bg-[#d4af37]' : 'bg-neutral-400',
        label: formData.status.label,
        color: formData.status.label === 'Live' ? '#22c55e' : formData.status.label === 'Staging' ? '#d4af37' : '#94a3b8',
      },
      priority: formData.priority,
      migration: {
        dot: formData.migration.label === 'Completed' ? 'bg-[#22c55e]' : formData.migration.label === 'In Progress' ? 'bg-[#d4af37]' : 'bg-neutral-400',
        label: formData.migration.label,
        color: formData.migration.label === 'Completed' ? '#22c55e' : formData.migration.label === 'In Progress' ? '#d4af37' : '#94a3b8',
      },
      domain: formData.domain,
    })

    setIsSaved(true)
    setTimeout(() => {
      onClose()
    }, 600)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${formData.name}?`)) {
      onDelete()
    }
  }

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
        <div onClick={onClose} className="fixed inset-0 z-0 bg-transparent" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto custom-scrollbar rounded-2xl bg-white shadow-2xl border border-neutral-100 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100 bg-[#f8f9fa]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#ef3340]">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-neutral-900">{formData.name || 'Client Details'}</h3>
                <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                  <span>{formData.country}</span> • 
                  <span className="font-semibold text-neutral-700">{formData.tech}</span> • 
                  <span className="text-[#ef3340] font-semibold">{formData.priority} Priority</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 text-[12px]">
            {isSaved && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl bg-[#e5f4e8] p-3 text-[#22c55e] font-semibold"
              >
                <CheckCircle2 size={16} /> Changes saved successfully!
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Client Name */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Restaurant / Client Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none focus:ring-1 focus:ring-[#ef3340]"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Region / Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                >
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="UAE">UAE</option>
                  <option value="Canada">Canada</option>
                  <option value="India">India</option>
                </select>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Tech Framework</label>
                <select
                  value={formData.tech}
                  onChange={(e) => setFormData({ ...formData, tech: e.target.value as any })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                >
                  <option value="Next.js">Next.js 14 App Router</option>
                  <option value="React.js">React.js 18 Legacy</option>
                </select>
              </div>

              {/* Environment */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Deployment Environment</label>
                <select
                  value={formData.env}
                  onChange={(e) => setFormData({ ...formData, env: e.target.value as any })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                </select>
              </div>

              {/* Embedded Ordering */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Embedded Ordering Status</label>
                <select
                  value={formData.ordering.label}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    ordering: { ...formData.ordering, label: e.target.value as any } 
                  })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                >
                  <option value="Active">Active (Live in Prod)</option>
                  <option value="In Progress">In Progress (Testing)</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>

              {/* QA Sign-off */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">QA Sign-off Status</label>
                <select
                  value={formData.qa}
                  onChange={(e) => setFormData({ ...formData, qa: e.target.value as any })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                >
                  <option value="Signed Off">Signed Off (100% Pass)</option>
                  <option value="In Review">In Review (QA Testing)</option>
                  <option value="Pending">Pending Assignment</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>

              {/* Rollout Stage */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Rollout Stage</label>
                <select
                  value={formData.stage.label}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    stage: { ...formData.stage, label: e.target.value } 
                  })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                >
                  <option value="Completed">Completed</option>
                  <option value="Testing">Testing</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planning">Planning</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Priority Level</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              {/* Migration Status */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Migration Status</label>
                <select
                  value={formData.migration.label}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    migration: { ...formData.migration, label: e.target.value as any } 
                  })}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                >
                  <option value="Completed">Completed (Next.js)</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                </select>
              </div>

              {/* Domain */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Domain URL</label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={formData.domain || ''}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="e.g. restaurant.com"
                    className="w-full rounded-lg border border-neutral-200 pl-9 pr-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11.5px] font-semibold text-[#ef4444] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 size={14} /> Delete Client
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-neutral-100 px-4 py-2 text-[12px] font-semibold text-neutral-700 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-[#ef3340] hover:bg-red-600 text-white px-5 py-2 text-[12px] font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
}
