'use client'

// app/page.tsx
import { redirect } from 'next/navigation'
import { DEMO_MODE } from './demo/demoConfig'

export default function Home() {
  redirect(DEMO_MODE ? '/demo' : '/auth/login')
}