import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuroraBackground from '../components/AuroraBackground'
import BrisqueLogo from '../components/BrisqueLogo'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@brisque.com')
  const [password, setPassword] = useState('password123')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    setSubmitting(true)
    try {
      // TODO: wire up to real auth endpoint
      await new Promise((resolve) => setTimeout(resolve, 600))
      navigate('/dashboard')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
      <AuroraBackground />

      <div className="relative z-10 w-full max-w-[380px] rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-100">
        <div className="text-center">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Brisque OPS
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-500">
            Sign in to the operations console
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-800"
            >
              Email<span className="text-brisque-red">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="jhon.doe@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-0 border-b border-neutral-200 bg-transparent py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brisque-red focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-800"
            >
              Password<span className="text-brisque-red">*</span>
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-0 border-b border-neutral-200 bg-transparent py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brisque-red focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-brisque-red">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brisque-red py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brisque-red-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full text-center text-xs text-neutral-500 hover:text-[#ef3340] font-medium transition-colors cursor-pointer py-1"
          >
            Instant Demo Access (Skip Login) →
          </button>
        </form>
      </div>

      <div className="relative z-10 mt-6">
        <BrisqueLogo />
      </div>
    </div>
  )
}
