'use client'

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Sealmetrics"
              width={180}
              height={40}
              className="w-[180px] h-10"
            />
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                API Validator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sealmetrics
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <a
              href="https://docs.sealmetrics.com/api"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            >
              API Docs
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://app.sealmetrics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            >
              Dashboard
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
