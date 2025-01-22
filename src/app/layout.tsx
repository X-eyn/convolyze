'use client'
import { Inter } from 'next/font/google'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
  variable: '--font-inter'
})

const theme = extendTheme({
  fonts: {
    heading: inter.style.fontFamily,
    body: inter.style.fontFamily,
  },
  styles: {
    global: {
      body: {
        fontFamily: inter.style.fontFamily,
        minHeight: '100vh',
        overflowX: 'hidden'
      }
    }
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          {children}
        </ChakraProvider>
      </body>
    </html>
  )
}