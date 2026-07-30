'use client'

import { useState } from 'react'

interface Props {
  customerName: string;
  workStart: string;
  workEnd: string;
  onConfirm: (hour: string, minute: string) => void;
  onClose: () => void;
}

export default function RearrangeModal({ customerName, workStart, workEnd, onConfirm, onClose }: Props) {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const hours = Array.from(
    { length: Number(workEnd.split(':')[0]) - Number(workStart.split(':')[0]) },
    (_, i) => String(Number(workStart.split(':')[0]) + i).padStart(2, '0')
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-screen landscape:w-[50vh] max-w-[50vh] mx-4 p-6 space-y-4">
        <p className="text-lg font-bold text-stone-700 text-center">إعادة جدولة</p>
        <p className="text-sm text-stone-500 text-center">{customerName}</p>
        <div className="flex gap-2">
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-sm text-center appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            <option value="" disabled>ساعة</option>
            {hours.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          <select
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-sm text-center appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-stone-400"
          >
            <option value="" disabled>دقيقة</option>
            <option value="00">00</option>
            <option value="30">30</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-stone-200 rounded-xl text-sm font-medium text-stone-600">
            تراجع
          </button>
          <button
            onClick={() => onConfirm(hour, minute)}
            disabled={!hour || !minute}
            className="flex-1 py-3 bg-stone-800 text-white rounded-xl text-sm font-bold disabled:opacity-40"
          >
            تأكيد
          </button>
        </div>
      </div>
    </div>
  )
}
