'use client'

import { History as HistoryIcon, CheckCircle2, XCircle, Trash2, Download } from 'lucide-react'
import type { ValidationResult } from '@/types'
import { formatDate, formatResponseTime, cn } from '@/lib/utils'

interface HistoryProps {
  results: ValidationResult[]
  onClear: () => void
  onSelect: (result: ValidationResult) => void
}

export function History({ results, onClear, onSelect }: HistoryProps) {
  const handleExport = () => {
    const json = JSON.stringify(results, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sealmetrics-validation-history-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <HistoryIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Validation History
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {results.length} validation{results.length !== 1 ? 's' : ''} in session
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-80 overflow-y-auto">
        {results.map((result, index) => (
          <button
            key={`${result.endpoint_id}-${result.timestamp}-${index}`}
            onClick={() => onSelect(result)}
            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
          >
            {result.success ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {result.endpoint_name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(result.timestamp)}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  'text-sm font-mono',
                  result.success ? 'text-green-600' : 'text-red-600'
                )}
              >
                {result.status_code || 'ERR'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatResponseTime(result.response_time_ms)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
