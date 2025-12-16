'use client'

import { useState, useEffect } from 'react'
import { Play, Loader2, Info } from 'lucide-react'
import type { Endpoint, Account, EndpointParameter } from '@/types'
import { cn } from '@/lib/utils'

interface EndpointFormProps {
  endpoint: Endpoint
  accounts: Account[]
  onSubmit: (params: Record<string, unknown>) => void
  loading: boolean
}

export function EndpointForm({ endpoint, accounts, onSubmit, loading }: EndpointFormProps) {
  const [params, setParams] = useState<Record<string, unknown>>({})

  // Reset params when endpoint changes
  useEffect(() => {
    const defaults: Record<string, unknown> = {}
    endpoint.parameters.forEach((param) => {
      if (param.default !== undefined) {
        defaults[param.name] = param.default
      }
      // Auto-select first account if account_id is required
      if (param.name === 'account_id' && accounts.length > 0) {
        defaults[param.name] = accounts[0].id
      }
    })
    setParams(defaults)
  }, [endpoint, accounts])

  const updateParam = (name: string, value: unknown) => {
    setParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(params)
  }

  const renderInput = (param: EndpointParameter) => {
    const value = params[param.name] ?? ''

    // Account selector
    if (param.name === 'account_id') {
      return (
        <select
          value={String(value)}
          onChange={(e) => updateParam(param.name, e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select account...</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name || account.id}
            </option>
          ))}
        </select>
      )
    }

    // Enum/select
    if (param.type === 'enum' && param.options) {
      return (
        <select
          value={String(value)}
          onChange={(e) => updateParam(param.name, e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {!param.required && <option value="">None</option>}
          {param.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    }

    // Boolean
    if (param.type === 'boolean') {
      return (
        <select
          value={String(value)}
          onChange={(e) => updateParam(param.name, e.target.value === 'true')}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="false">false</option>
          <option value="true">true</option>
        </select>
      )
    }

    // Integer
    if (param.type === 'integer') {
      return (
        <input
          type="number"
          value={String(value)}
          onChange={(e) => updateParam(param.name, parseInt(e.target.value) || '')}
          placeholder={param.default?.toString() || ''}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )
    }

    // Default: string input
    return (
      <input
        type="text"
        value={String(value)}
        onChange={(e) => updateParam(param.name, e.target.value)}
        placeholder={`Enter ${param.name}...`}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-2 py-0.5 rounded text-xs font-medium',
              endpoint.method === 'GET'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            )}
          >
            {endpoint.method}
          </span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {endpoint.name}
          </h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {endpoint.description}
        </p>
        <code className="inline-block mt-2 px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 text-xs font-mono text-slate-600 dark:text-slate-400">
          {endpoint.path}
        </code>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {endpoint.parameters.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4" />
            This endpoint has no parameters
          </div>
        ) : (
          <div className="space-y-4">
            {endpoint.parameters.map((param) => (
              <div key={param.name}>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {param.name}
                  {param.required && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                </label>
                {renderInput(param)}
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {param.description}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Validation
            </>
          )}
        </button>
      </form>
    </div>
  )
}
