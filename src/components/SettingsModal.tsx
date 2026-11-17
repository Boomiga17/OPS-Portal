import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  Palette,
  Bell,
  ShieldCheck,
  Sliders,
  Check,
  Moon,
  Sun,
  Lock,
  Smartphone,
  Laptop,
} from 'lucide-react'
import { usePortal, type UserProfile, type PortalSettings } from '../context/PortalContext'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'workspace', label: 'Workspace', icon: Sliders },
]

function SettingsModalDialog() {
  const {
    closeSettings,
    settingsTab,
    setSettingsTab,
    user,
    updateUser,
    settings,
    updateSettings,
  } = usePortal()

  // Local draft states initialized on mount
  const [profileForm, setProfileForm] = useState<UserProfile>(user)
  const [settingsForm, setSettingsForm] = useState<PortalSettings>(settings)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [passwordState, setPasswordState] = useState({ current: '', newPass: '', confirm: '' })
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null)

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeSettings()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeSettings])

  const handleSave = () => {
    updateUser(profileForm)
    updateSettings(settingsForm)
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      closeSettings()
    }, 850)
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordState.current || !passwordState.newPass) {
      setPasswordMsg('Please fill in current and new password.')
      return
    }
    if (passwordState.newPass !== passwordState.confirm) {
      setPasswordMsg('New passwords do not match.')
      return
    }
    setPasswordMsg('Password updated successfully!')
    setPasswordState({ current: '', newPass: '', confirm: '' })
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeSettings}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[24px] bg-white text-neutral-800 shadow-2xl border border-neutral-100 flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-[#fbfbfb]">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Portal Settings</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Manage your preferences, account details and appearance</p>
          </div>
          <button
            onClick={closeSettings}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body with Tabs */}
        <div className="flex flex-1 flex-col sm:flex-row overflow-hidden min-h-[360px] sm:min-h-[400px]">
          {/* Sidebar Tabs */}
          <div className="w-full sm:w-48 border-b sm:border-b-0 sm:border-r border-neutral-100 bg-[#fafafa] p-2 sm:p-3 flex sm:flex-col overflow-x-auto sm:overflow-visible gap-1.5 sm:gap-0 sm:space-y-1 shrink-0 custom-scrollbar">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSettingsTab(id)}
                className={`flex shrink-0 items-center gap-2 sm:gap-2.5 rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs font-semibold transition-all text-left cursor-pointer ${
                  settingsTab === id
                    ? 'bg-[#ef3340] text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-900'
                }`}
              >
                <Icon size={16} />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* ── PROFILE TAB ── */}
            {settingsTab === 'profile' && (
              <div className="space-y-5">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ef3340] text-white text-xl font-bold shadow-md">
                    {profileForm.name ? profileForm.name.trim().charAt(0).toUpperCase() : 'J'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">{profileForm.name || 'John Doe'}</h3>
                    <p className="text-xs text-neutral-400">{profileForm.email || 'john.doe@orbit.com'}</p>
                    <span className="mt-1 inline-block rounded-full bg-[#fff1f2] px-2 py-0.5 text-[10px] font-semibold text-[#ef3340]">
                      {profileForm.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-[#ef3340] focus:outline-none focus:ring-1 focus:ring-[#ef3340]"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-[#ef3340] focus:outline-none focus:ring-1 focus:ring-[#ef3340]"
                      placeholder="john.doe@orbit.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Role / Position</label>
                    <select
                      value={profileForm.role}
                      onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-[#ef3340] focus:outline-none focus:ring-1 focus:ring-[#ef3340]"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Operations Lead">Operations Lead</option>
                      <option value="QA Lead">QA Lead</option>
                      <option value="Tech Lead">Tech Lead</option>
                      <option value="Site Manager">Site Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-[#ef3340] focus:outline-none focus:ring-1 focus:ring-[#ef3340]"
                      placeholder="Operations Command"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-[#ef3340] focus:outline-none focus:ring-1 focus:ring-[#ef3340]"
                      placeholder="+1 (555) 019-2834"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── APPEARANCE TAB ── */}
            {settingsTab === 'appearance' && (
              <div className="space-y-6">
                {/* Dark Mode */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-neutral-700">
                      {settingsForm.darkMode ? <Moon size={18} /> : <Sun size={18} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Dark Mode</p>
                      <p className="text-[11px] text-neutral-400">Switch color theme for low-light environments</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, darkMode: !settingsForm.darkMode })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      settingsForm.darkMode ? 'bg-[#ef3340]' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settingsForm.darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Density */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">Interface Density</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, density: 'comfortable' })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        settingsForm.density === 'comfortable'
                          ? 'border-[#ef3340] bg-[#fff1f2] text-neutral-900 font-semibold'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      <p className="text-xs font-semibold">Comfortable</p>
                      <p className="text-[10.5px] text-neutral-400 mt-0.5">Spacious paddings, standard sizes</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, density: 'compact' })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        settingsForm.density === 'compact'
                          ? 'border-[#ef3340] bg-[#fff1f2] text-neutral-900 font-semibold'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      <p className="text-xs font-semibold">Compact</p>
                      <p className="text-[10.5px] text-neutral-400 mt-0.5">Tight paddings for maximum screen data</p>
                    </button>
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2">Accent Brand Color</label>
                  <div className="flex items-center gap-3">
                    {[
                      { color: '#ef3340', label: 'Orbit Red' },
                      { color: '#3b82f6', label: 'Royal Blue' },
                      { color: '#10b981', label: 'Emerald' },
                      { color: '#f59e0b', label: 'Amber' },
                      { color: '#8b5cf6', label: 'Purple' },
                    ].map((c) => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, accentColor: c.color })}
                        style={{ backgroundColor: c.color }}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition-transform cursor-pointer ${
                          settingsForm.accentColor === c.color ? 'scale-110 ring-2 ring-offset-2 ring-neutral-400' : 'hover:scale-105'
                        }`}
                        title={c.label}
                      >
                        {settingsForm.accentColor === c.color && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {settingsTab === 'notifications' && (
              <div className="space-y-3">
                {[
                  {
                    key: 'qaAlerts',
                    title: 'QA Sign-off Alerts',
                    desc: 'Get notified when landing pages or websites request QA sign-off',
                  },
                  {
                    key: 'overdueAlerts',
                    title: 'Task Overdue Warnings',
                    desc: 'High-priority notifications for overdue deployment or migration tasks',
                  },
                  {
                    key: 'emailNotifications',
                    title: 'Email Summary Digest',
                    desc: 'Receive daily operations summaries directly to your registered inbox',
                  },
                  {
                    key: 'browserAlerts',
                    title: 'Browser Push Notifications',
                    desc: 'Show real-time toast popups when new migration tasks complete',
                  },
                  {
                    key: 'soundAlerts',
                    title: 'Sound Notification Chimes',
                    desc: 'Play subtle audio chime when critical alerts arrive',
                  },
                ].map(({ key, title, desc }) => {
                  const isChecked = Boolean(settingsForm[key as keyof PortalSettings])
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-100 bg-[#fafafa]"
                    >
                      <div>
                        <p className="text-xs font-bold text-neutral-800">{title}</p>
                        <p className="text-[11px] text-neutral-400">{desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSettingsForm({
                            ...settingsForm,
                            [key]: !isChecked,
                          })
                        }
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                          isChecked ? 'bg-[#ef3340]' : 'bg-neutral-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            isChecked ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── SECURITY TAB ── */}
            {settingsTab === 'security' && (
              <div className="space-y-6">
                {/* Change Password */}
                <form onSubmit={handlePasswordUpdate} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                    <Lock size={15} className="text-[#ef3340]" />
                    <span>Change Password</span>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={passwordState.current}
                      onChange={(e) => setPasswordState({ ...passwordState, current: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-[#ef3340] focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={passwordState.newPass}
                      onChange={(e) => setPasswordState({ ...passwordState, newPass: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-[#ef3340] focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordState.confirm}
                      onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-[#ef3340] focus:outline-none"
                    />
                  </div>

                  {passwordMsg && (
                    <p className={`text-[11px] font-medium ${passwordMsg.includes('successfully') ? 'text-green-600' : 'text-[#ef3340]'}`}>
                      {passwordMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>

                {/* 2FA Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Two-Factor Authentication (2FA)</p>
                    <p className="text-[11px] text-neutral-400">Enhance portal security with multi-step verification</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, twoFactorAuth: !settingsForm.twoFactorAuth })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      settingsForm.twoFactorAuth ? 'bg-[#ef3340]' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settingsForm.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Active Sessions */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-neutral-700">Active Sessions</p>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-[#fafafa]">
                    <div className="flex items-center gap-3">
                      <Laptop size={16} className="text-neutral-500" />
                      <div>
                        <p className="text-xs font-semibold text-neutral-800">Chrome on Windows (Current Session)</p>
                        <p className="text-[10px] text-neutral-400">Chicago, IL • IP 192.168.1.42</p>
                      </div>
                    </div>
                    <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">Active Now</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-[#fafafa]">
                    <div className="flex items-center gap-3">
                      <Smartphone size={16} className="text-neutral-500" />
                      <div>
                        <p className="text-xs font-semibold text-neutral-800">Safari on iPhone 15 Pro</p>
                        <p className="text-[10px] text-neutral-400">Chicago, IL • 2 hours ago</p>
                      </div>
                    </div>
                    <button type="button" className="text-[10px] font-semibold text-[#ef3340] hover:underline cursor-pointer">Revoke</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── WORKSPACE TAB ── */}
            {settingsTab === 'workspace' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Default Landing Screen</label>
                  <select
                    value={settingsForm.defaultPage}
                    onChange={(e) => setSettingsForm({ ...settingsForm, defaultPage: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-[#ef3340] focus:outline-none"
                  >
                    <option value="/dashboard">Dashboard</option>
                    <option value="/client-tracker">Client Tracker</option>
                    <option value="/features">Features</option>
                    <option value="/migration">Migration</option>
                    <option value="/admin-panel">Admin Panel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Auto-Refresh Interval</label>
                  <select
                    value={settingsForm.refreshInterval}
                    onChange={(e) => setSettingsForm({ ...settingsForm, refreshInterval: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 focus:border-[#ef3340] focus:outline-none"
                  >
                    <option value="30s">Every 30 seconds</option>
                    <option value="1m">Every 1 minute (Recommended)</option>
                    <option value="5m">Every 5 minutes</option>
                    <option value="manual">Manual refresh only</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4 bg-[#fbfbfb]">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                <Check size={14} /> Settings saved successfully!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={closeSettings}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-[#ef3340] px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 shadow-sm transition-colors cursor-pointer"
            >
              <Check size={14} /> Save Changes
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function SettingsModal() {
  const { isSettingsOpen } = usePortal()

  return (
    <AnimatePresence>
      {isSettingsOpen && <SettingsModalDialog />}
    </AnimatePresence>
  )
}
