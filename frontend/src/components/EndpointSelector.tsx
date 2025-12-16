'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Server, BarChart3, Zap } from 'lucide-react'
import { getEndpoints } from '@/lib/api'
import type { Endpoint } from '@/types'
import { cn } from '@/lib/utils'

interface EndpointSelectorProps {
  onSelect: (endpoint: Endpoint) => void
  selectedId?: string
}

const categoryIcons = {
  authentication: Server,
  reports: BarChart3,
  events: Zap,
}

const categoryLabels = {
  authentication: 'Authentication',
  reports: 'Reports',
  events: 'Event Tracking',
}

export function EndpointSelector({ onSelect, selectedId }: EndpointSelectorProps) {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['authentication', 'reports'])
  )

  useEffect(() => {
    async function loadEndpoints() {
      try {
        const data = await getEndpoints()
        setEndpoints(data)
      } catch (err) {
        console.error('Failed to load endpoints:', err)
      } finally {
        setLoading(false)
      }
    }
    loadEndpoints()
  }, [])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const groupedEndpoints = endpoints.reduce(
    (acc, endpoint) => {
      if (!acc[endpoint.category]) {
        acc[endpoint.category] = []
      }
      acc[endpoint.category].push(endpoint)
      return acc
    },
    {} as Record<string, Endpoint[]>
  )

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 bg-slate-100 dark:bg-slate-700/50 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          API Endpoints
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select an endpoint to validate
        </p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {Object.entries(groupedEndpoints).map(([category, categoryEndpoints]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons] || Server
          const isExpanded = expandedCategories.has(category)

          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="flex-1 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                  {categoryLabels[category as keyof typeof categoryLabels] || category}
                </span>
                <span className="text-xs text-slate-400 mr-2">
                  {categoryEndpoints.length}
                </span>
                <ChevronRight
                  className={cn(
                    'w-4 h-4 text-slate-400 transition-transform',
                    isExpanded && 'rotate-90'
                  )}
                />
              </button>

              {isExpanded && (
                <div className="bg-slate-50 dark:bg-slate-900/50">
                  {categoryEndpoints.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => onSelect(endpoint)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 pl-12 text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors border-l-2',
                        selectedId === endpoint.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-transparent'
                      )}
                    >
                      <span
                        className={cn(
                          'shrink-0 px-2 py-0.5 rounded text-xs font-medium',
                          endpoint.method === 'GET'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        )}
                      >
                        {endpoint.method}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {endpoint.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono">
                          {endpoint.path}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
