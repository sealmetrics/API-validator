'use client'

import { useState, useEffect } from 'react'
import {
  Header,
  TokenInput,
  EndpointSelector,
  EndpointForm,
  ResultViewer,
  HealthCheck,
  History,
} from '@/components'
import { validateEndpoint } from '@/lib/api'
import type { Account, Endpoint, ValidationResult } from '@/types'

const HISTORY_KEY = 'sealmetrics_validation_history'
const MAX_HISTORY = 50

export default function HomePage() {
  const [apiToken, setApiToken] = useState('')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null)
  const [currentResult, setCurrentResult] = useState<ValidationResult | null>(null)
  const [history, setHistory] = useState<ValidationResult[]>([])
  const [loading, setLoading] = useState(false)

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Save history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    }
  }, [history])

  const handleTokenValidated = (token: string, accountList: Account[]) => {
    setApiToken(token)
    setAccounts(accountList)
    if (!token) {
      // Reset state when token is cleared
      setSelectedEndpoint(null)
      setCurrentResult(null)
    }
  }

  const handleEndpointSelect = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint)
    setCurrentResult(null)
  }

  const handleValidation = async (params: Record<string, unknown>) => {
    if (!selectedEndpoint || !apiToken) return

    setLoading(true)
    try {
      const result = await validateEndpoint(apiToken, selectedEndpoint.id, params)
      setCurrentResult(result)

      // Add to history
      setHistory((prev) => {
        const updated = [result, ...prev].slice(0, MAX_HISTORY)
        return updated
      })
    } catch (err) {
      console.error('Validation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearHistory = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  const handleSelectFromHistory = (result: ValidationResult) => {
    setCurrentResult(result)
  }

  const isAuthenticated = !!apiToken && accounts.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Token Input - Always visible */}
        <div className="mb-8">
          <TokenInput
            onValidated={handleTokenValidated}
            isValidated={isAuthenticated}
          />
        </div>

        {isAuthenticated && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left sidebar - Endpoints */}
            <div className="lg:col-span-4 space-y-6">
              <EndpointSelector
                onSelect={handleEndpointSelect}
                selectedId={selectedEndpoint?.id}
              />
              <HealthCheck apiToken={apiToken} accounts={accounts} />
            </div>

            {/* Main content - Form & Results */}
            <div className="lg:col-span-8 space-y-6">
              {selectedEndpoint ? (
                <>
                  <EndpointForm
                    endpoint={selectedEndpoint}
                    accounts={accounts}
                    onSubmit={handleValidation}
                    loading={loading}
                  />
                  {currentResult && <ResultViewer result={currentResult} />}
                </>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Select an Endpoint
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      Choose an API endpoint from the sidebar to start validating.
                      You can also run a quick health check to test core endpoints.
                    </p>
                  </div>
                </div>
              )}

              {/* History */}
              <History
                results={history}
                onClear={handleClearHistory}
                onSelect={handleSelectFromHistory}
              />
            </div>
          </div>
        )}

        {/* Pre-auth info */}
        {!isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Validate Endpoints
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Test any Sealmetrics API endpoint with custom parameters and see
                real-time responses.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Quick Health Check
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Run a one-click health check to validate core API endpoints and
                ensure everything is working.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-amber-600 dark:text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Session History
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Keep track of all your validations with exportable history stored
                locally in your browser.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Sealmetrics. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://docs.sealmetrics.com"
                className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                Documentation
              </a>
              <a
                href="https://sealmetrics.com"
                className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                Website
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
