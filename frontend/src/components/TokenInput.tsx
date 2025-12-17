'use client'

import { useState } from 'react'
import { Key, Loader2, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react'
import { validateToken } from '@/lib/api'
import type { Account } from '@/types'

interface TokenInputProps {
  onValidated: (token: string, accounts: Account[]) => void
  isValidated: boolean
}

export function TokenInput({ onValidated, isValidated }: TokenInputProps) {
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleValidate = async () => {
    if (!token.trim()) {
      setError('Please enter your API token')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await validateToken(token)
      if (result.valid) {
        onValidated(token, result.accounts)
      } else {
        setError(result.error || 'Invalid API token')
      }
    } catch (err) {
      setError('Failed to validate token. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValidate()
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
          <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            API Authentication
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter your Sealmetrics API token to start validating endpoints
          </p>
        </div>
        {isValidated && (
          <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
        )}
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type={showToken ? 'text' : 'password'}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your API token..."
            disabled={isValidated || loading}
            className="w-full px-4 py-3 pr-24 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showToken ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <XCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleValidate}
            disabled={isValidated || loading || !token.trim()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Validating...
              </>
            ) : isValidated ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Validated
              </>
            ) : (
              'Validate Token'
            )}
          </button>

          {isValidated && (
            <button
              onClick={() => {
                setToken('')
                setError(null)
                onValidated('', [])
              }}
              className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-sm transition-colors"
            >
              Change Token
            </button>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Find your API token in{' '}
          <a
            href="https://app.sealmetrics.com/connectors"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Connectors
          </a>
        </p>
      </div>
    </div>
  )
}
