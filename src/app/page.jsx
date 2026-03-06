'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function IndexPage() {
  const router = useRouter()

  useEffect(() => {
    // 1. Define supported locales and fallback
    const supportedLocales = ['en', 'fr', 'pt']
    let targetLocale = 'en'

    // 2. Read the browser's language safely on the client
    // navigator.language returns strings like "en-US", "fr-FR", or "pt-BR"
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.substring(0, 2).toLowerCase()
      
      if (supportedLocales.includes(browserLang)) {
        targetLocale = browserLang
      }
    }

    // 3. Redirect to the matched language route
    // Using .replace() so the user doesn't get stuck if they hit the "Back" button
    router.replace(`/${targetLocale}`)
  }, [router])

  // Return a blank page or a simple loading state while the redirect happens
  return null 
}