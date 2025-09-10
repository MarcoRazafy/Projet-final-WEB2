import React from 'react';
import Navbar from './Navbar';

export default function Shell({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  )
}

