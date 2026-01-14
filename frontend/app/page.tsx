'use client'

import { useState } from 'react'
import LandingScreen from '../components/landing/LandingScreen'
import TeachingView from '../components/teaching/TeachingView'

export default function Home() {
  const [mode, setMode] = useState<'landing' | 'teaching'>('landing')
  const [prompt, setPrompt] = useState('')
  return (
    <div className = "h-screen w-screen bg-neutral-950 text-white">
      {mode === 'landing' && (
        <LandingScreen onSubmit = {(text) => {
          setPrompt(text)
          setMode('teaching')
        }} />
      )}

      {mode === 'teaching' && (
        <TeachingView 
        prompt = {prompt} 
        onNewChat = {() => {  
          setPrompt('')
          setMode('landing')
        }} />
      )}

    </div>
  )
}