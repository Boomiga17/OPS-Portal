import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { X, Upload, Download, FileText, CheckCircle2, Sparkles } from 'lucide-react'
import { usePortal } from '../context/PortalContext'
import type { ClientItem } from '../context/PortalContext'

export default function ImportExportModal() {
  const { isImportOpen, closeImport, clients, addClient } = usePortal()
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
  const [importedCount, setImportedCount] = useState<number | null>(null)

  if (!isImportOpen) return null

  // Quick 3-sample batch loader
  const handleQuickSampleImport = () => {
    const samples: ClientItem[] = [
      {
        id: `sample-${Date.now()}-1`,
        name: 'Curry Leaf Chicago',
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
        domain: 'curryleafchicago.com',
        updated: 'Just imported',
      },
      {
        id: `sample-${Date.now()}-2`,
        name: 'Dishoom Shoreditch',
        country: 'UK',
        tech: 'Next.js',
        techStyle: 'bg-neutral-900 text-white',
        env: 'Staging',
        envStyle: 'bg-[#ffeed9] text-[#e27b4e]',
        ordering: { dot: 'bg-[#d4af37]', label: 'In Progress', color: '#d4af37' },
        qa: 'In Review',
        stage: { label: 'Testing', style: 'bg-[#fce8e8] text-[#ef3340]' },
        status: { dot: 'bg-[#d4af37]', label: 'Staging', color: '#d4af37' },
        priority: 'Medium',
        migration: { dot: 'bg-[#22c55e]', label: 'Completed', color: '#22c55e' },
        domain: 'dishoom.com',
        updated: 'Just imported',
      },
      {
        id: `sample-${Date.now()}-3`,
        name: 'Bukhara Dubai Marina',
        country: 'UAE',
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
        domain: 'bukharadubai.com',
        updated: 'Just imported',
      },
    ]

    samples.forEach(s => addClient(s))
    setImportedCount(samples.length)
    setTimeout(() => {
      setImportedCount(null)
      closeImport()
    }, 1200)
  }

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Country', 'Technology', 'Environment', 'Ordering', 'QA', 'Stage', 'Status', 'Priority', 'Migration']
    const rows = clients.map(c => [
      `"${c.name}"`,
      `"${c.country}"`,
      `"${c.tech}"`,
      `"${c.env}"`,
      `"${c.ordering.label}"`,
      `"${c.qa}"`,
      `"${c.stage.label}"`,
      `"${c.status.label}"`,
      `"${c.priority}"`,
      `"${c.migration.label}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `brisque-clients-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(clients, null, 2))
    const link = document.createElement('a')
    link.setAttribute('href', dataStr)
    link.setAttribute('download', `brisque-clients-${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div onClick={closeImport} className="fixed inset-0 z-0 bg-transparent" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-neutral-100"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#ef3340]">
              <Upload size={18} />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-neutral-900">Import / Export</h3>
              <p className="text-[11.5px] text-neutral-500">Sync clients via CSV or JSON formats</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeImport}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="mt-4 flex rounded-lg bg-[#f1f3f5] p-1 text-[11.5px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-1.5 rounded-md text-center transition-colors cursor-pointer ${
              activeTab === 'import' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Import Clients
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-1.5 rounded-md text-center transition-colors cursor-pointer ${
              activeTab === 'export' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Export Clients ({clients.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'import' ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border-2 border-dashed border-neutral-200 p-6 text-center hover:border-[#ef3340] transition-colors cursor-pointer bg-[#f8f9fa]">
              <FileText size={28} className="mx-auto text-neutral-400 mb-2" />
              <p className="font-bold text-[12.5px] text-neutral-800">Drop CSV or JSON file here</p>
              <p className="text-[11px] text-neutral-500 mt-1">Supports standard Brisque or POS client formats</p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickSampleImport}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 text-[#ef3340] border border-red-200 py-2.5 text-[12px] font-bold hover:bg-red-100 transition-all cursor-pointer shadow-2xs active:scale-98"
              >
                <Sparkles size={16} />
                <span>Load Sample Batch (+3 Clients)</span>
              </button>
              <p className="text-[10.5px] text-neutral-400 text-center mt-1.5">
                Quickly tests batch insertion with real restaurant sample data
              </p>
            </div>

            {importedCount !== null && (
              <div className="flex items-center justify-center gap-2 text-[#22c55e] text-[12px] font-bold p-2 bg-green-50 rounded-lg">
                <CheckCircle2 size={16} /> Successfully imported {importedCount} clients!
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <p className="text-[12px] text-neutral-600">
              Download your complete client portfolio ({clients.length} active sites) for spreadsheet analysis or backup.
            </p>

            <button
              type="button"
              onClick={handleExportCSV}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-[#f8f9fa] transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <FileText size={20} className="text-[#22c55e]" />
                <div>
                  <p className="font-bold text-[12.5px] text-neutral-900">Comma-Separated Values (.CSV)</p>
                  <p className="text-[10.5px] text-neutral-400">Compatible with Microsoft Excel, Google Sheets</p>
                </div>
              </div>
              <Download size={16} className="text-neutral-500" />
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-[#f8f9fa] transition-all cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <FileText size={20} className="text-[#3b82f6]" />
                <div>
                  <p className="font-bold text-[12.5px] text-neutral-900">JSON Data Format (.JSON)</p>
                  <p className="text-[10.5px] text-neutral-400">Raw programmatic configuration data</p>
                </div>
              </div>
              <Download size={16} className="text-neutral-500" />
            </button>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  )
}
