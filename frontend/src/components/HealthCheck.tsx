'use client'

import { useState } from 'react'
import { HeartPulse, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { runHealthCheck } from '@/lib/api'
import type { Account, HealthCheckResult } from '@/types'
import { cn, formatResponseTime, getHealthStatusColor } from '@/lib/utils'

interface HealthCheckProps {
  apiToken: string
  accounts: Account[]
}

export function HealthCheck({ apiToken, accounts }: HealthCheckProps) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<HealthCheckResult | null>(null)

  const handleRun = async () => {
    if (!selectedAccount) return

    setLoading(true)
    try {
      const data = await runHealthCheck(apiToken, selectedAccount)
      setResult(data)
    } catch (err) {
      console.error('Health check failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30">
            <HeartPulse className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Quick Health Check
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Validate core API endpoints in one click
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
            Select Account
          </label>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name || account.id}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRun}
          disabled={loading || !selectedAccount}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running Health Check...
            </>
          ) : (
            <>
              <HeartPulse className="w-4 h-4" />
              Run Health Check
            </>
          )}
        </button>

        {result && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            {/* Overall Status */}
            <div
              className={cn(
                'flex items-center justify-between p-4 rounded-lg',
                getHealthStatusColor(result.overall_status)
              )}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(result.overall_status)}
                <span className="font-semibold capitalize">
                  {result.overall_status}
                </span>
              </div>
              <span className="text-sm">
                {result.successful}/{result.total_endpoints} passed
              </span>
            </div>

            {/* Time Summary */}
            <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Total time: {formatResponseTime(result.total_time_ms)}
            </div>

            {/* Individual Results */}
            <div className="space-y-2">
              {result.results.map((r) => (
                <div
                  key={r.endpoint_id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {r.success ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {r.endpoint_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-slate-500 dark:text-slate-400">
                        {formatResponseTime(r.response_time_ms)}
                      </span>
                      <span
                        className={cn(
                          'font-mono',
                          r.success ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {r.status_code || 'ERR'}
                      </span>
                    </div>
                  </div>
                  {r.success && (r.latest_data_date || r.data_count !== undefined) && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      {r.latest_data_date && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Latest: <span className="font-medium text-slate-700 dark:text-slate-300">{r.latest_data_date}</span>
                        </span>
                      )}
                      {r.data_count !== undefined && r.data_count !== null && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                          </svg>
                          Rows: <span className="font-medium text-slate-700 dark:text-slate-300">{r.data_count.toLocaleString()}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
