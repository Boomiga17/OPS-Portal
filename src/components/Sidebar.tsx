import { useState, useRef, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  Boxes,
  Share2,
  ShieldCheck,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Sparkles,
  LogOut,
  X,
  MonitorPlay,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import OrbitLogo from './OrbitLogo'
import OrbitIcon from './OrbitIcon'
import { usePortal } from '../context/PortalContext'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Client Tracker', path: '/client-tracker', icon: Users },
  { label: 'Features', path: '/features', icon: Boxes },
  { label: 'Migration', path: '/migration', icon: Share2 },
  { label: 'Admin Panel', path: '/admin-panel', icon: ShieldCheck },
  { label: 'Presentation', path: '/presentation', icon: MonitorPlay },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isCollapsed, toggleCollapse, isMobileNavOpen, closeMobileNav, openSettings, user } = usePortal()

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    closeMobileNav()
  }, [location.pathname, closeMobileNav])

  return (
    <>
      {/* ── Mobile & Tablet Drawer (below lg) ── */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobileNav}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-over Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="relative w-[280px] max-w-[85vw] h-full bg-[#ef3340] text-white flex flex-col p-5 shadow-2xl z-50 overflow-y-auto custom-scrollbar"
            >
              {/* Header with Logo + Close Button */}
              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/dashboard"
                  onClick={closeMobileNav}
                  className="bg-white sidebar-logo-card rounded-[14px] py-2 px-3.5 flex items-center justify-center shadow-sm"
                  title="Orbit OPS"
                >
                  <OrbitLogo size="sm" showTagline={false} />
                </Link>
                <button
                  type="button"
                  onClick={closeMobileNav}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close navigation"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 custom-scrollbar">
                {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
                  const isActive = location.pathname === path
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={closeMobileNav}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] transition-all ${
                        isActive
                          ? 'font-bold text-white bg-white/20 shadow-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white font-medium'
                      }`}
                    >
                      <Icon size={19} className="shrink-0" />
                      <span className="truncate">{label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Bottom Profile + Settings for Mobile */}
              <div className="mt-auto space-y-2 pt-4 shrink-0 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 py-2 bg-white/10 rounded-xl">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#ef3340] font-bold text-sm shadow-sm">
                    {user.avatarInitial || 'J'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[13px] leading-tight text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-white/70 mt-0.5 truncate">{user.role}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    closeMobileNav()
                    openSettings('profile')
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[12.5px] text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-left font-medium"
                >
                  <Settings size={18} />
                  <span>Settings & Preferences</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeMobileNav()
                    navigate('/login')
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[12.5px] text-white/90 hover:bg-white/20 transition-colors cursor-pointer text-left font-medium"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── Desktop Sticky Sidebar (lg and above) ── */}
      <aside
        className={`hidden lg:flex shrink-0 rounded-[32px] bg-[#ef3340] text-white flex-col shadow-xl sticky top-4 h-[calc(100vh-32px)] z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[76px] p-3' : 'w-[260px] p-6'
        }`}
      >
        {/* ── Logo Section ── */}
        <div className="shrink-0">
          <Link
            to="/dashboard"
            className={`bg-white sidebar-logo-card rounded-[14px] flex items-center justify-center shadow-sm transition-all hover:opacity-95 ${
              isCollapsed ? 'h-12 w-12 mx-auto mb-6 py-1 px-1' : 'py-2.5 px-3.5 mb-8 h-[52px]'
            }`}
            title="Orbit OPS"
          >
            {isCollapsed ? (
              <OrbitIcon size={28} />
            ) : (
              <OrbitLogo size="sm" showTagline={false} />
            )}
          </Link>
        </div>

        {/* ── Navigation Items ── */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-0.5 custom-scrollbar">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path

            return (
              <div key={path} className="relative group">
                <Link
                  to={path}
                  className={`flex items-center rounded-xl text-[12px] transition-all ${
                    isCollapsed
                      ? 'justify-center p-3 w-12 h-12 mx-auto'
                      : 'gap-3 px-4 py-3'
                  } ${
                    isActive
                      ? 'font-semibold text-white bg-white/20 shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  aria-label={label}
                >
                  <Icon size={18} className="shrink-0" />
                  {!isCollapsed && <span className="truncate">{label}</span>}
                </Link>

                {/* Floating Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white text-[11px] font-medium whitespace-nowrap shadow-xl z-50">
                    {label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900" />
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* ── Bottom Section (Profile, Settings, Collapse) ── */}
        <div className="mt-auto space-y-2 pt-4 shrink-0 border-t border-white/10">
          {/* User Profile Card / Button */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className={`flex items-center rounded-xl transition-all cursor-pointer hover:bg-white/10 text-left ${
                isCollapsed
                  ? 'justify-center p-2 w-12 h-12 mx-auto'
                  : 'w-full gap-3 px-3 py-2.5'
              }`}
              title={isCollapsed ? `${user.name} (${user.role})` : undefined}
              aria-label="User profile menu"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#ef3340] font-bold text-sm shadow-sm transition-transform hover:scale-105">
                {user.avatarInitial || 'J'}
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[13px] leading-tight text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-[10.5px] text-white/70 mt-0.5 truncate">{user.role}</p>
                </div>
              )}
            </button>

            {/* Profile Menu Popover */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: isCollapsed ? 0 : 10, x: isCollapsed ? 12 : 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className={`absolute z-50 w-[240px] rounded-2xl bg-white shadow-2xl border border-neutral-100 overflow-hidden text-neutral-800 ${
                    isCollapsed ? 'left-full ml-3 bottom-0' : 'bottom-full mb-3 left-0'
                  }`}
                >
                  <div className="p-4 bg-neutral-50 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ef3340] text-white font-bold text-sm shadow-sm">
                        {user.avatarInitial || 'J'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-neutral-900 truncate leading-tight">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {user.email}
                        </p>
                        <span className="mt-1 inline-block rounded-full bg-[#fff1f2] px-2 py-0.5 text-[10px] font-semibold text-[#ef3340]">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="py-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        openSettings('profile')
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors text-left cursor-pointer"
                    >
                      <User size={15} className="text-neutral-400" />
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        openSettings('appearance')
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors text-left cursor-pointer"
                    >
                      <Sparkles size={15} className="text-neutral-400" />
                      <span>Preferences</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        openSettings('security')
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors text-left cursor-pointer"
                    >
                      <ShieldCheck size={15} className="text-neutral-400" />
                      <span>Security</span>
                    </button>

                    <div className="border-t border-neutral-100 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        navigate('/login')
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-[12px] font-medium text-[#ef3340] hover:bg-[#fff1f2] transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings Button */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => openSettings()}
              className={`flex items-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer ${
                isCollapsed
                  ? 'justify-center p-3 w-12 h-12 mx-auto'
                  : 'w-full gap-3 px-4 py-2.5 text-[12px]'
              }`}
              aria-label="Settings"
            >
              <Settings size={18} className="shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </button>
          </div>

          {/* Collapse / Expand Button */}
          <div className="relative group">
            <button
              type="button"
              onClick={toggleCollapse}
              className={`flex items-center rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer ${
                isCollapsed
                  ? 'justify-center p-3 w-12 h-12 mx-auto'
                  : 'w-full gap-3 px-4 py-2.5 text-[12px]'
              }`}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelLeftOpen size={18} className="shrink-0" />
              ) : (
                <PanelLeftClose size={18} className="shrink-0" />
              )}
              {!isCollapsed && <span>Collapse</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
