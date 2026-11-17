import { 
  CheckCircle2, Circle, Clock, Globe, MinusCircle, Rocket, Search, ShieldCheck,
  ChevronLeft, ChevronRight, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown, Minus,
  Check, Calendar, Plus, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import DonutChart from '../components/DonutChart'
import CircularProgress from '../components/CircularProgress'
import rocketImg from '../assets/React Page Rocket.png'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Pagination from '../components/Pagination'

const stats = [
  ['Total Websites', 8, Globe, 'bg-[#3478b9]'],
  ['Order Completed', 5, CheckCircle2, 'bg-[#4caf60]'],
  ['Ordering in Progress', 2, Clock, 'bg-[#e27b4e]'],
  ['Migrated to Next.JS', 6, Rocket, 'bg-[#bf3d3d]'],
  ['QA / Ready', 4, ShieldCheck, 'bg-[#ae8e55]'],
] as const

const rollout = [
  ['Order Completed', 5, '62%', '#4caf60'],
  ['In Progress',     2, '25%', '#f2a04b'],
  ['Not Started',     1, '13%', '#ef3340'],
  ['NA',              0, '0%',  '#e5e7eb'],
] as const

// ── Weekly Data Sets ──────────────────────────────────────────
const WEEKS = [
  {
    id: 'oct-w3',
    title: 'October 3rd Week',
    range: 'Oct 13 - Oct 19',
    label: 'October 3rd Week (Oct 13 - Oct 19)',
    tasks: [
      { website: 'Pakka Spice Landing Page', type: 'Emb Ordering', priority: 'High', due: 'Oct 18, 2026', status: 'Completed' },
      { website: 'Madurai Kitchen Menu Sync', type: 'Menu Sync', priority: 'Medium', due: 'Oct 17, 2026', status: 'Completed' },
      { website: 'Manam Onam Event UI', type: 'Event Ordering', priority: 'High', due: 'Oct 19, 2026', status: 'Completed' },
      { website: 'Bheema Staging Database', type: 'Migration', priority: 'Medium', due: 'Oct 15, 2026', status: 'Completed' },
      { website: 'Sangam Restaurant Assets', type: 'Reservation', priority: 'Low', due: 'Oct 16, 2026', status: 'Completed' },
    ],
  },
  {
    id: 'oct-w4',
    title: 'October 4th Week',
    range: 'Oct 20 - Oct 26',
    label: 'October 4th Week (Oct 20 - Oct 26)',
    tasks: [
      { website: 'Monks Allen Hotfix', type: 'Bug Fix', priority: 'Low', due: 'Oct 22, 2026', overdue: true, status: 'In progress' },
      { website: 'Madurai Kitchen Launch', type: 'QA Sign-off', priority: 'High', due: 'Oct 24, 2026', status: 'Completed' },
      { website: 'Bheema Production Cutover', type: 'Migration', priority: 'High', due: 'Oct 25, 2026', status: 'Completed' },
      { website: 'Aaha Kitchen API Hook', type: 'Emb Ordering', priority: 'Medium', due: 'Oct 26, 2026', status: 'In progress' },
      { website: 'Manam Reservation QA', type: 'Reservation', priority: 'Medium', due: 'Oct 23, 2026', status: 'Review' },
      { website: 'Amudham Stripe Connect', type: 'Payment Gateway', priority: 'High', due: 'Oct 25, 2026', status: 'Completed' },
    ],
  },
  {
    id: 'oct-w5',
    title: 'October 5th Week',
    range: 'Oct 27 - Nov 02',
    label: 'October 5th Week (Oct 27 - Nov 02)',
    tasks: [
      { website: 'Amudham Restaurant', type: 'Emb Ordering', priority: 'Medium', due: 'Nov 5, 2026', status: 'Review' },
      { website: 'Bheema Next.js', type: 'Migration', priority: 'High', due: 'Nov 3, 2026', status: 'In progress' },
      { website: 'Manam Onam Event Page', type: 'Event Ordering', priority: 'High', due: 'Oct 28, 2026', status: 'Completed' },
      { website: 'Monks Allen Hotfix', type: 'Bug Fix', priority: 'Low', due: 'Oct 22, 2026', overdue: true, status: 'In progress' },
      { website: 'Sangam Restaurant', type: 'Reservation', priority: 'High', due: 'Nov 8, 2026', status: 'Block' },
      { website: 'Aaha Kitchen', type: 'Emb Ordering', priority: 'High', due: 'Nov 10, 2026', status: 'In progress' },
      { website: 'Pakka Spice Romeoville', type: 'QA Sign-off', priority: 'Medium', due: 'Nov 12, 2026', status: 'In progress' },
    ],
  },
  {
    id: 'nov-w1',
    title: 'November 1st Week',
    range: 'Nov 03 - Nov 09',
    label: 'November 1st Week (Nov 03 - Nov 09)',
    tasks: [
      { website: 'Sangam Next.js Migration', type: 'Migration', priority: 'High', due: 'Nov 06, 2026', status: 'In progress' },
      { website: 'Aaha Kitchen Go-Live', type: 'Emb Ordering', priority: 'High', due: 'Nov 07, 2026', status: 'Review' },
      { website: 'Pakka Spice Romeoville Final QA', type: 'QA Sign-off', priority: 'Medium', due: 'Nov 05, 2026', status: 'In progress' },
      { website: 'Monks Allen Cart Value Bug', type: 'Bug Fix', priority: 'High', due: 'Nov 04, 2026', status: 'Block' },
      { website: 'Amudham Analytics Setup', type: 'Analytics', priority: 'Low', due: 'Nov 08, 2026', status: 'In progress' },
    ],
  },
  {
    id: 'nov-w2',
    title: 'November 2nd Week',
    range: 'Nov 10 - Nov 16',
    label: 'November 2nd Week (Nov 10 - Nov 16)',
    tasks: [
      { website: 'Pakka Spice Embedded Launch', type: 'Emb Ordering', priority: 'High', due: 'Nov 12, 2026', status: 'Review' },
      { website: 'Sangam Staging Testing', type: 'Migration', priority: 'High', due: 'Nov 14, 2026', status: 'In progress' },
      { website: 'Monks Allen Modifiers Hotfix', type: 'Bug Fix', priority: 'Medium', due: 'Nov 15, 2026', status: 'In progress' },
      { website: 'Madurai Kitchen Offer Campaign', type: 'Offers', priority: 'Low', due: 'Nov 16, 2026', status: 'Review' },
    ],
  },
]

function PriorityPill({ priority }: { priority: string }) {
  if (priority === 'High') return <span className="inline-flex items-center gap-1 rounded-full bg-[#fce8e8] px-2.5 py-1 text-[10px] font-medium text-[#ef3340]"><ArrowUp size={10} />High</span>
  if (priority === 'Medium') return <span className="inline-flex items-center gap-1 rounded-full bg-[#ffeed9] px-2.5 py-1 text-[10px] font-medium text-[#e27b4e]"><Minus size={10} />Medium</span>
  if (priority === 'Low') return <span className="inline-flex items-center gap-1 rounded-full bg-[#e5f4e8] px-2.5 py-1 text-[10px] font-medium text-[#4caf60]"><ArrowDown size={10} />Low</span>
  return null
}

function getStatusColor(status: string) {
  if (status === 'Review') return 'bg-[#94a3b8] text-[#94a3b8]'
  if (status === 'In progress') return 'bg-[#d4af37] text-[#d4af37]'
  if (status === 'Completed') return 'bg-[#22c55e] text-[#22c55e]'
  if (status === 'Block') return 'bg-[#ef4444] text-[#ef4444]'
  return 'bg-neutral-400 text-neutral-400'
}

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

function CountUp({ target, duration = 900 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const startTime = performance.now()
    let frame = 0

    function animate(now: number) {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [duration, target])

  return <>{value}</>
}

export default function DashboardPage() {
  // ── Weekly Priority Interactive State ───────────────────────
  const [allWeeks, setAllWeeks] = useState(WEEKS)
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(2) // Default: Oct 5th Week
  const [isWeekDropdownOpen, setIsWeekDropdownOpen] = useState(false)
  const weekDropdownRef = useRef<HTMLDivElement>(null)

  // ── Sorting State ───────────────────────────────────────────
  const [sortField, setSortField] = useState<'website' | 'priority' | 'due' | 'status' | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // ── Add Task Modal State ────────────────────────────────────
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTaskWebsite, setNewTaskWebsite] = useState('')
  const [newTaskType, setNewTaskType] = useState('Embedded Ordering')
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('High')
  const [newTaskDue, setNewTaskDue] = useState('Nov 15, 2026')
  const [newTaskStatus, setNewTaskStatus] = useState('In progress')



  // ── Filters & Search ────────────────────────────────────────
  const [searchTask, setSearchTask] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)

  const statusDropdownRef = useRef<HTMLDivElement>(null)
  const priorityDropdownRef = useRef<HTMLDivElement>(null)

  // ── Pagination State ────────────────────────────────────────
  const [taskPage, setTaskPage] = useState(1)
  const [taskPageSize, setTaskPageSize] = useState(4) // default 4 rows as requested

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (weekDropdownRef.current && !weekDropdownRef.current.contains(e.target as Node)) {
        setIsWeekDropdownOpen(false)
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setIsStatusDropdownOpen(false)
      }
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(e.target as Node)) {
        setIsPriorityDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentWeek = allWeeks[selectedWeekIndex]

  // Week navigation
  const handlePrevWeek = () => {
    if (selectedWeekIndex > 0) {
      setSelectedWeekIndex(prev => prev - 1)
      setTaskPage(1)
    }
  }

  const handleNextWeek = () => {
    if (selectedWeekIndex < allWeeks.length - 1) {
      setSelectedWeekIndex(prev => prev + 1)
      setTaskPage(1)
    }
  }

  // Cycle task status on click
  const cycleTaskStatus = (taskIndex: number) => {
    const statuses = ['Review', 'In progress', 'Completed', 'Block']
    setAllWeeks(prev => {
      const nextWeeks = [...prev]
      const currentTasks = [...nextWeeks[selectedWeekIndex].tasks]
      const currentStatus = currentTasks[taskIndex].status
      const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length
      currentTasks[taskIndex] = {
        ...currentTasks[taskIndex],
        status: statuses[nextIdx],
        overdue: statuses[nextIdx] === 'Completed' ? false : currentTasks[taskIndex].overdue,
      }
      nextWeeks[selectedWeekIndex] = {
        ...nextWeeks[selectedWeekIndex],
        tasks: currentTasks,
      }
      return nextWeeks
    })
  }

  // Handle header sort
  const handleSort = (field: 'website' | 'priority' | 'due' | 'status') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setTaskPage(1)
  }

  // Handle create new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskWebsite.trim()) return

    const createdTask = {
      website: newTaskWebsite.trim(),
      type: newTaskType,
      priority: newTaskPriority,
      due: newTaskDue,
      status: newTaskStatus,
      overdue: false,
    }

    setAllWeeks(prev => {
      const next = [...prev]
      const tasks = [createdTask, ...next[selectedWeekIndex].tasks]
      next[selectedWeekIndex] = {
        ...next[selectedWeekIndex],
        tasks,
      }
      return next
    })

    setNewTaskWebsite('')
    setIsAddTaskOpen(false)
    setTaskPage(1)
  }



  // Filter & sort tasks
  const filteredTasks = currentWeek.tasks
    .filter((task) => {
      const matchesSearch =
        task.website.toLowerCase().includes(searchTask.toLowerCase()) ||
        task.type.toLowerCase().includes(searchTask.toLowerCase())
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      if (!sortField) return 0
      let comparison = 0
      if (sortField === 'website') {
        comparison = a.website.localeCompare(b.website)
      } else if (sortField === 'priority') {
        const order = { High: 3, Medium: 2, Low: 1 }
        comparison = (order[a.priority as 'High'] || 0) - (order[b.priority as 'High'] || 0)
      } else if (sortField === 'due') {
        comparison = a.due.localeCompare(b.due)
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  // Sliced paginated tasks for the current page
  const totalTaskPages = Math.max(1, Math.ceil(filteredTasks.length / taskPageSize))
  const safeTaskPage = Math.min(taskPage, totalTaskPages)
  const paginatedTasks = filteredTasks.slice(
    (safeTaskPage - 1) * taskPageSize,
    safeTaskPage * taskPageSize
  )

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f1f3f5] font-sans text-[12px] p-2.5 sm:p-4 gap-4 lg:gap-6">
      {/* Sidebar (Desktop sticky + Mobile drawer) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 py-1 min-w-0">
        <div className="w-full pb-10">
          {/* Responsive Header */}
          <Header title="Orbit OPS" subtitle="Operations Command Center" />

          {/* Main Dashboard Blocks */}
          <motion.main 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="rounded-[16px] bg-white p-4 sm:p-6 shadow-sm space-y-6"
          >
            {/* Operations Overview */}
            <motion.section variants={itemVariants}>
              <h2 className="text-[15px] sm:text-[16px] font-bold text-neutral-900">Operations Overview</h2>
              <p className="mt-0.5 text-[11.5px] sm:text-[12px] text-neutral-400">Track embedded ordering rollout, migration progress and client readiness across the website portfolio.</p>
              
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                {stats.map(([label, value, Icon, bg]) => (
                  <div key={label} className={`relative flex min-h-[72px] sm:min-h-[80px] flex-col justify-between rounded-xl ${bg} px-3.5 py-2.5 text-white shadow-sm hover:scale-[1.02] transition-transform`}>
                    <div className="flex items-start justify-between">
                      <p className="text-[20px] sm:text-[22px] font-bold leading-none"><CountUp target={value} /></p>
                      <Icon size={16} className="opacity-80" />
                    </div>
                    <p className="mt-1 text-[10.5px] sm:text-[11px] font-medium leading-tight opacity-90">{label}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Embedded Ordering Rollout */}
            <motion.section variants={itemVariants}>
              <h2 className="text-[15px] sm:text-[16px] font-bold text-neutral-900">Embedded Ordering Rollout</h2>
              <p className="mt-0.5 text-[11.5px] sm:text-[12px] text-neutral-400">Primary rollout metric — online ordering status across the website portfolio</p>
              
              <div className="mt-4 grid gap-4 grid-cols-1 lg:grid-cols-[280px_1fr]">
                {/* Donut Chart Box */}
                <div className="flex flex-col items-center gap-5 rounded-[16px] bg-[#f8f9fa] p-5 sm:flex-row sm:justify-center lg:flex-col">
                  <DonutChart centerValue={5} centerLabel="Completed" size={130} strokeWidth={12} segments={[{ value: rollout[0][1], color: rollout[0][3] }, { value: rollout[1][1], color: rollout[1][3] }, { value: rollout[2][1], color: rollout[2][3] }]} />
                  <ul className="w-full space-y-2.5">
                    {rollout.map(([label, value, percent, color]) => (
                      <li key={label} className="flex justify-between text-[11px]">
                        <span className="flex items-center gap-2 text-neutral-500">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                          {label}
                        </span>
                        <span className="text-neutral-400">
                          <b className="mr-3 text-neutral-700">{value}</b>
                          {percent}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Completed Rate Box */}
                <div className="flex flex-col justify-center rounded-[16px] bg-[#f8f9fa] p-5 sm:p-6">
                  <p className="text-[12px] font-medium text-neutral-700">Completed Rate</p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <p className="text-[36px] sm:text-[40px] font-bold leading-none text-[#3cab56]"><CountUp target={62} />%</p>
                    <p className="text-[11.5px] sm:text-[12px] text-neutral-400">5 of 8 Websites have ordering live</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-full w-[62%] bg-[#3cab56]" />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 sm:gap-3 text-[10.5px] sm:text-[11px]">
                    <span className="flex items-center gap-1.5 rounded-md bg-[#e5f4e8] px-2.5 py-1.5 text-[#4caf60]"><Clock size={13} />2 In Progress</span>
                    <span className="flex items-center gap-1.5 rounded-md bg-[#fff3b5] px-2.5 py-1.5 text-[#ae8e55]"><Circle size={13} fill="currentColor" className="text-[#facc15]" />1 Not Started Yet</span>
                    <span className="flex items-center gap-1.5 rounded-md bg-white border border-neutral-200 px-2.5 py-1.5 text-neutral-500"><MinusCircle size={13} />0 Not Applicable</span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Migration & Technology Landscape Section */}
            <motion.section variants={itemVariants} className="grid gap-4 grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
              {/* Migration Box */}
              <div className="rounded-[16px] bg-[#f8f9fa] p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[14px] font-bold text-neutral-900">React → Next.js Migration</h2>
                    <p className="mt-0.5 text-[11px] text-neutral-400">6 migrated · 2 remaining</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#e5f4e8] px-2.5 py-1 text-[10px] font-medium text-[#22a35a]">
                    <CheckCircle2 size={12} />On Track
                  </span>
                </div>
                <div className="mt-5 grid items-center gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-[140px_1fr]">
                  <div className="flex justify-center">
                    <CircularProgress percent={75} size={130} strokeWidth={12} value="75.0%" label="Migrated to Next.js" />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-2.5 sm:gap-3">
                      {[['8', 'Total Websites'], ['6', 'Migrated to Next.js'], ['2', 'Still on React']].map(([value, label]) => (
                        <div key={label} className="flex flex-col justify-center rounded-xl bg-white p-2.5 sm:p-3 text-center shadow-sm">
                          <p className="text-[18px] font-bold text-neutral-900"><CountUp target={Number(value)} /></p>
                          <p className="mt-1 text-[8.5px] leading-[1.2] text-neutral-500">{label}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-neutral-500">
                        <span>Migration Completion</span>
                        <span><CountUp target={75} />%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.1, delay: 0.8, ease: 'easeOut' }} className="h-full rounded-full bg-[#ef3340]" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-white border border-neutral-200 px-3 py-1.5 text-[10px] font-medium text-neutral-600">React.js (2)</span>
                      <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }} className="relative flex-1 flex items-center">
                        <div className="h-px w-full bg-neutral-300" />
                        <div className="absolute right-0 h-1.5 w-1.5 border-t border-r border-neutral-400 rotate-45 transform -translate-x-[1px]" />
                      </motion.div>
                      <span className="rounded-md bg-neutral-900 px-3 py-1.5 text-[10px] font-medium text-white">Next.js (6)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Technology Landscape Box */}
              <div className="rounded-[16px] bg-[#f8f9fa] p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <h2 className="text-[14px] font-bold text-neutral-900">Technology Landscape</h2>
                  <p className="mt-0.5 text-[11px] text-neutral-400">Website distribution by platform</p>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-[11.5px] font-medium text-neutral-600 mb-1">
                        <span>Next.js</span>
                        <span className="text-neutral-500 font-bold">6 (75%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.1, delay: 1.1, ease: 'easeOut' }} className="h-full rounded-full bg-[#ef3340]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11.5px] font-medium text-neutral-600 mb-1">
                        <span>React.js</span>
                        <span className="text-neutral-500 font-bold">2 (25%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} transition={{ duration: 1.1, delay: 1.2, ease: 'easeOut' }} className="h-full rounded-full bg-neutral-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col items-center">
                  <img src={rocketImg} alt="Fully migrated to Next.js" className="rocket-float w-[130px] sm:w-[150px] object-contain" />
                  <div className="mt-2 text-center">
                    <p className="text-[#3b82f6] font-bold text-[11.5px]">Fast Progress</p>
                    <p className="text-[#ef3340] font-bold text-[12px]">75% Migrated to Next.js</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Migration Stages */}
            <motion.section variants={itemVariants} className="rounded-[16px] bg-[#f8f9fa] p-4 sm:p-5 border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] sm:text-[15px] font-bold text-neutral-900">Migration Stages</h2>
                <span className="text-[11px] text-neutral-400 font-medium">8 Migrations Tracked</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'Planning', count: 1, percent: '12.5%', color: 'bg-neutral-300' },
                  { label: 'In Progress', count: 1, percent: '12.5%', color: 'bg-[#facc15]' },
                  { label: 'Testing', count: 2, percent: '25%', color: 'bg-[#ef3340]' },
                  { label: 'Completed', count: 4, percent: '50%', color: 'bg-[#4caf60]' },
                ].map(stage => (
                  <div key={stage.label} className="rounded-xl bg-white border border-neutral-200 p-3 sm:p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                      <span className="text-[11px] font-medium text-neutral-600 truncate">{stage.label}</span>
                    </div>
                    <p className="text-[17px] sm:text-[18px] font-bold text-neutral-900 mb-2">
                      {stage.count} <span className="text-[10px] text-neutral-400 font-normal">({stage.percent})</span>
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                      <div className={`h-full ${stage.color}`} style={{ width: stage.percent }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ── Weekly Priority (Interactive Week Selector) ── */}
            <motion.section variants={itemVariants} className="rounded-[16px] bg-white pt-2">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-[15px] sm:text-[16px] font-bold text-neutral-900">Weekly Priority</h2>
                  <p className="mt-0.5 text-[11px] text-neutral-400">
                    {currentWeek.title} <span className="mx-1">•</span> {currentWeek.range}
                  </p>
                </div>

                {/* ── Interactive Week Switcher & Popover ── */}
                <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto" ref={weekDropdownRef}>
                  {/* Previous Week Button (<) */}
                  <button
                    type="button"
                    onClick={handlePrevWeek}
                    disabled={selectedWeekIndex === 0}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ef3340] text-white transition-all shadow-sm ${
                      selectedWeekIndex === 0
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-red-600 cursor-pointer active:scale-95'
                    }`}
                    title="Previous week"
                    aria-label="Previous week"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Dropdown Toggle Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsWeekDropdownOpen(prev => !prev)}
                      className="flex h-8 items-center gap-2 rounded-lg bg-[#ef3340] px-3 sm:px-4 text-[11px] sm:text-[12px] font-semibold text-white hover:bg-red-600 active:scale-98 transition-all shadow-sm whitespace-nowrap cursor-pointer"
                      aria-haspopup="listbox"
                      aria-expanded={isWeekDropdownOpen}
                      title="Select week"
                    >
                      <span>{currentWeek.label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isWeekDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Popover Menu with Available Weeks */}
                    <AnimatePresence>
                      {isWeekDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.16, ease: 'easeOut' }}
                          className="absolute right-0 sm:left-0 top-10 z-50 w-[270px] sm:w-[290px] rounded-2xl bg-white shadow-2xl border border-neutral-100 overflow-hidden text-neutral-800"
                        >
                          <div className="p-3 bg-neutral-50/80 border-b border-neutral-100 flex items-center justify-between">
                            <span className="text-[11.5px] font-bold text-neutral-900 flex items-center gap-1.5">
                              <Calendar size={13} className="text-[#ef3340]" />
                              Select Work Week
                            </span>
                            <span className="text-[10px] text-neutral-400 font-medium">{WEEKS.length} weeks</span>
                          </div>

                          <div className="py-1.5 max-h-[260px] overflow-y-auto custom-scrollbar">
                            {WEEKS.map((w, index) => {
                              const isSelected = selectedWeekIndex === index
                              return (
                                <button
                                  key={w.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedWeekIndex(index)
                                    setIsWeekDropdownOpen(false)
                                  }}
                                  className={`flex w-full items-center justify-between px-3.5 py-2.5 text-[11.5px] text-left transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#fff1f2] text-[#ef3340] font-bold'
                                      : 'text-neutral-700 hover:bg-neutral-50 font-medium'
                                  }`}
                                >
                                  <div className="min-w-0 pr-2">
                                    <p className="truncate leading-tight">{w.title}</p>
                                    <p className="text-[10px] text-neutral-400 mt-0.5">{w.range}</p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                                      isSelected ? 'bg-red-100 text-[#ef3340] font-bold' : 'bg-neutral-100 text-neutral-500'
                                    }`}>
                                      {w.tasks.length} tasks
                                    </span>
                                    {isSelected && <Check size={14} className="text-[#ef3340]" />}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Next Week Button (>) */}
                  <button
                    type="button"
                    onClick={handleNextWeek}
                    disabled={selectedWeekIndex === allWeeks.length - 1}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ef3340] text-white transition-all shadow-sm ${
                      selectedWeekIndex === allWeeks.length - 1
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-red-600 cursor-pointer active:scale-95'
                    }`}
                    title="Next week"
                    aria-label="Next week"
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Add Task Button */}
                  <button
                    type="button"
                    onClick={() => setIsAddTaskOpen(true)}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white px-3 text-[11px] font-semibold transition-all shadow-sm cursor-pointer ml-1"
                    title="Add new priority task for this week"
                  >
                    <Plus size={14} />
                    <span>Add Task</span>
                  </button>


                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <label className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={searchTask}
                      onChange={(e) => setSearchTask(e.target.value)}
                      placeholder="Search Website or Task..."
                      className="w-[180px] sm:w-[240px] rounded-lg bg-[#f8f9fa] py-2 pl-9 pr-3 text-[11px] focus:outline-none border border-neutral-100 transition-all hover:bg-neutral-100 focus:bg-white focus:border-neutral-300"
                    />
                  </label>

                  {/* Status Filter Dropdown */}
                  <div className="relative" ref={statusDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsStatusDropdownOpen(v => !v)
                        setIsPriorityDropdownOpen(false)
                      }}
                      className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#f8f9fa] px-3 sm:px-4 py-2 text-[11px] font-medium border border-neutral-100 text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <span>Status: {statusFilter}</span>
                      <ChevronDown size={12} />
                    </button>

                    <AnimatePresence>
                      {isStatusDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-9 z-40 w-[150px] rounded-xl bg-white shadow-xl border border-neutral-100 py-1 overflow-hidden"
                        >
                          {['All', 'Review', 'In progress', 'Completed', 'Block'].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setStatusFilter(s)
                                setIsStatusDropdownOpen(false)
                              }}
                              className={`flex w-full items-center justify-between px-3 py-1.5 text-[11px] text-left hover:bg-neutral-50 transition-colors cursor-pointer ${
                                statusFilter === s ? 'font-bold text-[#ef3340] bg-[#fff1f2]' : 'text-neutral-700'
                              }`}
                            >
                              <span>{s}</span>
                              {statusFilter === s && <Check size={12} />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Priority Filter Dropdown */}
                  <div className="relative" ref={priorityDropdownRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPriorityDropdownOpen(v => !v)
                        setIsStatusDropdownOpen(false)
                      }}
                      className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#f8f9fa] px-3 sm:px-4 py-2 text-[11px] font-medium border border-neutral-100 text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <span>Priority: {priorityFilter}</span>
                      <ChevronDown size={12} />
                    </button>

                    <AnimatePresence>
                      {isPriorityDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 top-9 z-40 w-[140px] rounded-xl bg-white shadow-xl border border-neutral-100 py-1 overflow-hidden"
                        >
                          {['All', 'High', 'Medium', 'Low'].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => {
                                setPriorityFilter(p)
                                setIsPriorityDropdownOpen(false)
                              }}
                              className={`flex w-full items-center justify-between px-3 py-1.5 text-[11px] text-left hover:bg-neutral-50 transition-colors cursor-pointer ${
                                priorityFilter === p ? 'font-bold text-[#ef3340] bg-[#fff1f2]' : 'text-neutral-700'
                              }`}
                            >
                              <span>{p}</span>
                              {priorityFilter === p && <Check size={12} />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-neutral-500 whitespace-nowrap">
                  {filteredTasks.length} of {currentWeek.tasks.length} tasks
                </span>
              </div>

              {/* Table Container with Smooth Horizontal Scroll */}
              <div className="w-full overflow-x-auto custom-scrollbar pb-2">
                <div className="min-w-[620px]">
                  <table className="w-full text-left text-[11px] border-separate border-spacing-y-2.5">
                    <thead>
                      <tr className="bg-[#fff1f2] text-neutral-700 select-none">
                        <th 
                          onClick={() => handleSort('website')}
                          className="px-4 sm:px-5 py-3 font-semibold rounded-l-[12px] cursor-pointer hover:bg-red-100/70 transition-colors"
                          title="Click to sort by Website"
                        >
                          <div className="flex items-center gap-2">
                            <span>Website</span>
                            <ArrowUpDown size={12} className={sortField === 'website' ? 'text-[#ef3340]' : 'text-neutral-400'} />
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('priority')}
                          className="px-4 sm:px-5 py-3 font-semibold cursor-pointer hover:bg-red-100/70 transition-colors"
                          title="Click to sort by Priority"
                        >
                          <div className="flex items-center gap-2">
                            <span>Priority</span>
                            <ArrowUpDown size={12} className={sortField === 'priority' ? 'text-[#ef3340]' : 'text-neutral-400'} />
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('due')}
                          className="px-4 sm:px-5 py-3 font-semibold cursor-pointer hover:bg-red-100/70 transition-colors"
                          title="Click to sort by Due Date"
                        >
                          <div className="flex items-center gap-2">
                            <span>Due Date</span>
                            <ArrowUpDown size={12} className={sortField === 'due' ? 'text-[#ef3340]' : 'text-neutral-400'} />
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('status')}
                          className="px-4 sm:px-5 py-3 font-semibold rounded-r-[12px] cursor-pointer hover:bg-red-100/70 transition-colors"
                          title="Click to sort by Status"
                        >
                          <div className="flex items-center gap-2">
                            <span>Status</span>
                            <ArrowUpDown size={12} className={sortField === 'status' ? 'text-[#ef3340]' : 'text-neutral-400'} />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTasks.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-neutral-400 bg-[#f8f9fa] rounded-xl">
                            No tasks found matching your filters for {currentWeek.title}.
                          </td>
                        </tr>
                      ) : (
                        paginatedTasks.map((task, i) => (
                          <tr key={i} className="bg-[#f8f9fa] hover:bg-neutral-100 transition-colors group">
                            <td className="px-4 sm:px-5 py-3 rounded-l-[12px]">
                              <p className="font-bold text-neutral-900 text-[12px]">{task.type}</p>
                              <p className="text-neutral-500 mt-0.5">{task.website}</p>
                            </td>
                            <td className="px-4 sm:px-5 py-3">
                              <PriorityPill priority={task.priority} />
                            </td>
                            <td className="px-4 sm:px-5 py-3">
                              <p className={`font-semibold text-[11px] ${task.overdue ? 'text-[#ef3340]' : 'text-neutral-900'}`}>{task.due}</p>
                              {task.overdue && <p className="text-[#ef3340] mt-0.5 text-[10px] font-medium">Over Due</p>}
                            </td>
                            <td className="px-4 sm:px-5 py-3 rounded-r-[12px]">
                              <button
                                type="button"
                                onClick={() => {
                                  const originalIdx = currentWeek.tasks.findIndex(
                                    (t) => t.website === task.website && t.type === task.type
                                  )
                                  if (originalIdx !== -1) cycleTaskStatus(originalIdx)
                                }}
                                title="Click to cycle status (Review → In progress → Completed → Block)"
                                className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-white hover:shadow-xs transition-all cursor-pointer"
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor(task.status).split(' ')[0]}`} />
                                <span className={`font-semibold ${getStatusColor(task.status).split(' ')[1]}`}>{task.status}</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Working Interactive Pagination */}
              <Pagination
                currentPage={safeTaskPage}
                totalItems={filteredTasks.length}
                pageSize={taskPageSize}
                onPageChange={setTaskPage}
                onPageSizeChange={setTaskPageSize}
                pageSizeOptions={[3, 4, 7, 10]}
              />
            </motion.section>
          </motion.main>
        </div>
      </div>

      {/* ── Add Priority Task Modal ── */}
      <AnimatePresence>
        {isAddTaskOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-neutral-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-[#ef3340]">
                    <Plus size={16} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-neutral-900">Add Priority Task</h3>
                    <p className="text-[11px] text-neutral-500">For {currentWeek.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-3.5 text-[12px]">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Website Name</label>
                  <input
                    type="text"
                    required
                    value={newTaskWebsite}
                    onChange={(e) => setNewTaskWebsite(e.target.value)}
                    placeholder="e.g. Pakka Spice Romeoville"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Task Type</label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                  >
                    <option value="Embedded Ordering">Embedded Ordering</option>
                    <option value="Next.js Migration">Next.js Migration</option>
                    <option value="QA Sign-off">QA Sign-off</option>
                    <option value="Reservation">Reservation</option>
                    <option value="Event Ordering">Event Ordering</option>
                    <option value="Bug Fix">Bug Fix</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Priority</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Status</label>
                    <select
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                    >
                      <option value="Review">Review</option>
                      <option value="In progress">In progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Block">Block</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    placeholder="e.g. Nov 15, 2026"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[12px] focus:border-[#ef3340] focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddTaskOpen(false)}
                    className="rounded-lg bg-neutral-100 px-3.5 py-1.5 text-[11.5px] font-semibold text-neutral-700 hover:bg-neutral-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#ef3340] hover:bg-red-600 text-white px-4 py-1.5 text-[11.5px] font-semibold transition-colors cursor-pointer"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
