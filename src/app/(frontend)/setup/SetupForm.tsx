'use client'

import { useState } from 'react'
import { Button, Heading, Text } from '@/components/ui'

export default function SetupForm() {
  const [secret, setSecret] = useState('')
  const [siteName, setSiteName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, siteName, email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Setup failed.')
        return
      }

      setStatus('done')
      setMessage(data.message || 'Setup complete.')
    } catch {
      setStatus('error')
      setMessage('Network error — check the server is reachable and try again.')
    }
  }

  if (status === 'done') {
    return (
      <div>
        <Heading as="h1" size={4}>Setup complete</Heading>
        <Text tone="muted" className="mt-2">
          {message} <a href="/admin" className="underline text-brand-500">Go to /admin</a>
        </Text>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Heading as="h1" size={4}>First-run setup</Heading>
      <Text tone="muted">Enter the setup password to create the first admin account.</Text>

      <label className="flex flex-col gap-1">
        <span className="text-body-sm text-neutral-400">Setup password</span>
        <input
          type="password"
          required
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="rounded-radius-sm border border-neutral-800 bg-neutral-900 px-3 py-2 text-foreground"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-body-sm text-neutral-400">Site name (optional)</span>
        <input
          type="text"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          className="rounded-radius-sm border border-neutral-800 bg-neutral-900 px-3 py-2 text-foreground"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-body-sm text-neutral-400">Admin email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-radius-sm border border-neutral-800 bg-neutral-900 px-3 py-2 text-foreground"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-body-sm text-neutral-400">Admin password (min 12 characters)</span>
        <input
          type="password"
          required
          minLength={12}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-radius-sm border border-neutral-800 bg-neutral-900 px-3 py-2 text-foreground"
        />
      </label>

      {status === 'error' && (
        <Text size="sm" className="text-semantic-error">{message}</Text>
      )}

      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Setting up…' : 'Run setup'}
      </Button>
    </form>
  )
}
