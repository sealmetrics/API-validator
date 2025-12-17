'use client'

import { CheckCircle2, XCircle, Clock, Database, Link2, Copy, Check, Calendar } from 'lucide-react'
import type { ValidationResult } from '@/types'
import { formatJson, formatResponseTime, getStatusColor, formatDate } from '@/lib/utils'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ResultViewerProps {
  result: ValidationResult
}

export function ResultViewer({ result }: ResultViewerProps) {
  const [copied, setCopied] = useState(false)
  const [showFullResponse, setShowFullResponse] = useState(false)

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const responseJson = formatJson(result.response_data)
  const truncatedJson = responseJson.length > 2000 && !showFullResponse
    ? responseJson.slice(0, 2000) + '\n... (truncated)'
    : responseJson

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div
        className={cn(
          'p-4 border-b',
          result.success
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        )}
      >
        <div className="flex items-center gap-3">
          {result.success ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {result.endpoint_name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {result.success ? 'Validation successful' : 'Validation failed'}
            </p>
          </div>
          <span
            className={cn(
              'text-2xl font-bold',
              getStatusColor(result.status_code)
            )}
          >
            {result.status_code || 'ERR'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 divide-x divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700">
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Response Time</span>
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {formatResponseTime(result.response_time_ms)}
          </p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <Database className="w-4 h-4" />
            <span className="text-xs">Records</span>
          </div>
          <p className="text-lg font-semibold text-slate-900 dark:text-white">
            {result.data_count ?? '-'}
          </p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">Latest Data</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {result.latest_data_date ?? '-'}
          </p>
        </div>
        <div className="p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Timestamp</span>
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {formatDate(result.timestamp)}
          </p>
        </div>
      </div>

      {/* Request URL */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Link2 className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Request URL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-xs font-mono text-slate-600 dark:text-slate-400 overflow-x-auto">
            {result.request_url}
          </code>
          <button
            onClick={() => copyToClipboard(result.request_url)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error message if any */}
      {result.error_message && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-red-50 dark:bg-red-900/10">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            Error: {result.error_message}
          </p>
        </div>
      )}

      {/* Response data */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Response Data
          </span>
          <button
            onClick={() => copyToClipboard(responseJson)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy JSON
          </button>
        </div>
        <pre className="px-4 py-3 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto">
          {truncatedJson}
        </pre>
        {responseJson.length > 2000 && (
          <button
            onClick={() => setShowFullResponse(!showFullResponse)}
            className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {showFullResponse ? 'Show less' : 'Show full response'}
          </button>
        )}
      </div>
    </div>
  )
}
