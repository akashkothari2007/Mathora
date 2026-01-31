'use client'

import { useState } from 'react'
import LandingScreen from '../components/landing/LandingScreen'
import TeachingView from '../components/teaching/TeachingView'

export default function Home() {
  const [mode, setMode] = useState<'landing' | 'teaching'>('landing')
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const handleSubmit = (text: string) => {
    if (text.trim() === '') {
      setError('Please enter a prompt')
      return
    }
    setPrompt(text)
    setMode('teaching')
    setError(null)
  }
  return (
    <div className = "h-screen w-screen bg-neutral-950 text-white">
      {mode === 'landing' && (
        <LandingScreen handleSubmit = {handleSubmit} error={error}/>
      )}

      {mode === 'teaching' && (
        <TeachingView prompt={prompt} onNewChat={() => {
          setPrompt('')
          setMode('landing')
          setError(null)
        }} />
      )}

    </div>
  )
}