"use client";

import { useState } from 'react'
import { Lock, Zap, ChevronRight } from 'lucide-react'
// import AuthModal from '@/app/components/authentication/auth-modal'
// import AuthModal from './auth-modal'

export default function RightSection() {
  const [, setShowAuthModal] = useState(false);
  const [, setAuthType] = useState<'signup' | 'login'>('signup');

  const handleAuthClick = (type: 'signup' | 'login') => {
    setAuthType(type);
    setShowAuthModal(true);
  }

  return (
    <div className="w-80 p-4 space-y-4">
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="font-bold text-lg mb-2">Unlock Leaderboards!</h2>
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 p-2 rounded-full">
            <Lock className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">Complete 10 more lessons to start competing</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg">Daily Quests</h2>
          <button className="text-[#1cb0f6] text-sm font-bold">VIEW ALL</button>
        </div>
        <div className="flex items-center space-x-3">
          <Zap className="w-6 h-6 text-yellow-400" />
          <div className="flex-grow">
            <p className="text-sm font-bold">Earn 10 XP</p>
            <div className="bg-gray-200 h-2 rounded-full mt-1">
              <div className="bg-[#1cb0f6] h-full rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
          <div className="bg-[#fff0d4] p-1 rounded">
            <ChevronRight className="w-4 h-4 text-[#ffc800]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="font-bold text-lg mb-2">Create a profile to save your progress!</h2>
        <button
          onClick={() => handleAuthClick('signup')}
          className="w-full bg-[#58cc02] text-white font-bold py-3 rounded-2xl mb-2 hover:bg-[#4caf00]"
        >
          CREATE A PROFILE
        </button>
        <button
          onClick={() => handleAuthClick('login')}
          className="w-full bg-[#1cb0f6] text-white font-bold py-3 rounded-2xl hover:bg-[#18a0e1]"
        >
          SIGN IN
        </button>
      </div>

      <footer className="text-center text-sm text-gray-500 space-y-2">
        <div className="space-x-2">
          <a href="#" className="hover:underline">ABOUT</a>
          <a href="#" className="hover:underline">BLOG</a>
          <a href="#" className="hover:underline">STORE</a>
          <a href="#" className="hover:underline">EFFICACY</a>
          <a href="#" className="hover:underline">CAREERS</a>
        </div>
        <div className="space-x-2">
          <a href="#" className="hover:underline">INVESTORS</a>
          <a href="#" className="hover:underline">TERMS</a>
          <a href="#" className="hover:underline">PRIVACY</a>
        </div>
      </footer>

      {/* {showAuthModal && (
        <AuthModal
          initialView={authType}
          onClose={() => setShowAuthModal(false)}
        />
      )} */}
    </div>
  )
}