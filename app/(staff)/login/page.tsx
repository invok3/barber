'use client'

import { useState } from 'react'

export default function BarberLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 flex flex-col justify-center min-h-screen">
      <h1 className="text-2xl font-extrabold text-stone-700 text-center mb-8">
        دخول الحلاق
      </h1>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-500">رقم الجوال</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05xxxxxxxx"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-500">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <button
          type="submit"
          disabled={!phone || !password}
          className="w-full py-3 bg-stone-800 text-white rounded-xl text-sm font-bold disabled:opacity-40 active:scale-[0.98] transition-transform"
        >
          دخول
        </button>
      </form>
    </div>
  )
}
