import { useState, useEffect, useRef } from 'react'
import { 
  LayoutGrid, List, CheckCircle2, Clock, ShieldCheck, AlertCircle, Search,
  ArrowRight, ArrowLeft, Pencil, Plus, Trash2, X, Check, GripVertical, RotateCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Pagination from '../components/Pagination'

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

export type StageType = 'planning' | 'inProgress' | 'testing' | 'completed'

export interface MigrationItem {
  id: string
  name: string
  stack: string
  priority: 'High' | 'Medium' | 'Low'
  stage: StageType
  progress?: number
  quarter?: string
  date?: string
  assignee?: string
  note?: string
  status?: string
}

const STORAGE_KEY = 'brisque_migrations_v2'

const initialMigrations: MigrationItem[] = [
  { id: '1', name: 'Monks Allen', stack: 'React 18 → Next.js 14', priority: 'Low', stage: 'planning', quarter: 'Q1 2027', note: 'Architecture assessment underway', progress: 15 },
  { id: '2', name: 'Sangam Restaurant', stack: 'React 18 → Next.js 14', priority: 'High', stage: 'inProgress', quarter: 'Q4 2026', progress: 65, assignee: 'Yoga' },
  { id: '3', name: 'Pakka Spice Romeoville', stack: 'Next.js 14 App Router', priority: 'High', stage: 'testing', quarter: 'Q4 2026', progress: 90, note: 'QA In Review' },
  { id: '4', name: 'Aaha Kitchen', stack: 'Next.js 14 App Router', priority: 'High', stage: 'testing', quarter: 'Q4 2026', progress: 85, note: 'Regression verification' },
  { id: '5', name: 'Amudham Restaurant', stack: 'Next.js 14 App Router', priority: 'High', stage: 'completed', date: 'Oct 20, 2026', status: 'Live in Production', progress: 100 },
  { id: '6', name: 'Bheema Next.js', stack: 'Next.js 14 App Router', priority: 'High', stage: 'completed', date: 'Oct 14, 2026', status: 'Live in Production', progress: 100 },
  { id: '7', name: 'Manam Onam', stack: 'Next.js 14 App Router', priority: 'Medium', stage: 'completed', date: 'Oct 02, 2026', status: 'Live in Production', progress: 100 },
  { id: '8', name: 'Madurai Kitchen', stack: 'Next.js 14 App Router', priority: 'Medium', stage: 'completed', date: 'Sep 26, 2026', status: 'Live in Production', progress: 100 },
]

export default function MigrationPage() {
  // Load initial state from localStorage or fallback
  const [migrations, setMigrations] = useState<MigrationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // fallback
    }
    return initialMigrations
  })

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrations))
    } catch (e) {
      console.error('Failed to save migrations to localStorage', e)
    }
  }, [migrations])

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All')
  const [listPage, setListPage] = useState(1)
  const [listPageSize, setListPageSize] = useState(4)

  // Drag and Drop State
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<StageType | null>(null)

  // Edit / Add Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<MigrationItem | null>(null)
  const [isNewCard, setIsNewCard] = useState(false)

  const stageOrder: StageType[] = ['planning', 'inProgress', 'testing', 'completed']

  // Move item to a specific stage
  const moveToStage = (id: string, targetStage: StageType) => {
    setMigrations(prev => prev.map(m => {
      if (m.id !== id) return m
      let newProgress = m.progress ?? 50
      let newStatus = m.status
      let newNote = m.note

      if (targetStage === 'completed') {
        newProgress = 100
        newStatus = newStatus || 'Live in Production'
      } else if (targetStage === 'testing') {
        newProgress = Math.max(75, Math.min(95, newProgress || 85))
        newNote = newNote || 'QA in review'
      } else if (targetStage === 'inProgress') {
        newProgress = Math.max(30, Math.min(70, newProgress || 50))
      } else if (targetStage === 'planning') {
        newProgress = Math.min(25, newProgress || 15)
      }

      return {
        ...m,
        stage: targetStage,
        progress: newProgress,
        status: newStatus,
        note: newNote,
        date: targetStage === 'completed' ? (m.date || 'Today') : m.date,
      }
    }))
  }

  // Quick move to Done
  const moveToDone = (id: string) => {
    moveToStage(id, 'completed')
  }

  // Step forward or backward
  const stepStage = (id: string, direction: 'forward' | 'backward') => {
    const item = migrations.find(m => m.id === id)
    if (!item) return
    const currentIdx = stageOrder.indexOf(item.stage)
    const nextIdx = direction === 'forward' 
      ? Math.min(stageOrder.length - 1, currentIdx + 1)
      : Math.max(0, currentIdx - 1)
    moveToStage(id, stageOrder[nextIdx])
  }

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedItemId(id)
  }

  const handleDragEnd = () => {
    setDraggedItemId(null)
    setDragOverStage(null)
  }

  const handleDragOver = (e: React.DragEvent, stage: StageType) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverStage !== stage) {
      setDragOverStage(stage)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setDragOverStage(null)
  }

  const handleDrop = (e: React.DragEvent, stage: StageType) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || draggedItemId
    if (id) {
      moveToStage(id, stage)
    }
    setDraggedItemId(null)
    setDragOverStage(null)
  }

  // Card Modal Handlers
  const openEditModal = (item: MigrationItem) => {
    setEditingCard({ ...item })
    setIsNewCard(false)
    setIsEditModalOpen(true)
  }

  const openAddModal = () => {
    const newCard: MigrationItem = {
      id: Date.now().toString(),
      name: '',
      stack: 'Next.js 14 App Router',
      priority: 'High',
      stage: 'planning',
      progress: 20,
      quarter: 'Q4 2026',
      assignee: 'Dev Team',
      note: 'Initial planning',
    }
    setEditingCard(newCard)
    setIsNewCard(true)
    setIsEditModalOpen(true)
  }

  const saveEditingCard = () => {
    if (!editingCard || !editingCard.name.trim()) return

    if (isNewCard) {
      setMigrations(prev => [editingCard, ...prev])
    } else {
      setMigrations(prev => prev.map(m => m.id === editingCard.id ? editingCard : m))
    }
    setIsEditModalOpen(false)
    setEditingCard(null)
  }

  const deleteEditingCard = (id: string) => {
    if (confirm('Are you sure you want to delete this migration card?')) {
      setMigrations(prev => prev.filter(m => m.id !== id))
      setIsEditModalOpen(false)
      setEditingCard(null)
    }
  }

  // Reset to default data
  const handleResetData = () => {
    if (confirm('Reset all migration cards back to default state?')) {
      setMigrations(initialMigrations)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // Filtered migrations
  const filteredMigrations = migrations.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.stack.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (m.assignee && m.assignee.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchPriority = priorityFilter === 'All' || m.priority === priorityFilter
    return matchSearch && matchPriority
  })

  // Paginated migrations for List view
  const paginatedMigrations = filteredMigrations.slice(
    (listPage - 1) * listPageSize,
    listPage * listPageSize
  )

  // Dynamic statistics
  const total = migrations.length
  const completedCount = migrations.filter(m => m.stage === 'completed').length
  const remainingCount = total - completedCount
  const completionPercent = total ? Math.round((completedCount / total) * 100) : 0

  const planningCount = migrations.filter(m => m.stage === 'planning').length
  const inProgressCount = migrations.filter(m => m.stage === 'inProgress').length
  const testingCount = migrations.filter(m => m.stage === 'testing').length

  const planningPercent = total ? ((planningCount / total) * 100).toFixed(1) : '0'
  const inProgressPercent = total ? ((inProgressCount / total) * 100).toFixed(1) : '0'
  const testingPercent = total ? ((testingCount / total) * 100).toFixed(1) : '0'
  const completedPercent = total ? ((completedCount / total) * 100).toFixed(1) : '0'

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f1f3f5] font-sans text-[12px] p-2.5 sm:p-4 gap-4 lg:gap-6">
      {/* Sidebar (Desktop sticky + Mobile drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 py-1 min-w-0">
        <div className="w-full pb-10">
          {/* Responsive Header */}
          <Header title="Brisque OPS" subtitle="Operations Command Center" searchPlaceholder="Search Migrations..." />

          {/* Main Dashboard Blocks */}
          <motion.main 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="rounded-[16px] bg-white p-4 sm:p-6 shadow-sm space-y-6 sm:space-y-8"
          >
            {/* Migration Overview Section */}
            <motion.section variants={itemVariants}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] sm:text-[18px] font-bold text-neutral-900">Migration</h2>
                  <p className="mt-1 text-[12px] sm:text-[13px] text-neutral-500">
                    Drag and drop cards between columns or click <b>Move to Done</b>. Click any card to edit details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                  title="Reset to default board"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>
              
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-[12px] bg-[#f8f9fa] p-4 sm:p-5 shadow-sm border border-neutral-100">
                  <p className="text-[22px] sm:text-[26px] font-bold leading-none text-neutral-900">{total}</p>
                  <p className="mt-1 text-[12px] sm:text-[13px] font-medium text-neutral-600">Total Websites</p>
                </div>
                <div className="rounded-[12px] bg-[#f8f9fa] p-4 sm:p-5 shadow-sm border border-neutral-100">
                  <p className="text-[22px] sm:text-[26px] font-bold leading-none text-[#22c55e]">{completedCount}</p>
                  <p className="mt-1 text-[12px] sm:text-[13px] font-medium text-neutral-600">Migrated</p>
                </div>
                <div className="rounded-[12px] bg-[#f8f9fa] p-4 sm:p-5 shadow-sm border border-neutral-100">
                  <p className="text-[22px] sm:text-[26px] font-bold leading-none text-[#e27b4e]">{remainingCount}</p>
                  <p className="mt-1 text-[12px] sm:text-[13px] font-medium text-neutral-600">Remaining</p>
                </div>
                <div className="rounded-[12px] bg-[#f8f9fa] p-4 sm:p-5 shadow-sm border border-neutral-100">
                  <p className="text-[22px] sm:text-[26px] font-bold leading-none text-[#ef3340]">{completionPercent}%</p>
                  <p className="mt-1 text-[12px] sm:text-[13px] font-medium text-neutral-600">Migration %</p>
                </div>
              </div>

              {/* Timeline and Stages Box */}
              <div className="mt-5 rounded-[16px] bg-[#f8f9fa] p-4 sm:p-6 border border-neutral-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="rounded-md bg-white border border-neutral-200 px-3 sm:px-4 py-1.5 sm:py-2 text-[10.5px] sm:text-[11px] font-semibold text-neutral-600 shadow-sm whitespace-nowrap">
                    React.js ({remainingCount})
                  </span>
                  <div className="relative flex-1 flex items-center">
                    <div className="h-px w-full bg-neutral-400" />
                    <div className="absolute right-0 h-2 w-2 border-t border-r border-neutral-500 rotate-45 transform -translate-x-[1px]" />
                  </div>
                  <span className="rounded-md bg-neutral-900 px-3 sm:px-4 py-1.5 sm:py-2 text-[10.5px] sm:text-[11px] font-semibold text-white shadow-sm whitespace-nowrap">
                    Next.js ({completedCount})
                  </span>
                </div>
                
                <p className="mt-5 text-[12px] font-bold text-neutral-700">{completedCount} of {total} Websites Migrated ({completionPercent}%)</p>
                
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: 'Planning', count: planningCount, percent: `${planningPercent}%`, color: 'bg-neutral-300' },
                    { label: 'In Progress', count: inProgressCount, percent: `${inProgressPercent}%`, color: 'bg-[#facc15]' },
                    { label: 'Testing', count: testingCount, percent: `${testingPercent}%`, color: 'bg-[#ef3340]' },
                    { label: 'Completed', count: completedCount, percent: `${completedPercent}%`, color: 'bg-[#4caf60]' },
                  ].map(stage => (
                    <div key={stage.label} className="rounded-xl bg-white border border-neutral-100 p-3.5 sm:p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                        <span className="text-[11px] font-medium text-neutral-600 truncate">{stage.label}</span>
                      </div>
                      <p className="text-[18px] sm:text-[20px] font-bold text-neutral-900 mb-2">{stage.count} <span className="text-[10px] text-neutral-400 font-normal">({stage.percent})</span></p>
                      <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                        <div className={`h-full ${stage.color} transition-all duration-500`} style={{ width: stage.percent }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Migration Board Section */}
            <motion.section variants={itemVariants}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-[15px] sm:text-[16px] font-bold text-neutral-900">Migration Board</h2>
                  <p className="mt-0.5 text-[11.5px] sm:text-[12px] text-neutral-500">
                    Drag cards across columns • Click "Move to Done" • Click any card to edit details
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  {/* Add Migration Button */}
                  <button
                    type="button"
                    onClick={openAddModal}
                    className="flex items-center gap-1.5 rounded-lg bg-[#ef3340] hover:bg-red-600 text-white px-3 py-1.5 text-[11px] font-semibold transition-all shadow-sm cursor-pointer active:scale-95"
                  >
                    <Plus size={14} /> Add Card
                  </button>

                  {/* Search */}
                  <label className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Migrations..." 
                      className="w-[160px] sm:w-[190px] rounded-lg bg-[#f8f9fa] py-1.5 pl-9 pr-3 text-[11.5px] focus:outline-none transition-all hover:bg-neutral-100 border border-neutral-200 focus:bg-white" 
                    />
                  </label>

                  {/* Priority Selector */}
                  <select 
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="rounded-lg bg-[#f8f9fa] border border-neutral-200 px-3 py-1.5 text-[11.5px] font-medium text-neutral-700 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>

                  {/* View Mode Toggle (Board vs List) */}
                  <div className="flex items-center overflow-hidden rounded-lg border border-[#ef3340] bg-white shadow-xs">
                    <button 
                      type="button"
                      onClick={() => setViewMode('board')}
                      className={`flex items-center gap-2 px-4 py-1.5 text-[12px] font-bold transition-all cursor-pointer ${
                        viewMode === 'board' ? 'bg-[#ef3340] text-white shadow-xs' : 'bg-white text-neutral-800 hover:bg-neutral-50'
                      }`}
                    >
                      Board <LayoutGrid size={14} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`flex items-center gap-2 px-4 py-1.5 text-[12px] font-bold transition-all cursor-pointer ${
                        viewMode === 'list' ? 'bg-[#ef3340] text-white shadow-xs' : 'bg-white text-neutral-800 hover:bg-neutral-50'
                      }`}
                    >
                      List <List size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* View 1: Interactive Drag and Drop Kanban Board */}
              {viewMode === 'board' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* Column 1: Planning */}
                  <KanbanColumn
                    title="Planning"
                    stage="planning"
                    dotColor="bg-neutral-400"
                    badgeBg="bg-neutral-900"
                    badgeText="text-white"
                    isDragOver={dragOverStage === 'planning'}
                    onDragOver={(e) => handleDragOver(e, 'planning')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'planning')}
                    count={filteredMigrations.filter(m => m.stage === 'planning').length}
                  >
                    {filteredMigrations
                      .filter(m => m.stage === 'planning')
                      .map((item) => (
                        <KanbanCard
                          key={item.id}
                          item={item}
                          isDragged={draggedItemId === item.id}
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          onDragEnd={handleDragEnd}
                          onEdit={() => openEditModal(item)}
                          onMoveToDone={() => moveToDone(item.id)}
                          onStepForward={() => stepStage(item.id, 'forward')}
                        />
                      ))}
                  </KanbanColumn>

                  {/* Column 2: In Progress */}
                  <KanbanColumn
                    title="In Progress"
                    stage="inProgress"
                    dotColor="bg-[#facc15]"
                    badgeBg="bg-[#d4af37]"
                    badgeText="text-white"
                    isDragOver={dragOverStage === 'inProgress'}
                    onDragOver={(e) => handleDragOver(e, 'inProgress')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'inProgress')}
                    count={filteredMigrations.filter(m => m.stage === 'inProgress').length}
                  >
                    {filteredMigrations
                      .filter(m => m.stage === 'inProgress')
                      .map((item) => (
                        <KanbanCard
                          key={item.id}
                          item={item}
                          isDragged={draggedItemId === item.id}
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          onDragEnd={handleDragEnd}
                          onEdit={() => openEditModal(item)}
                          onMoveToDone={() => moveToDone(item.id)}
                          onStepBackward={() => stepStage(item.id, 'backward')}
                          onStepForward={() => stepStage(item.id, 'forward')}
                        />
                      ))}
                  </KanbanColumn>

                  {/* Column 3: Testing (QA) */}
                  <KanbanColumn
                    title="Testing (QA)"
                    stage="testing"
                    dotColor="bg-[#ef3340]"
                    badgeBg="bg-[#ef3340]"
                    badgeText="text-white"
                    isDragOver={dragOverStage === 'testing'}
                    onDragOver={(e) => handleDragOver(e, 'testing')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'testing')}
                    count={filteredMigrations.filter(m => m.stage === 'testing').length}
                  >
                    {filteredMigrations
                      .filter(m => m.stage === 'testing')
                      .map((item) => (
                        <KanbanCard
                          key={item.id}
                          item={item}
                          isDragged={draggedItemId === item.id}
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          onDragEnd={handleDragEnd}
                          onEdit={() => openEditModal(item)}
                          onMoveToDone={() => moveToDone(item.id)}
                          onStepBackward={() => stepStage(item.id, 'backward')}
                          onStepForward={() => stepStage(item.id, 'forward')}
                        />
                      ))}
                  </KanbanColumn>

                  {/* Column 4: Completed (Done) */}
                  <KanbanColumn
                    title="Completed"
                    stage="completed"
                    dotColor="bg-[#22c55e]"
                    badgeBg="bg-[#22c55e]"
                    badgeText="text-white"
                    isDragOver={dragOverStage === 'completed'}
                    onDragOver={(e) => handleDragOver(e, 'completed')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'completed')}
                    count={filteredMigrations.filter(m => m.stage === 'completed').length}
                  >
                    {filteredMigrations
                      .filter(m => m.stage === 'completed')
                      .map((item) => (
                        <KanbanCard
                          key={item.id}
                          item={item}
                          isDragged={draggedItemId === item.id}
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          onDragEnd={handleDragEnd}
                          onEdit={() => openEditModal(item)}
                          onStepBackward={() => stepStage(item.id, 'backward')}
                        />
                      ))}
                  </KanbanColumn>
                </div>
              ) : (
                /* View 2: List View Table */
                <div className="w-full overflow-x-auto custom-scrollbar pb-3">
                  <div className="min-w-[700px]">
                    <table className="w-full text-left text-[11.5px] border-separate border-spacing-y-2.5">
                      <thead>
                        <tr className="bg-[#fff1f2] text-neutral-700">
                          <th className="px-4 py-3 font-semibold rounded-l-[12px]">Client</th>
                          <th className="px-4 py-3 font-semibold">Tech Stack</th>
                          <th className="px-4 py-3 font-semibold">Priority</th>
                          <th className="px-4 py-3 font-semibold">Stage</th>
                          <th className="px-4 py-3 font-semibold">Progress</th>
                          <th className="px-4 py-3 font-semibold rounded-r-[12px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedMigrations.map((item) => (
                          <tr 
                            key={item.id} 
                            onClick={() => openEditModal(item)}
                            className="bg-[#f8f9fa] hover:bg-neutral-100 transition-colors group cursor-pointer"
                            title="Click row to edit details"
                          >
                            <td className="px-4 py-3 rounded-l-[12px] font-bold text-neutral-900">{item.name}</td>
                            <td className="px-4 py-3 text-neutral-600">{item.stack}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                item.priority === 'High' ? 'bg-[#fce8e8] text-[#ef3340]' : item.priority === 'Medium' ? 'bg-[#ffeed9] text-[#e27b4e]' : 'bg-[#e5f4e8] text-[#4caf60]'
                              }`}>
                                {item.priority}
                              </span>
                            </td>
                            <td className="px-4 py-3 capitalize font-semibold text-neutral-700">
                              {item.stage === 'inProgress' ? 'In Progress' : item.stage}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-20 rounded-full bg-neutral-200 overflow-hidden">
                                  <div 
                                    className={`h-full ${item.stage === 'completed' ? 'bg-[#22c55e]' : item.stage === 'testing' ? 'bg-[#ef3340]' : 'bg-[#facc15]'}`} 
                                    style={{ width: `${item.progress ?? (item.stage === 'completed' ? 100 : 20)}%` }} 
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-neutral-600">{item.progress ?? (item.stage === 'completed' ? 100 : 20)}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 rounded-r-[12px]">
                              <div className="flex items-center gap-2">
                                {item.stage !== 'completed' && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      moveToDone(item.id)
                                    }}
                                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-green-50 text-[#22c55e] border border-green-200 text-[10px] font-bold hover:bg-green-100 transition-colors cursor-pointer"
                                    title="Move to Done"
                                  >
                                    <Check size={11} strokeWidth={3} /> Done
                                  </button>
                                )}
                                <button
                                  type="button"
                                  disabled={item.stage === 'planning'}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    stepStage(item.id, 'backward')
                                  }}
                                  className="p-1 rounded hover:bg-neutral-200 text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                  title="Move backward"
                                >
                                  <ArrowLeft size={13} />
                                </button>
                                <button
                                  type="button"
                                  disabled={item.stage === 'completed'}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    stepStage(item.id, 'forward')
                                  }}
                                  className="p-1 rounded hover:bg-neutral-200 text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                  title="Move forward"
                                >
                                  <ArrowRight size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* List View Pagination */}
                  <Pagination
                    currentPage={listPage}
                    totalItems={filteredMigrations.length}
                    pageSize={listPageSize}
                    onPageChange={setListPage}
                    onPageSizeChange={setListPageSize}
                    pageSizeOptions={[4, 8, 12, 16]}
                  />
                </div>
              )}
            </motion.section>
          </motion.main>
        </div>
      </div>

      {/* ── Edit / Add Card Modal ── */}
      <AnimatePresence>
        {isEditModalOpen && editingCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-neutral-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-[#ef3340]">
                    {isNewCard ? <Plus size={16} /> : <Pencil size={15} />}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-neutral-900">
                      {isNewCard ? 'Add Migration Card' : 'Edit Migration Card'}
                    </h3>
                    <p className="text-[11px] text-neutral-500">Update stage, stack, priority, and progress</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-3.5 text-[12px]">
                {/* Client Name */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Client / Website Name</label>
                  <input
                    type="text"
                    value={editingCard.name}
                    onChange={(e) => setEditingCard({ ...editingCard, name: e.target.value })}
                    placeholder="e.g. Pakka Spice Romeoville"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={editingCard.stack}
                    onChange={(e) => setEditingCard({ ...editingCard, stack: e.target.value })}
                    placeholder="e.g. Next.js 14 App Router"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                  />
                </div>

                {/* Stage & Priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Stage Column</label>
                    <select
                      value={editingCard.stage}
                      onChange={(e) => {
                        const newStage = e.target.value as StageType
                        const newProg = newStage === 'completed' ? 100 : editingCard.progress
                        setEditingCard({ ...editingCard, stage: newStage, progress: newProg })
                      }}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] font-medium bg-white focus:border-[#ef3340] focus:outline-none cursor-pointer"
                    >
                      <option value="planning">Planning</option>
                      <option value="inProgress">In Progress</option>
                      <option value="testing">Testing (QA)</option>
                      <option value="completed">Completed (Done)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Priority</label>
                    <select
                      value={editingCard.priority}
                      onChange={(e) => setEditingCard({ ...editingCard, priority: e.target.value as any })}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] font-medium bg-white focus:border-[#ef3340] focus:outline-none cursor-pointer"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Progress Bar & Slider */}
                <div>
                  <div className="flex items-center justify-between font-semibold text-neutral-700 mb-1">
                    <span>Progress / QA Readiness</span>
                    <span className="font-bold text-[#ef3340]">{editingCard.progress ?? 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editingCard.progress ?? 0}
                    onChange={(e) => setEditingCard({ ...editingCard, progress: Number(e.target.value) })}
                    className="w-full accent-[#ef3340] cursor-pointer"
                  />
                </div>

                {/* Assignee & Note */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Assignee</label>
                    <input
                      type="text"
                      value={editingCard.assignee || ''}
                      onChange={(e) => setEditingCard({ ...editingCard, assignee: e.target.value })}
                      placeholder="e.g. Yoga"
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Target / Quarter</label>
                    <input
                      type="text"
                      value={editingCard.quarter || editingCard.date || ''}
                      onChange={(e) => setEditingCard({ ...editingCard, quarter: e.target.value })}
                      placeholder="e.g. Q4 2026 or Oct 20, 2026"
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">QA Note / Status Text</label>
                  <input
                    type="text"
                    value={editingCard.note || editingCard.status || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, note: e.target.value, status: e.target.value })}
                    placeholder="e.g. QA In Review or Live in Production"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-2">
                  {!isNewCard && (
                    <button
                      type="button"
                      onClick={() => deleteEditingCard(editingCard.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#ef3340] hover:text-red-700 p-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                  {editingCard.stage !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => setEditingCard({ ...editingCard, stage: 'completed', progress: 100, status: 'Live in Production' })}
                      className="flex items-center gap-1 rounded-lg bg-green-50 text-[#22c55e] border border-green-200 px-2.5 py-1.5 text-[11px] font-bold hover:bg-green-100 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={13} /> Set to Done
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-lg bg-neutral-100 px-3 py-1.5 text-[11.5px] font-medium text-neutral-600 hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEditingCard}
                    className="rounded-lg bg-[#ef3340] px-4 py-1.5 text-[11.5px] font-bold text-white hover:bg-red-600 transition-colors cursor-pointer shadow-sm active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Kanban Column Component ─────────────────────────────────────
interface KanbanColumnProps {
  title: string
  stage: StageType
  dotColor: string
  badgeBg: string
  badgeText: string
  count: number
  isDragOver: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  children: React.ReactNode
}

function KanbanColumn({
  title,
  dotColor,
  badgeBg,
  badgeText,
  count,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}: KanbanColumnProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex flex-col rounded-[16px] p-4 transition-all duration-200 min-h-[380px] ${
        isDragOver
          ? 'bg-red-50/60 border-2 border-dashed border-[#ef3340] shadow-md scale-[1.01]'
          : 'bg-[#f8f9fa] border border-neutral-200/80 shadow-xs'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200/70 mb-3 select-none">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
          <h3 className="font-bold text-[13px] text-neutral-900">{title}</h3>
        </div>
        <span className={`flex h-5 w-5 items-center justify-center rounded-full ${badgeBg} ${badgeText} text-[10px] font-bold`}>
          {count}
        </span>
      </div>

      {/* Cards container */}
      <div className="space-y-3 flex-1">
        {children}

        {/* Drop placeholder indicator when dragging over */}
        {isDragOver && (
          <div className="rounded-xl border-2 border-dashed border-[#ef3340]/60 bg-white/70 p-4 text-center text-[11px] font-bold text-[#ef3340] animate-pulse">
            Drop here to move to {title}
          </div>
        )}

        {count === 0 && !isDragOver && (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-neutral-200 text-[11px] font-medium text-neutral-400">
            No cards in {title}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Kanban Card Component ───────────────────────────────────────
interface KanbanCardProps {
  item: MigrationItem
  isDragged: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
  onEdit: () => void
  onMoveToDone?: () => void
  onStepBackward?: () => void
  onStepForward?: () => void
}

function KanbanCard({
  item,
  isDragged,
  onDragStart,
  onDragEnd,
  onEdit,
  onMoveToDone,
  onStepBackward,
  onStepForward,
}: KanbanCardProps) {
  const isCompleted = item.stage === 'completed'
  const isDraggingRef = useRef(false)

  return (
    <div
      draggable
      onDragStart={(e) => {
        isDraggingRef.current = true
        onDragStart(e)
      }}
      onDragEnd={(e) => {
        setTimeout(() => {
          isDraggingRef.current = false
        }, 80)
        onDragEnd(e)
      }}
      onClick={() => {
        if (!isDraggingRef.current) {
          onEdit()
        }
      }}
      className={`group relative rounded-xl bg-white p-3.5 shadow-sm border transition-all cursor-pointer hover:border-neutral-300 hover:shadow-md select-none ${
        isDragged ? 'opacity-40 scale-[0.98] border-dashed border-[#ef3340]' : 'border-neutral-100'
      }`}
    >
      {/* Top Header: Client Name, Drag handle, Priority */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 min-w-0">
          <GripVertical size={13} className="text-neutral-300 group-hover:text-neutral-500 mt-0.5 shrink-0" />
          <p className="font-bold text-[12.5px] text-neutral-900 truncate" title={item.name}>
            {item.name}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Priority or Done Badge */}
          {isCompleted ? (
            <span className="rounded-full bg-[#e5f4e8] px-2 py-0.5 text-[9.5px] font-semibold text-[#22c55e] flex items-center gap-0.5">
              <CheckCircle2 size={10} /> Done
            </span>
          ) : (
            <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-semibold ${
              item.priority === 'High' ? 'bg-[#fce8e8] text-[#ef3340]' : item.priority === 'Medium' ? 'bg-[#ffeed9] text-[#e27b4e]' : 'bg-neutral-100 text-neutral-600'
            }`}>
              {item.priority}
            </span>
          )}
        </div>
      </div>

      {/* Tech Stack Subtitle */}
      <p className="text-[11px] text-neutral-500 mt-1 pl-4.5">{item.stack}</p>

      {/* Progress Bar (if in Progress or Testing) */}
      {!isCompleted && item.progress !== undefined && (
        <div className="mt-3 pl-4.5">
          <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
            <span>{item.stage === 'testing' ? 'QA Readiness' : 'Progress'}</span>
            <span className={`font-bold ${item.stage === 'testing' ? 'text-[#ef3340]' : 'text-[#e27b4e]'}`}>
              {item.progress}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                item.stage === 'testing' ? 'bg-[#ef3340]' : 'bg-[#facc15]'
              }`}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Meta info & notes */}
      <div className="pl-4.5">
        {item.stage === 'planning' && item.quarter && (
          <p className="text-[10px] text-neutral-400 mt-2 flex items-center gap-1.5">
            <Clock size={11} /> Target: {item.quarter}
          </p>
        )}

        {item.stage === 'inProgress' && item.assignee && (
          <p className="text-[10px] text-neutral-400 mt-2.5">
            Assignee: <b className="text-neutral-700">{item.assignee}</b>
          </p>
        )}

        {item.stage === 'testing' && item.note && (
          <p className="text-[10px] text-[#ef3340] mt-2.5 font-semibold flex items-center gap-1">
            <AlertCircle size={11} /> {item.note}
          </p>
        )}

        {isCompleted && (
          <p className="text-[10px] text-[#22c55e] font-semibold mt-2.5 flex items-center gap-1">
            <ShieldCheck size={11} /> {item.status || 'Live in Production'}
          </p>
        )}
      </div>

      {/* Quick Action Footer */}
      <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between pl-4.5">
        <div className="flex items-center gap-1">
          {onStepBackward && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onStepBackward()
              }}
              className="flex items-center gap-0.5 text-[10px] font-semibold text-neutral-500 hover:text-neutral-800 p-1 rounded hover:bg-neutral-100 cursor-pointer"
              title="Step backward"
            >
              <ArrowLeft size={10} /> Back
            </button>
          )}

          {onStepForward && !isCompleted && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onStepForward()
              }}
              className="flex items-center gap-0.5 text-[10px] font-semibold text-neutral-600 hover:text-[#ef3340] p-1 rounded hover:bg-neutral-100 cursor-pointer"
              title="Advance stage"
            >
              Next <ArrowRight size={10} />
            </button>
          )}
        </div>

        {/* Move to Done Button */}
        {!isCompleted && onMoveToDone && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onMoveToDone()
            }}
            className="flex items-center gap-1 rounded-md bg-green-50 text-[#22c55e] border border-green-200 px-2 py-0.5 text-[9.5px] font-bold hover:bg-green-100 hover:border-green-300 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Move straight to Completed (Done)"
          >
            <CheckCircle2 size={11} /> Move to Done
          </button>
        )}

        {isCompleted && item.date && (
          <span className="text-[10px] text-neutral-400">{item.date}</span>
        )}
      </div>
    </div>
  )
}
