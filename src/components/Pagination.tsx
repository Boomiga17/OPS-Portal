import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PaginationProps {
  currentPage: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
  className?: string
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [4, 8, 10, 15],
  className = '',
}: PaginationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1
  const endIndex = Math.min(totalItems, safeCurrentPage * pageSize)

  const canGoPrev = safeCurrentPage > 1
  const canGoNext = safeCurrentPage < totalPages

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectSize = (size: number) => {
    onPageSizeChange(size)
    onPageChange(1)
    setIsDropdownOpen(false)
  }

  return (
    <div className={`mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] text-neutral-500 font-medium ${className}`}>
      {/* Items count indicator */}
      <div>
        Showing <span className="text-neutral-900 font-bold">{startIndex}-{endIndex}</span> Of{' '}
        <span className="text-neutral-900 font-bold">{totalItems}</span>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Rows per page selector */}
        <div className="relative flex items-center gap-2" ref={dropdownRef}>
          <span className="text-neutral-600 font-medium">Rows</span>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-neutral-800 font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-colors cursor-pointer shadow-xs"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            title="Rows per page"
          >
            <span>{pageSize}</span>
            <ChevronDown
              size={13}
              className={`text-neutral-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Rows Popover Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 bottom-full mb-1 sm:bottom-auto sm:top-full sm:mt-1 z-50 w-24 rounded-xl bg-white shadow-xl border border-neutral-200 py-1 overflow-hidden"
              >
                {pageSizeOptions.map((opt) => {
                  const isSelected = pageSize === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectSize(opt)}
                      className={`flex w-full items-center justify-between px-3 py-1.5 text-[11.5px] text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#fff1f2] text-[#ef3340] font-bold'
                          : 'text-neutral-700 hover:bg-neutral-50 font-medium'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check size={12} />}
                    </button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons: First, Prev, Page indicator, Next, Last */}
        <div className="flex items-center gap-1.5">
          {/* First Page («) */}
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={!canGoPrev}
            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#ef3340] text-white shadow-xs transition-all ${
              canGoPrev
                ? 'hover:bg-red-600 active:scale-95 cursor-pointer opacity-100'
                : 'opacity-40 cursor-not-allowed'
            }`}
            title="First page"
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Previous Page (<) */}
          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage - 1)}
            disabled={!canGoPrev}
            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#ef3340] text-white shadow-xs transition-all ${
              canGoPrev
                ? 'hover:bg-red-600 active:scale-95 cursor-pointer opacity-100'
                : 'opacity-40 cursor-not-allowed'
            }`}
            title="Previous page"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Indicator */}
          <span className="px-2 select-none text-neutral-600">
            Page <span className="text-neutral-900 font-bold">{safeCurrentPage}</span> of{' '}
            <span className="text-neutral-900 font-bold">{totalPages}</span>
          </span>

          {/* Next Page (>) */}
          <button
            type="button"
            onClick={() => onPageChange(safeCurrentPage + 1)}
            disabled={!canGoNext}
            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#ef3340] text-white shadow-xs transition-all ${
              canGoNext
                ? 'hover:bg-red-600 active:scale-95 cursor-pointer opacity-100'
                : 'opacity-40 cursor-not-allowed'
            }`}
            title="Next page"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>

          {/* Last Page (») */}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
            className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#ef3340] text-white shadow-xs transition-all ${
              canGoNext
                ? 'hover:bg-red-600 active:scale-95 cursor-pointer opacity-100'
                : 'opacity-40 cursor-not-allowed'
            }`}
            title="Last page"
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
