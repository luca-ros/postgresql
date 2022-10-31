import type { AppProps } from 'next/app'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
// UseState will allow to hold our SupabaseClient
import { useState } from "react"
import { NextUIProvider } from "@nextui-org/react"
import { Box } from '../components/Box'
import NavbarComponent from '../components/NavbarComponent'


function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
    >
      <NextUIProvider>
        <NavbarComponent/>
        <Box css={{ px: "$12", py:"$12", "@xsMax": {px: "$10"}, maxWidth:"800px", margin:"0 auto" }}>
        <Component {...pageProps} />
        </Box>
      </NextUIProvider>
    </SessionContextProvider>
  )
}
export default App
