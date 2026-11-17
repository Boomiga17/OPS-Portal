import { useState, useRef, useEffect } from 'react'
import {
  Menu,
  Bell,
  Moon,
  Sun,
  Search,
  X,
  User,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortal } from '../context/PortalContext'

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'QA Sign-off Pending', body: 'Pakka Spice Romeoville needs QA sign-off for embedded ordering.', time: '5m ago', read: false },
  { id: 2, title: 'Migration Complete', body: 'Bheema Next.js website has completed migration successfully.', time: '1h ago', read: false },
  { id: 3, title: 'Task Overdue', body: 'Monks Allen Hotfix bug fix task is 8 days past due date.', time: '3h ago', read: true },
  { id: 4, title: 'New Client Added', body: 'Sangam Restaurant was added to the Client Tracker repository.', time: 'Yesterday', read: true },
  { id: 5, title: 'Ordering Live', body: 'Aaha Kitchen embedded ordering is now live in production.', time: '2 days ago', read: true },
]

interface HeaderProps {
  title?: string
  subtitle?: string
  searchPlaceholder?: string
}

export default function Header({
  title = 'Orbit OPS',
  subtitle = 'Operations Command Center',
  searchPlaceholder = "Search Anything's...",
}: HeaderProps) {
  const navigate = useNavigate()
  const { toggleMobileNav, darkMode, toggleDarkMode, user, openSettings } = usePortal()

  // ── Notifications Dropdown ────────────────────────────────
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const unreadCount = notifications.filter((n) => !n.read).length
  const notifRef = useRef<HTMLDivElement>(null)

  // ── Profile Dropdown ──────────────────────────────────────
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <header className="mb-4 flex items-center justify-between rounded-[16px] bg-white px-3.5 sm:px-5 py-3 shadow-sm border border-neutral-100/80">
      {/* Left: Mobile Hamburger + Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <button
          type="button"
          onClick={toggleMobileNav}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
          aria-label="Open mobile navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1
            className="font-serif text-[17px] sm:text-[22px] tracking-wide text-neutral-800 leading-tight"
            style={{ fontVariant: 'small-caps' }}
          >
            {title}
          </h1>
          <p className="hidden xs:block text-[11px] sm:text-[12px] text-neutral-400 leading-tight mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Search + Action Icons */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Input (visible on md+) */}
        <label className="relative hidden md:block">
          <span className="sr-only">Search</span>
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="w-[180px] lg:w-[260px] rounded-lg bg-[#f8f9fa] py-2 pl-9 pr-3 text-[12px] text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-300 transition-all"
          />
        </label>

        {/* ── Bell / Notifications ── */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v)
              setProfileOpen(false)
            }}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute 1 top-0.5 right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#ef3340] text-[9px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="absolute right-0 top-10 z-50 w-[300px] sm:w-[340px] max-w-[calc(100vw-32px)] rounded-2xl bg-white shadow-2xl border border-neutral-100 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-neutral-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-[#fff1f2] text-[#ef3340] text-[10px] font-bold px-2 py-0.5">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-[11px] text-[#ef3340] hover:underline font-semibold cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                <ul className="max-h-[300px] overflow-y-auto divide-y divide-neutral-50 custom-scrollbar">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-neutral-50 ${
                        !n.read ? 'bg-[#fff8f8]' : ''
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          !n.read ? 'bg-[#ef3340]' : 'bg-neutral-300'
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[12px] font-semibold leading-tight ${
                            !n.read ? 'text-neutral-900' : 'text-neutral-600'
                          }`}
                        >
                          {n.title}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                          {n.body}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-1">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Dark Mode Toggle ── */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* ── Profile Avatar Menu ── */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((v) => !v)
              setNotifOpen(false)
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ef3340] text-[13px] font-bold text-white hover:bg-red-600 transition-transform hover:scale-105 cursor-pointer shadow-sm"
            aria-label="Open profile menu"
          >
            {user.avatarInitial || 'J'}
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="absolute right-0 top-10 z-50 w-[230px] rounded-2xl bg-white shadow-2xl border border-neutral-100 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 bg-neutral-50/60 border-b border-neutral-100">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ef3340] text-white font-bold text-sm shadow-sm">
                    {user.avatarInitial || 'J'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-neutral-900 truncate leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">{user.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-[#fff1f2] px-2 py-0.5 text-[10px] font-semibold text-[#ef3340]">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="py-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      openSettings('profile')
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors text-left cursor-pointer"
                  >
                    <User size={15} className="text-neutral-400" />
                    <span>My Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      openSettings('appearance')
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors text-left cursor-pointer"
                  >
                    <Sparkles size={15} className="text-neutral-400" />
                    <span>Preferences</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      openSettings('security')
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors text-left cursor-pointer"
                  >
                    <ShieldCheck size={15} className="text-neutral-400" />
                    <span>Security</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      openSettings()
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors text-left cursor-pointer"
                  >
                    <Settings size={15} className="text-neutral-400" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-neutral-100 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      navigate('/login')
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-[12px] font-semibold text-[#ef3340] hover:bg-[#fff1f2] transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
