"use client"

import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import React from 'react'

export default function Home() {
  const user = useUser();

  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div>
          {!user.isSignedIn && <SignInButton />}
          {!!user.isSignedIn && <SignOutButton />}
        </div>
      </main>
  );
}