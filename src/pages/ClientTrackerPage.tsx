import { useState, useRef, useEffect } from 'react'
import { 
  ChevronDown, ArrowUpDown, ArrowUp, ArrowDown,
  Eye, Pencil, Trash2, Search, MonitorPlay, Download, Plus, Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ColumnsDropdown from '../components/ColumnsDropdown'
import Pagination from '../components/Pagination'
import { usePortal } from '../context/PortalContext'

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

export default function ClientTrackerPage() {
  const { 
    clients, 
    deleteClient, 
    setSelectedClient, 
    visibleColumns, 
    openPresentation, 
    openAddClient, 
    openImport 
  } = usePortal()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isPriorityOpen, setIsPriorityOpen] = useState(false)

  const [sortField, setSortField] = useState<'default' | 'name' | 'tech' | 'priority'>('default')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  const [pageSize, setPageSize] = useState(4)
  const [currentPage, setCurrentPage] = useState(1)

  // Whenever a new client is added, automatically jump to page 1, clear filters, and show latest first
  const prevClientsCount = useRef(clients.length)
  useEffect(() => {
    if (clients.length > prevClientsCount.current) {
      setCurrentPage(1)
      setSearchTerm('')
      setStatusFilter('All')
      setPriorityFilter('All')
      setSortField('default')
    }
    prevClientsCount.current = clients.length
  }, [clients.length])

  // Filter & sort clients
  const filteredClients = clients
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.tech && c.tech.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const paginatedClients = filteredClients.slice(startIndex, startIndex + pageSize)

  const handleSort = (field: 'name' | 'tech' | 'priority') => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc')
      } else {
        setSortField('default')
        setSortOrder('asc')
      }
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f1f3f5] font-sans text-[12px] p-2.5 sm:p-4 gap-4 lg:gap-6">
      {/* Sidebar (Desktop sticky + Mobile drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 py-1 min-w-0">
        <div className="w-full pb-10">
          {/* Responsive Header */}
          <Header title="Orbit OPS" subtitle="Operations Command Center" searchPlaceholder="Search Clients..." />

          {/* Main Dashboard Blocks */}
          <motion.main 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="rounded-[16px] bg-white p-4 sm:p-6 shadow-sm space-y-6"
          >
            <motion.div variants={itemVariants}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-[16px] sm:text-[18px] font-bold text-neutral-900">Client Tracker</h2>
                  <p className="mt-1 text-[12px] sm:text-[13px] text-neutral-500">Live tracker for client onboarding, technology stack, ordering setup, and migration status.</p>
                </div>

                {/* Top Action Buttons (Present, Columns, Import, Add Client) */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      openPresentation()
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-white border border-neutral-200 px-3 py-2 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-xs cursor-pointer"
                    title="Launch Executive Presentation Mode"
                  >
                    <MonitorPlay size={15} className="text-neutral-600" />
                    <span>Present</span>
                  </button>

                  <ColumnsDropdown />

                  <button
                    type="button"
                    onClick={openImport}
                    className="flex items-center gap-1.5 rounded-lg bg-white border border-neutral-200 px-3 py-2 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-xs cursor-pointer"
                  >
                    <Download size={15} className="text-neutral-600" />
                    <span>Import</span>
                  </button>

                  <button
                    type="button"
                    onClick={openAddClient}
                    className="flex items-center gap-1.5 rounded-lg bg-[#ef3340] hover:bg-red-600 text-white px-3.5 py-2 text-[12px] font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
                    title="Add a new client to portfolio"
                  >
                    <span>Add Client</span>
                    <Plus size={15} strokeWidth={3} />
                  </button>
                </div>
              </div>
              
              {/* Filters & Search Row */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <label className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                      }}
                      placeholder="Search Clients..." 
                      className="w-[180px] sm:w-[240px] rounded-lg bg-[#f8f9fa] py-2 pl-9 pr-3 text-[12px] focus:outline-none transition-all hover:bg-neutral-100 border border-neutral-100 focus:bg-white focus:border-neutral-300" 
                    />
                  </label>

                  {/* Status Filter Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsStatusOpen(v => !v)
                        setIsPriorityOpen(false)
                      }}
                      className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#f8f9fa] px-3 sm:px-4 py-2 text-[12px] font-medium text-neutral-600 hover:bg-neutral-100 transition-colors border border-neutral-100 cursor-pointer"
                    >
                      <span>Status: {statusFilter}</span>
                      <ChevronDown size={14} />
                    </button>

                    <AnimatePresence>
                      {isStatusOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.95 }}
                          className="absolute left-0 top-10 z-30 w-36 rounded-xl bg-white p-1 shadow-lg border border-neutral-100"
                        >
                          {['All', 'Live', 'Staging', 'Dev'].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => {
                                setStatusFilter(st)
                                setIsStatusOpen(false)
                                setCurrentPage(1)
                              }}
                              className={`flex w-full items-center justify-between px-3 py-1.5 text-[11.5px] rounded-lg transition-colors cursor-pointer ${
                                statusFilter === st ? 'bg-red-50 text-[#ef3340] font-semibold' : 'text-neutral-700 hover:bg-neutral-50'
                              }`}
                            >
                              <span>{st}</span>
                              {statusFilter === st && <Check size={13} />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Priority Filter Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsPriorityOpen(v => !v)
                        setIsStatusOpen(false)
                      }}
                      className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#f8f9fa] px-3 sm:px-4 py-2 text-[12px] font-medium text-neutral-600 hover:bg-neutral-100 transition-colors border border-neutral-100 cursor-pointer"
                    >
                      <span>Priority: {priorityFilter}</span>
                      <ChevronDown size={14} />
                    </button>

                    <AnimatePresence>
                      {isPriorityOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.95 }}
                          className="absolute left-0 top-10 z-30 w-36 rounded-xl bg-white p-1 shadow-lg border border-neutral-100"
                        >
                          {['All', 'High', 'Medium', 'Low'].map((pr) => (
                            <button
                              key={pr}
                              type="button"
                              onClick={() => {
                                setPriorityFilter(pr)
                                setIsPriorityOpen(false)
                                setCurrentPage(1)
                              }}
                              className={`flex w-full items-center justify-between px-3 py-1.5 text-[11.5px] rounded-lg transition-colors cursor-pointer ${
                                priorityFilter === pr ? 'bg-red-50 text-[#ef3340] font-semibold' : 'text-neutral-700 hover:bg-neutral-50'
                              }`}
                            >
                              <span>{pr}</span>
                              {priorityFilter === pr && <Check size={13} />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="text-[11.5px] text-neutral-500 font-medium">
                  {filteredClients.length} of {clients.length} clients
                </div>
              </div>

              {/* Table Container with Horizontal Scroll */}
              <div className="mt-5 w-full overflow-x-auto pb-4 custom-scrollbar">
                <div className="min-w-[1050px]">
                  <table className="w-full text-left text-[11.5px] border-separate border-spacing-y-2.5">
                    <thead>
                      <tr className="bg-[#fff1f2] text-neutral-700">
                        {visibleColumns.client && (
                          <th className="px-4 py-3.5 font-semibold rounded-l-[12px] whitespace-nowrap cursor-pointer hover:text-neutral-900" onClick={() => handleSort('name')}>
                            <div className="flex items-center gap-2">
                              Client {sortField === 'name' ? (sortOrder === 'asc' ? <ArrowUp size={12} className="text-[#ef3340]" /> : <ArrowDown size={12} className="text-[#ef3340]" />) : <ArrowUpDown size={12} className="text-neutral-400" />}
                            </div>
                          </th>
                        )}
                        {visibleColumns.tech && (
                          <th className="px-4 py-3.5 font-semibold whitespace-nowrap cursor-pointer hover:text-neutral-900" onClick={() => handleSort('tech')}>
                            <div className="flex items-center gap-2">
                              Technology {sortField === 'tech' ? (sortOrder === 'asc' ? <ArrowUp size={12} className="text-[#ef3340]" /> : <ArrowDown size={12} className="text-[#ef3340]" />) : <ArrowUpDown size={12} className="text-neutral-400" />}
                            </div>
                          </th>
                        )}
                        {visibleColumns.env && (
                          <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                            <div className="flex items-center gap-2">Environment <ArrowUpDown size={12} className="text-neutral-400" /></div>
                          </th>
                        )}
                        {visibleColumns.ordering && (
                          <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                            <div className="flex items-center gap-2">Embedded Ordering <ArrowUpDown size={12} className="text-neutral-400" /></div>
                          </th>
                        )}
                        {visibleColumns.qa && (
                          <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                            <div className="flex items-center gap-2">QA Sign-off <ArrowUpDown size={12} className="text-neutral-400" /></div>
                          </th>
                        )}
                        {visibleColumns.stage && (
                          <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                            <div className="flex items-center gap-2">Stage <ArrowUpDown size={12} className="text-neutral-400" /></div>
                          </th>
                        )}
                        {visibleColumns.status && (
                          <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                            <div className="flex items-center gap-2">Status <ArrowUpDown size={12} className="text-neutral-400" /></div>
                          </th>
                        )}
                        {visibleColumns.priority && (
                          <th className="px-4 py-3.5 font-semibold whitespace-nowrap cursor-pointer hover:text-neutral-900" onClick={() => handleSort('priority')}>
                            <div className="flex items-center gap-2">
                              Priority {sortField === 'priority' ? (sortOrder === 'asc' ? <ArrowUp size={12} className="text-[#ef3340]" /> : <ArrowDown size={12} className="text-[#ef3340]" />) : <ArrowUpDown size={12} className="text-neutral-400" />}
                            </div>
                          </th>
                        )}
                        {visibleColumns.migration && (
                          <th className="px-4 py-3.5 font-semibold whitespace-nowrap">
                            <div className="flex items-center gap-2">Migration <ArrowUpDown size={12} className="text-neutral-400" /></div>
                          </th>
                        )}
                        {visibleColumns.actions && (
                          <th className="px-4 py-3.5 font-semibold rounded-r-[12px] whitespace-nowrap">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedClients.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="text-center py-8 text-neutral-400 bg-[#f8f9fa] rounded-xl font-medium">
                            No clients match your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedClients.map((c) => (
                          <tr key={c.id} className="bg-[#f8f9fa] hover:bg-neutral-100 transition-colors group">
                            {visibleColumns.client && (
                              <td className="px-4 py-3.5 rounded-l-[12px] whitespace-nowrap">
                                <p className="font-bold text-neutral-900 text-[12px]">{c.name}</p>
                                <p className="text-neutral-400 mt-0.5 text-[10px]">{c.country}</p>
                              </td>
                            )}
                            {visibleColumns.tech && (
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10.5px] font-medium ${c.techStyle}`}>{c.tech}</span>
                              </td>
                            )}
                            {visibleColumns.env && (
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10.5px] font-medium ${c.envStyle}`}>{c.env}</span>
                              </td>
                            )}
                            {visibleColumns.ordering && (
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className={`h-1.5 w-1.5 rounded-full ${c.ordering.dot}`} />
                                  <span className="font-medium" style={{ color: c.ordering.color }}>{c.ordering.label}</span>
                                </div>
                              </td>
                            )}
                            {visibleColumns.qa && (
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <span className="font-semibold text-neutral-700">{c.qa}</span>
                              </td>
                            )}
                            {visibleColumns.stage && (
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10.5px] font-medium ${c.stage.style}`}>{c.stage.label}</span>
                              </td>
                            )}
                            {visibleColumns.status && (
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className={`h-1.5 w-1.5 rounded-full ${c.status.dot}`} />
                                  <span className="font-medium" style={{ color: c.status.color }}>{c.status.label}</span>
                                </div>
                              </td>
                            )}
                            {visibleColumns.priority && (
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium ${
                                  c.priority === 'High' ? 'bg-[#fce8e8] text-[#ef3340]' : c.priority === 'Medium' ? 'bg-[#ffeed9] text-[#e27b4e]' : 'bg-[#e5f4e8] text-[#4caf60]'
                                }`}>
                                  {c.priority}
                                </span>
                              </td>
                            )}
                            {visibleColumns.migration && (
                              <td className="px-4 py-3.5 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className={`h-1.5 w-1.5 rounded-full ${c.migration.dot}`} />
                                  <span className="font-medium" style={{ color: c.migration.color }}>{c.migration.label}</span>
                                </div>
                              </td>
                            )}
                            {visibleColumns.actions && (
                              <td className="px-4 py-3.5 rounded-r-[12px] whitespace-nowrap">
                                <div className="flex items-center gap-3">
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
                                    className="text-neutral-500 hover:text-blue-600 transition-colors cursor-pointer" 
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

              {/* Interactive Pagination */}
              <Pagination
                currentPage={safePage}
                totalItems={filteredClients.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[4, 8, 10, 20]}
              />
            </motion.div>
          </motion.main>
        </div>
      </div>
    </div>
  )
}
