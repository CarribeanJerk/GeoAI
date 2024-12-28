import { SignInButton } from '@clerk/nextjs'
import React from 'react'

export default async function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <SignInButton />
      </main>
  );
} 