import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Columns3, RotateCcw } from 'lucide-react'
import { usePortal } from '../context/PortalContext'

const COLUMN_DEFINITIONS = [
  { key: 'client', label: 'Client / Restaurant' },
  { key: 'tech', label: 'Tech Stack' },
  { key: 'env', label: 'Environment' },
  { key: 'ordering', label: 'Embedded Ordering' },
  { key: 'qa', label: 'QA Sign-off' },
  { key: 'stage', label: 'Rollout Stage' },
  { key: 'status', label: 'Live Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'migration', label: 'Migration' },
  { key: 'actions', label: 'Actions' },
]

export default function ColumnsDropdown() {
  const { visibleColumns, toggleColumn, resetColumns } = usePortal()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const visibleCount = Object.values(visibleColumns).filter(Boolean).length

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11.5px] font-bold transition-colors border cursor-pointer ${
          isOpen
            ? 'bg-neutral-200 text-neutral-900 border-neutral-300'
            : 'bg-[#f8f9fa] text-neutral-800 hover:bg-neutral-200 border-neutral-100'
        }`}
        aria-label="Toggle visible columns"
      >
        <span>Columns</span>
        <Columns3 size={14} />
        <span className="ml-0.5 rounded-full bg-neutral-300 text-neutral-800 text-[9.5px] px-1.5 py-0.2 font-extrabold">
          {visibleCount}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-1.5 z-40 w-56 rounded-2xl bg-white shadow-xl border border-neutral-100 overflow-hidden text-neutral-800"
          >
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-neutral-50 border-b border-neutral-100">
              <span className="text-xs font-bold text-neutral-900">Table Columns</span>
              <button
                type="button"
                onClick={resetColumns}
                className="flex items-center gap-1 text-[10.5px] font-semibold text-[#ef3340] hover:underline cursor-pointer"
              >
                <RotateCcw size={11} /> Reset
              </button>
            </div>

            <div className="p-2 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
              {COLUMN_DEFINITIONS.map(({ key, label }) => {
                const isChecked = visibleColumns[key] ?? true
                return (
                  <label
                    key={key}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer text-xs select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleColumn(key)}
                      className="h-3.5 w-3.5 rounded border-neutral-300 text-[#ef3340] focus:ring-[#ef3340] cursor-pointer"
                    />
                    <span className={isChecked ? 'font-medium text-neutral-800' : 'text-neutral-400'}>
                      {label}
                    </span>
                  </label>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
